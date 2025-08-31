'use client'

import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BlogPost } from '@/lib/types/blog'

interface BlogSearchProps {
  posts: BlogPost[]
  onSearch: (filteredPosts: BlogPost[]) => void
}

export default function BlogSearch({ posts, onSearch }: BlogSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // 获取所有唯一标签
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => tags.add(tag))
      }
    })
    return Array.from(tags).sort()
  }, [posts])

  // 过滤文章
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = searchTerm === '' || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesTags = selectedTags.length === 0 || 
        (post.tags && selectedTags.some(tag => post.tags!.includes(tag)))

      return matchesSearch && matchesTags
    })
  }, [posts, searchTerm, selectedTags])

  // 处理搜索
  const handleSearch = () => {
    onSearch(filteredPosts)
  }

  // 处理标签选择
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  // 清除所有筛选
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedTags([])
    onSearch(posts)
  }

  // 当搜索条件改变时自动搜索
  useMemo(() => {
    onSearch(filteredPosts)
  }, [filteredPosts, onSearch])

  return (
    <div className="space-y-4">
      {/* 搜索框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* 标签筛选 */}
      {allTags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Filter by tags:</span>
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTag(tag)}
                className="text-xs"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* 结果统计 */}
      <div className="text-sm text-gray-600">
        Found {filteredPosts.length} articles
        {(searchTerm || selectedTags.length > 0) && (
          <span className="ml-2">
            (total {posts.length})
          </span>
        )}
      </div>
    </div>
  )
} 