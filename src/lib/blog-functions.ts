import { getSupabase, getConfig } from './supabase'
import { BlogPost, BlogTag, BlogSearchOptions, CreateBlogPostInput, UpdateBlogPostInput } from '../types'

// 获取所有已发布的博客文章
export async function getBlogPosts(options: BlogSearchOptions = {}): Promise<BlogPost[]> {
  const supabase = getSupabase()
  const config = getConfig()
  
  let query = supabase
    .from(config.tables.blogPosts)
    .select('*')
    .eq('status', 'published')
    .order(options.orderBy || 'published_at', { ascending: options.orderDirection === 'asc' })

  // 应用筛选条件
  if (options.tags && options.tags.length > 0) {
    query = query.overlaps('tags', options.tags)
  }

  if (options.author) {
    query = query.eq('author', options.author)
  }

  if (options.featured !== undefined) {
    query = query.eq('featured', options.featured)
  }

  // 应用分页
  if (options.limit) {
    query = query.limit(options.limit)
  }

  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching blog posts:', error)
    throw error
  }

  return data || []
}

// 根据slug获取单篇博客文章
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const supabase = getSupabase()
  const config = getConfig()
  
  const { data, error } = await supabase
    .from(config.tables.blogPosts)
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // 文章不存在
    }
    console.error('Error fetching blog post:', error)
    throw error
  }

  return data
}

// 获取所有博客标签
export async function getBlogTags(): Promise<BlogTag[]> {
  const supabase = getSupabase()
  const config = getConfig()
  
  const { data, error } = await supabase
    .from(config.tables.blogTags)
    .select('*')
    .order('post_count', { ascending: false })

  if (error) {
    console.error('Error fetching blog tags:', error)
    throw error
  }

  return data || []
}

// 根据标签获取博客文章
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const supabase = getSupabase()
  const config = getConfig()
  
  const { data, error } = await supabase
    .from(config.tables.blogPosts)
    .select('*')
    .eq('status', 'published')
    .contains('tags', [tag])
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts by tag:', error)
    throw error
  }

  return data || []
}

// 搜索博客文章
export async function searchBlogPosts(query: string, options: BlogSearchOptions = {}): Promise<BlogPost[]> {
  const supabase = getSupabase()
  const config = getConfig()
  
  let searchQuery = supabase
    .from(config.tables.blogPosts)
    .select('*')
    .eq('status', 'published')
    .textSearch('title', query)
    .order('published_at', { ascending: false })

  // 应用其他筛选条件
  if (options.tags && options.tags.length > 0) {
    searchQuery = searchQuery.overlaps('tags', options.tags)
  }

  if (options.limit) {
    searchQuery = searchQuery.limit(options.limit)
  }

  const { data, error } = await searchQuery

  if (error) {
    console.error('Error searching blog posts:', error)
    throw error
  }

  return data || []
}

// 获取特色文章
export async function getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
  const supabase = getSupabase()
  const config = getConfig()
  
  const { data, error } = await supabase
    .from(config.tables.blogPosts)
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured posts:', error)
    throw error
  }

  return data || []
}

// 获取文章统计信息
export async function getBlogStats() {
  const supabase = getSupabase()
  const config = getConfig()
  
  const { data: totalPosts, error: postsError } = await supabase
    .from(config.tables.blogPosts)
    .select('id', { count: 'exact' })
    .eq('status', 'published')

  const { data: totalTags, error: tagsError } = await supabase
    .from(config.tables.blogTags)
    .select('id', { count: 'exact' })

  if (postsError || tagsError) {
    console.error('Error fetching blog stats:', { postsError, tagsError })
    throw new Error('Failed to fetch blog stats')
  }

  return {
    totalPosts: totalPosts?.length || 0,
    totalTags: totalTags?.length || 0,
  }
}

// 创建博客文章 (需要管理员权限)
export async function createBlogPost(input: CreateBlogPostInput): Promise<BlogPost> {
  const supabase = getSupabase() // 这里可能需要admin client
  const config = getConfig()
  
  const { data, error } = await supabase
    .from(config.tables.blogPosts)
    .insert([input])
    .select()
    .single()

  if (error) {
    console.error('Error creating blog post:', error)
    throw error
  }

  return data
}

// 更新博客文章 (需要管理员权限)
export async function updateBlogPost(input: UpdateBlogPostInput): Promise<BlogPost> {
  const supabase = getSupabase() // 这里可能需要admin client
  const config = getConfig()
  
  const { id, ...updateData } = input
  
  const { data, error } = await supabase
    .from(config.tables.blogPosts)
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating blog post:', error)
    throw error
  }

  return data
}

// 删除博客文章 (需要管理员权限)
export async function deleteBlogPost(id: string): Promise<void> {
  const supabase = getSupabase() // 这里可能需要admin client
  const config = getConfig()
  
  const { error } = await supabase
    .from(config.tables.blogPosts)
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting blog post:', error)
    throw error
  }
}