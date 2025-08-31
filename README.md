# Free Blog System (Vercel + Supabase)

🚀 **A complete, free, and open-source blog system** that you can deploy in 5 minutes using Vercel and Supabase.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FBHINNKJ%2Ffree-blog-system&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Supabase%20credentials%20required&envLink=https%3A%2F%2Fsupabase.com%2Fdashboard%2Fproject%2F_%2Fsettings%2Fapi)

## ✨ Features

- 📝 **Complete Blog System** - Posts, tags, search, and content management
- 🗄️ **Supabase Integration** - Free database with real-time capabilities
- ⚡ **Vercel Deployment** - One-click deployment with global CDN
- 🎨 **Customizable Design** - Beautiful, responsive components
- 🔍 **Search & Filtering** - Built-in search and tag-based filtering
- 📱 **Mobile Responsive** - Perfect on all devices
- 🎯 **TypeScript Support** - Full type safety
- 🆓 **100% Free** - No hidden costs, completely open-source
- ⚡ **Lightning Fast** - Optimized for performance
- 🔒 **Secure** - Built-in security with RLS

## 🎯 Perfect For

- Personal blogs and portfolios
- Company blogs and news sites
- Documentation sites
- Content creators and writers
- Small businesses
- Open-source projects
- Anyone who wants a free, powerful blog

## 🚀 Quick Deploy (5 minutes)

### Option 1: One-Click Deploy with Vercel

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Create a new Supabase project at [supabase.com](https://supabase.com)
4. Add your Supabase credentials to Vercel environment variables
5. Your blog is live! 🎉

### Option 2: Manual Setup

1. **Fork this repository**

2. **Create Supabase project**
   ```bash
   # Go to supabase.com and create a new project
   # Copy your project URL and anon key
   ```

3. **Set up database**
   ```sql
   -- Run the SQL in scripts/setup-database.sql in Supabase SQL editor
   ```

4. **Deploy to Vercel**
   ```bash
   # Connect your forked repo to Vercel
   # Add environment variables:
   # NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   # NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Quick Start

### 1. Installation

```bash
npm install easyglobe-blog-system @supabase/supabase-js
# or
yarn add easyglobe-blog-system @supabase/supabase-js
```

### 2. Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Database Setup

Run the following SQL in your Supabase SQL editor to create the required tables:

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
  featured_image TEXT
);

-- Create blog_tags table
CREATE TABLE blog_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  post_count INTEGER DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- Enable RLS (Row Level Security)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read published posts" ON blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can read tags" ON blog_tags
  FOR SELECT USING (true);
```

### 4. Basic Usage

#### Initialize the Blog System

```tsx
// app/layout.tsx or pages/_app.tsx
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
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

#### Create Blog List Page

```tsx
// app/blog/page.tsx
import { Metadata } from 'next'
import { getBlogPosts, BlogList } from 'easyglobe-blog-system'

export const metadata: Metadata = {
  title: 'Blog - Your Site',
  description: 'Explore our latest articles and insights.',
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Blog</h1>
      <BlogList posts={posts} />
    </div>
  )
}
```

#### Create Blog Post Page

```tsx
// app/blog/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogPost, BlogContent } from 'easyglobe-blog-system'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  
  if (!post) return { title: 'Post Not Found' }
  
  return {
    title: post.title,
    description: post.description,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  
  if (!post) notFound()
  
  return (
    <article className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="mb-8 text-gray-600">
        By {post.author} • {post.reading_time}
      </div>
      <BlogContent content={post.content} />
    </article>
  )
}
```

## API Reference

### Components

#### `<BlogList>`
Displays a list of blog posts with search and filtering capabilities.

```tsx
import { BlogList } from 'easyglobe-blog-system'

<BlogList 
  posts={posts}
  config={{
    showSearch: true,
    showTags: true,
    showAuthor: true,
    showReadingTime: true,
    showFeaturedImage: true,
  }}
  blogPath="/blog"
/>
```

#### `<BlogContent>`
Renders blog post content with proper styling and markdown support.

```tsx
import { BlogContent } from 'easyglobe-blog-system'

<BlogContent content={post.content} className="custom-prose" />
```

#### `<BlogSearch>`
Provides search and filtering functionality for blog posts.

```tsx
import { BlogSearch } from 'easyglobe-blog-system'

<BlogSearch 
  posts={posts}
  onSearch={handleSearch}
  showTags={true}
/>
```

### Functions

#### `getBlogPosts(options?)`
Fetches blog posts with optional filtering and pagination.

```tsx
const posts = await getBlogPosts({
  limit: 10,
  offset: 0,
  tags: ['SEO', 'Marketing'],
  featured: true,
  orderBy: 'published_at',
  orderDirection: 'desc'
})
```

#### `getBlogPost(slug)`
Fetches a single blog post by slug.

```tsx
const post = await getBlogPost('my-blog-post-slug')
```

#### `getBlogTags()`
Fetches all available blog tags.

```tsx
const tags = await getBlogTags()
```

#### `searchBlogPosts(query, options?)`
Searches blog posts by text query.

```tsx
const results = await searchBlogPosts('Next.js tutorial', {
  limit: 20,
  tags: ['tutorial']
})
```

## Customization

### Styling
The components use Tailwind CSS classes and can be customized by:

1. **Overriding CSS classes** - Pass custom `className` props
2. **Custom CSS** - Add your own styles to override defaults
3. **Tailwind Configuration** - Modify your `tailwind.config.js`

### Configuration
Customize the blog system behavior through the config object:

```tsx
const config = {
  supabase: {
    url: 'your-url',
    anonKey: 'your-key',
    serviceRoleKey: 'your-service-key', // Optional, for admin operations
  },
  tables: {
    blogPosts: 'custom_posts_table',
    blogTags: 'custom_tags_table',
    blogPostTags: 'custom_post_tags_table',
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
```

## Advanced Usage

### Server-Side Filtering

```tsx
// Filter by specific criteria
const featuredPosts = await getBlogPosts({ 
  featured: true, 
  limit: 3 
})

const postsByAuthor = await getBlogPosts({ 
  author: 'John Doe' 
})

const postsByTags = await getBlogPosts({ 
  tags: ['React', 'Next.js'] 
})
```

### Custom Components

You can create your own components using the blog functions:

```tsx
import { getBlogPosts } from 'easyglobe-blog-system'

export async function FeaturedPosts() {
  const posts = await getBlogPosts({ featured: true, limit: 3 })
  
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {posts.map(post => (
        <div key={post.id} className="border rounded-lg p-4">
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
        </div>
      ))}
    </div>
  )
}
```

## Content Management

### Creating Posts
You can create posts directly in your Supabase database or build an admin interface using the provided functions:

```tsx
import { createBlogPost } from 'easyglobe-blog-system'

const newPost = await createBlogPost({
  slug: 'my-new-post',
  title: 'My New Blog Post',
  content: '# Hello World\n\nThis is my first post!',
  author: 'John Doe',
  tags: ['announcement'],
  status: 'published'
})
```

## TypeScript Support

The package includes full TypeScript definitions:

```tsx
import type { 
  BlogPost, 
  BlogTag, 
  BlogConfig, 
  BlogSearchOptions,
  CreateBlogPostInput 
} from 'easyglobe-blog-system'
```

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the [GitHub Issues](https://github.com/your-repo/easyglobe-blog-system/issues)
2. Read the documentation
3. Contact support

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.