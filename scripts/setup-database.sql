-- EasyGlobe Blog System Database Setup
-- Run this SQL in your Supabase SQL editor

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  author TEXT,
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  reading_time TEXT,
  excerpt TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured BOOLEAN DEFAULT FALSE,
  featured_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog_tags table
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog_post_tags junction table
CREATE TABLE IF NOT EXISTS blog_post_tags (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, tag_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author);
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);
CREATE INDEX IF NOT EXISTS idx_blog_tags_post_count ON blog_tags(post_count DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can read published posts" ON blog_posts;
DROP POLICY IF EXISTS "Public can read tags" ON blog_tags;
DROP POLICY IF EXISTS "Public can read post-tag relationships" ON blog_post_tags;

-- Create policies for public read access
CREATE POLICY "Public can read published posts" ON blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can read tags" ON blog_tags
  FOR SELECT USING (true);

CREATE POLICY "Public can read post-tag relationships" ON blog_post_tags
  FOR SELECT USING (true);

-- Create trigger function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;

-- Create trigger to update updated_at column
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE
ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update tag post counts
CREATE OR REPLACE FUNCTION update_tag_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE blog_tags 
        SET post_count = post_count + 1 
        WHERE id = NEW.tag_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE blog_tags 
        SET post_count = post_count - 1 
        WHERE id = OLD.tag_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop triggers if they exist
DROP TRIGGER IF EXISTS update_tag_count_on_insert ON blog_post_tags;
DROP TRIGGER IF EXISTS update_tag_count_on_delete ON blog_post_tags;

-- Create triggers to maintain tag post counts
CREATE TRIGGER update_tag_count_on_insert
    AFTER INSERT ON blog_post_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_post_count();

CREATE TRIGGER update_tag_count_on_delete
    AFTER DELETE ON blog_post_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_post_count();

-- Insert sample data (optional)
INSERT INTO blog_posts (
  slug, 
  title, 
  description, 
  content, 
  author, 
  tags, 
  status, 
  reading_time, 
  excerpt,
  featured
) VALUES (
  'welcome-to-easyglobe-blog-system',
  'Welcome to EasyGlobe Blog System',
  'Get started with the most flexible and powerful blog system for Next.js applications.',
  '# Welcome to EasyGlobe Blog System

We''re excited to introduce you to the most flexible and powerful blog system for Next.js applications!

## Features

- **Easy Setup**: Get your blog running in minutes
- **Supabase Integration**: Powerful database with real-time capabilities
- **Fully Customizable**: Modify components and styling to match your brand
- **SEO Optimized**: Built-in SEO best practices
- **TypeScript Support**: Full type safety throughout

## Getting Started

1. Install the package
2. Set up your Supabase database
3. Configure your environment variables
4. Start creating content!

Check out our [installation guide](/docs/INSTALLATION.md) for detailed instructions.

## What''s Next?

- Create your first blog post
- Customize the styling
- Set up your content management workflow
- Deploy to production

We can''t wait to see what you build with EasyGlobe Blog System!',
  'EasyGlobe Team',
  ARRAY['announcement', 'getting-started', 'blog-system'],
  'published',
  '3 min read',
  'Get started with the most flexible and powerful blog system for Next.js applications. Learn about features and setup.',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Insert sample tags
INSERT INTO blog_tags (name, slug, description, post_count) VALUES
  ('Getting Started', 'getting-started', 'Introductory articles and tutorials', 1),
  ('Announcement', 'announcement', 'Product announcements and updates', 1),
  ('Blog System', 'blog-system', 'Articles about the blog system itself', 1),
  ('Tutorial', 'tutorial', 'Step-by-step guides and tutorials', 0),
  ('Tips', 'tips', 'Helpful tips and tricks', 0)
ON CONFLICT (slug) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'EasyGlobe Blog System database setup completed successfully!';
  RAISE NOTICE 'You can now start using your blog system.';
  RAISE NOTICE 'Check the documentation for next steps: /docs/INSTALLATION.md';
END $$;