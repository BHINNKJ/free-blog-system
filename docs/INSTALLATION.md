# Installation Guide

## Prerequisites

- Node.js 18+ 
- Next.js 13+ (App Router)
- A Supabase account and project

## Step-by-Step Installation

### 1. Install the Package

```bash
npm install easyglobe-blog-system @supabase/supabase-js lucide-react
```

Or with yarn:
```bash
yarn add easyglobe-blog-system @supabase/supabase-js lucide-react
```

### 2. Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Run Database Migration**
   
   Copy and paste this SQL in your Supabase SQL editor:

```sql
-- Create blog_posts table
CREATE TABLE blog_posts (
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
CREATE TABLE blog_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog_post_tags junction table (if you want to use separate tag relationships)
CREATE TABLE blog_post_tags (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true;

-- Enable RLS (Row Level Security)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read published posts" ON blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can read tags" ON blog_tags
  FOR SELECT USING (true);

CREATE POLICY "Public can read post-tag relationships" ON blog_post_tags
  FOR SELECT USING (true);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE
ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Add Tailwind CSS (if not already installed)

The blog system uses Tailwind CSS for styling. If you don't have it installed:

```bash
npm install -D tailwindcss postcss autoprefixer @tailwindcss/typography
npx tailwindcss init -p
```

Update your `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/easyglobe-blog-system/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

Add Tailwind directives to your CSS file (e.g., `app/globals.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. Initialize the Blog System

#### Option A: App Router (Recommended)

Create or update your root layout (`app/layout.tsx`):

```tsx
import './globals.css'
import { BlogSystem } from 'easyglobe-blog-system'

const blogConfig = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  tables: {
    blogPosts: 'blog_posts',
    blogTags: 'blog_tags',
    blogPostTags: 'blog_post_tags',
  },
  ui: {
    postsPerPage: 12,
    showSearch: true,
    showTags: true,
    showAuthor: true,
    showReadingTime: true,
    showFeaturedImage: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <BlogSystem config={blogConfig}>
          {children}
        </BlogSystem>
      </body>
    </html>
  )
}
```

#### Option B: Pages Router

Update your `pages/_app.tsx`:

```tsx
import type { AppProps } from 'next/app'
import { BlogSystem } from 'easyglobe-blog-system'
import './globals.css'

const blogConfig = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  tables: {
    blogPosts: 'blog_posts',
    blogTags: 'blog_tags',
    blogPostTags: 'blog_post_tags',
  },
  ui: {
    postsPerPage: 12,
    showSearch: true,
    showTags: true,
    showAuthor: true,
    showReadingTime: true,
    showFeaturedImage: true,
  },
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <BlogSystem config={blogConfig}>
      <Component {...pageProps} />
    </BlogSystem>
  )
}
```

### 6. Create Blog Pages

#### Blog List Page

**App Router** (`app/blog/page.tsx`):
```tsx
import { Metadata } from 'next'
import { getBlogPosts, BlogList } from 'easyglobe-blog-system'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Explore our latest articles and insights.',
}

export default async function BlogPage() {
  try {
    const posts = await getBlogPosts()
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
          <p className="text-lg text-gray-600">
            Explore our latest articles and insights
          </p>
        </div>
        <BlogList posts={posts} />
      </div>
    )
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-gray-600">Unable to load blog posts at this time.</p>
        </div>
      </div>
    )
  }
}
```

**Pages Router** (`pages/blog/index.tsx`):
```tsx
import { GetStaticProps } from 'next'
import { BlogList, getBlogPosts, BlogPost } from 'easyglobe-blog-system'

interface BlogPageProps {
  posts: BlogPost[]
}

export default function BlogPage({ posts }: BlogPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
        <p className="text-lg text-gray-600">
          Explore our latest articles and insights
        </p>
      </div>
      <BlogList posts={posts} />
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const posts = await getBlogPosts()
    return {
      props: { posts },
      revalidate: 3600, // Revalidate every hour
    }
  } catch (error) {
    return {
      props: { posts: [] },
      revalidate: 60, // Retry after 1 minute
    }
  }
}
```

#### Blog Post Page

**App Router** (`app/blog/[slug]/page.tsx`):
```tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'
import { getBlogPost, BlogContent } from 'easyglobe-blog-system'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  
  if (!post) {
    return { title: 'Post Not Found' }
  }
  
  return {
    title: post.title,
    description: post.description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.description || post.excerpt,
      type: 'article',
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  
  if (!post) {
    notFound()
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>
      </div>
      
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          {post.description && (
            <p className="text-xl text-gray-600 mb-6">{post.description}</p>
          )}
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(post.published_at).toLocaleDateString()}
            </div>
            {post.reading_time && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {post.reading_time}
              </div>
            )}
            {post.author && (
              <div>By {post.author}</div>
            )}
          </div>
        </header>
        
        {post.featured_image && (
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
        )}
        
        <BlogContent content={post.content} />
      </article>
    </div>
  )
}
```

### 7. Add Sample Data (Optional)

You can add some sample blog posts directly in Supabase:

```sql
INSERT INTO blog_posts (
  slug, title, description, content, author, tags, status, reading_time, excerpt
) VALUES (
  'welcome-to-our-blog',
  'Welcome to Our Blog',
  'Our first blog post introducing our new blog system.',
  '# Welcome to Our Blog\n\nThis is our first blog post! We''re excited to share our thoughts and insights with you.\n\n## What to Expect\n\n- Industry insights\n- Technical tutorials\n- Company updates\n\nStay tuned for more content!',
  'Admin',
  ARRAY['announcement', 'welcome'],
  'published',
  '2 min read',
  'Our first blog post introducing our new blog system. We''re excited to share our thoughts and insights with you.'
);
```

### 8. Test Your Installation

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/blog`

3. You should see your blog page with any posts you've added!

## Next Steps

- [Customize the styling](./CUSTOMIZATION.md)
- [Add content management](./CONTENT_MANAGEMENT.md)
- [Deploy your blog](./DEPLOYMENT.md)
- [Set up SEO optimization](./SEO.md)

## Troubleshooting

### Common Issues

1. **"Supabase client not initialized"**
   - Make sure you've added the BlogSystem wrapper to your layout
   - Check that your environment variables are set correctly

2. **"Table doesn't exist"**
   - Make sure you've run the database migration SQL
   - Check that your table names in the config match your actual table names

3. **"No posts showing"**
   - Make sure you have posts with `status = 'published'`
   - Check your RLS policies are set up correctly
   - Verify your environment variables are correct

4. **Styling issues**
   - Make sure Tailwind CSS is installed and configured
   - Add the package path to your Tailwind content array
   - Import the CSS file in your layout

For more help, check our [FAQ](./FAQ.md) or open an issue on GitHub.