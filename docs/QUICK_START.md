# Quick Start Guide

Get your blog system up and running in 5 minutes!

## Prerequisites

- Node.js 18+
- Next.js 13+ project
- Supabase account

## Step 1: Install

```bash
npm install easyglobe-blog-system @supabase/supabase-js lucide-react
```

## Step 2: Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. In the SQL Editor, run this script:

```sql
-- Run the database setup script
-- Copy the contents from scripts/setup-database.sql
```

Or copy the SQL from `scripts/setup-database.sql` in this package.

## Step 3: Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Step 4: Initialize the System

Add to your `app/layout.tsx`:

```tsx
import { BlogSystem } from 'easyglobe-blog-system'

const blogConfig = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  }
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <BlogSystem config={blogConfig}>
          {children}
        </BlogSystem>
      </body>
    </html>
  )
}
```

## Step 5: Create Blog Pages

**Blog List** (`app/blog/page.tsx`):

```tsx
import { getBlogPosts, BlogList } from 'easyglobe-blog-system'

export default async function BlogPage() {
  const posts = await getBlogPosts()
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <BlogList posts={posts} />
    </div>
  )
}
```

**Blog Post** (`app/blog/[slug]/page.tsx`):

```tsx
import { getBlogPost, BlogContent } from 'easyglobe-blog-system'
import { notFound } from 'next/navigation'

export default async function PostPage({ params }) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  
  if (!post) notFound()
  
  return (
    <article className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <BlogContent content={post.content} />
    </article>
  )
}
```

## Step 6: Test

```bash
npm run dev
```

Visit `http://localhost:3000/blog` - you should see your blog with sample content!

## What's Next?

- [Full Installation Guide](./INSTALLATION.md) - Detailed setup instructions
- [Customization](./CUSTOMIZATION.md) - Style and configure your blog
- [Content Management](./CONTENT_MANAGEMENT.md) - Add and manage content
- [API Reference](../README.md#api-reference) - Complete API documentation

## Need Help?

- Check the [FAQ](./FAQ.md)
- Review the [examples](../templates/)
- Open an [issue](https://github.com/BHINNKJ/easyglobe-blog-system/issues)