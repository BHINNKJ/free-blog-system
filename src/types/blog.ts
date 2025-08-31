// 博客文章类型
export interface BlogPost {
  id: string
  slug: string
  title: string
  description: string
  content: string
  author: string
  tags: string[]
  published_at: string
  updated_at: string
  reading_time: string
  excerpt: string
  status: 'draft' | 'published'
  featured: boolean
  featured_image?: string
}

// 博客标签类型
export interface BlogTag {
  id: string
  name: string
  slug: string
  description: string
  post_count: number
}

// 文章标签关联类型
export interface BlogPostTag {
  post_id: string
  tag_id: string
}

// 创建文章时的输入类型
export interface CreateBlogPostInput {
  slug: string
  title: string
  description: string
  content: string
  author?: string
  tags?: string[]
  status?: 'draft' | 'published'
  featured?: boolean
}

// 更新文章时的输入类型
export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> {
  id: string
}

// 搜索和筛选选项
export interface BlogSearchOptions {
  query?: string
  tags?: string[]
  author?: string
  status?: 'draft' | 'published'
  featured?: boolean
  limit?: number
  offset?: number
  orderBy?: 'published_at' | 'updated_at' | 'title'
  orderDirection?: 'asc' | 'desc'
}

// 博客配置类型
export interface BlogConfig {
  supabase: {
    url: string
    anonKey: string
    serviceRoleKey?: string
  }
  tables: {
    blogPosts: string
    blogTags: string
    blogPostTags: string
  }
  ui: {
    postsPerPage: number
    showSearch: boolean
    showTags: boolean
    showAuthor: boolean
    showReadingTime: boolean
    showFeaturedImage: boolean
  }
}