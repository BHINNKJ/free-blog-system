'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, Tag } from 'lucide-react'
import { BlogPost } from '@/lib/types/blog'
import BlogSearch from '@/components/blog-search'

interface BlogListProps {
  posts: BlogPost[]
}

export default function BlogList({ posts }: BlogListProps) {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(posts)

  const handleSearch = (results: BlogPost[]) => {
    setFilteredPosts(results)
  }

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Articles Found</h3>
        <p className="text-gray-600">Try adjusting your search terms or tag filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 搜索和筛选 */}
      <BlogSearch posts={posts} onSearch={handleSearch} />

      {/* 文章列表 */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {post.featured_image && (
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
              {post.tags && post.tags.length > 0 && (
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
                  href={`/blog/${post.slug}`}
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
                    {new Date(post.published_at).toLocaleDateString('en-US')}
                  </span>
                  {post.reading_time && (
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.reading_time} min read
                    </span>
                  )}
                </div>
                
                {post.author && (
                  <span className="text-green-600 font-medium">
                    {post.author}
                  </span>
                )}
              </div>

              {/* 阅读更多按钮 */}
              <div className="mt-4">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm transition-colors duration-200"
                >
                  Read More
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
          Showing {filteredPosts.length} articles
          {filteredPosts.length !== posts.length && (
            <span className="ml-2">
              (total {posts.length})
            </span>
          )}
        </div>
      )}
    </div>
  )
} 