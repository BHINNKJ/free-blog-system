'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, Tag } from 'lucide-react'
import { BlogPost, BlogConfig } from '../types'
import BlogSearch from './BlogSearch'

interface BlogListProps {
  posts: BlogPost[]
  config?: Partial<BlogConfig['ui']>
  blogPath?: string
}

export default function BlogList({ posts, config = {}, blogPath = '/blog' }: BlogListProps) {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(posts)

  const defaultConfig = {
    showSearch: true,
    showTags: true,
    showAuthor: true,
    showReadingTime: true,
    showFeaturedImage: true,
    ...config
  }

  const handleSearch = (results: BlogPost[]) => {
    setFilteredPosts(results)
  }

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到文章</h3>
        <p className="text-gray-600">请尝试调整搜索条件或标签筛选</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 搜索和筛选 */}
      {defaultConfig.showSearch && (
        <BlogSearch posts={posts} onSearch={handleSearch} />
      )}

      {/* 文章列表 */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {defaultConfig.showFeaturedImage && post.featured_image && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            
            <div className="p-6">
              {/* 标签 */}
              {defaultConfig.showTags && post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{post.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* 标题 */}
              <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                <Link
                  href={`${blogPath}/${post.slug}`}
                  className="hover:text-green-600 transition-colors duration-200"
                >
                  {post.title}
                </Link>
              </h2>

              {/* 摘要 */}
              {post.excerpt && (
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
              )}

              {/* 元信息 */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(post.published_at).toLocaleDateString('zh-CN')}
                  </span>
                  {defaultConfig.showReadingTime && post.reading_time && (
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.reading_time}
                    </span>
                  )}
                </div>
                
                {defaultConfig.showAuthor && post.author && (
                  <span className="text-green-600 font-medium">
                    {post.author}
                  </span>
                )}
              </div>

              {/* 阅读更多按钮 */}
              <div className="mt-4">
                <Link
                  href={`${blogPath}/${post.slug}`}
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm transition-colors duration-200"
                >
                  阅读更多
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 分页信息 */}
      {filteredPosts.length > 0 && (
        <div className="text-center text-sm text-gray-600">
          显示 {filteredPosts.length} 篇文章
          {filteredPosts.length !== posts.length && (
            <span className="ml-2">
              (共 {posts.length} 篇)
            </span>
          )}
        </div>
      )}
    </div>
  )
}