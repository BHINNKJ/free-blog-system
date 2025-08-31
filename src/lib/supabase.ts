import { createClient } from '@supabase/supabase-js'
import { BlogConfig } from '../types'

// 默认配置
const defaultConfig: BlogConfig = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  tables: {
    blogPosts: 'blog_posts',
    blogTags: 'blog_tags',
    blogPostTags: 'blog_post_tags',
  },
  ui: {
    postsPerPage: 10,
    showSearch: true,
    showTags: true,
    showAuthor: true,
    showReadingTime: true,
    showFeaturedImage: true,
  },
}

let supabaseClient: any = null
let supabaseAdminClient: any = null
let currentConfig: BlogConfig = defaultConfig

// 初始化Supabase客户端
export function initSupabase(config?: Partial<BlogConfig>) {
  if (config) {
    currentConfig = { ...defaultConfig, ...config }
  }
  
  if (!currentConfig.supabase.url || !currentConfig.supabase.anonKey) {
    throw new Error('Supabase URL and anon key are required')
  }

  // 创建客户端
  supabaseClient = createClient(
    currentConfig.supabase.url,
    currentConfig.supabase.anonKey
  )

  // 创建管理员客户端（如果提供了service role key）
  if (currentConfig.supabase.serviceRoleKey) {
    supabaseAdminClient = createClient(
      currentConfig.supabase.url,
      currentConfig.supabase.serviceRoleKey
    )
  }

  return { supabase: supabaseClient, supabaseAdmin: supabaseAdminClient }
}

// 获取客户端
export function getSupabase() {
  if (!supabaseClient) {
    initSupabase()
  }
  return supabaseClient
}

export function getSupabaseAdmin() {
  if (!supabaseAdminClient) {
    throw new Error('Supabase admin client not initialized. Please provide serviceRoleKey in config.')
  }
  return supabaseAdminClient
}

// 获取当前配置
export function getConfig(): BlogConfig {
  return currentConfig
}

// 更新配置
export function updateConfig(config: Partial<BlogConfig>) {
  currentConfig = { ...currentConfig, ...config }
}