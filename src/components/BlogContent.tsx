'use client'

import React from 'react'

interface BlogContentProps {
  content: string
  className?: string
}

export default function BlogContent({ content, className = '' }: BlogContentProps) {
  // 检查内容是否已经是HTML格式
  const isHTML = content.includes('<') && content.includes('>')
  
  let processedContent = content
  
  // 如果是HTML内容，先修复图片编码问题
  if (isHTML) {
    processedContent = processedContent
      // 修复错误嵌套的img标签
      .replace(/&lt;img src="&lt;img src="/g, '<img src="')
      .replace(/&lt;img src="/g, '<img src="')
      .replace(/&gt;/g, '>')
      // 修复被空格分隔的URL - 处理 https:="" res.cloudinary.com="" ... 格式
      .replace(/https:=""([^"]*?)""([^"]*?)=""([^"]*?)=""([^"]*?)=""([^"]*?)"/g, 'https://$1/$2/$3/$4/$5')
      .replace(/https:=""([^"]*?)""([^"]*?)=""([^"]*?)=""([^"]*?)"/g, 'https://$1/$2/$3/$4')
      .replace(/https:=""([^"]*?)""([^"]*?)=""([^"]*?)"/g, 'https://$1/$2/$3')
      .replace(/https:=""([^"]*?)""([^"]*?)"/g, 'https://$1/$2')
      .replace(/https:=""([^"]*?)"/g, 'https://$1')
      // 修复其他被分隔的属性
      .replace(/=" ([^=]+)=" /g, '="$1" ')
      // 清理多余的空属性
      .replace(/=""/g, '')
      // 修复被分割的class属性
      .replace(/class="([^"]*?)"([^"]*?)"/g, 'class="$1$2"')
      // 修复被分割的alt属性
      .replace(/alt="([^"]*?)"([^"]*?)"/g, 'alt="$1$2"')
      // 修复被分割的loading属性
      .replace(/loading="([^"]*?)"([^"]*?)"/g, 'loading="$1$2"')
  }
  
  if (!isHTML) {
    // 如果是纯文本，进行Markdown渲染
    processedContent = content
      // 处理标题
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-6">$1</h1>')
      // 处理粗体
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      // 处理斜体
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // 处理代码块
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$1</code></pre>')
      // 处理行内代码
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>')
      // 处理直接的图片链接 (单独一行的图片URL)
      .replace(/^(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg))$/gim, '<div class="my-6 text-center"><img src="$1" alt="Image" class="mx-auto rounded-lg shadow-lg max-w-full h-auto" loading="lazy" /></div>')
      // 处理文本中的图片链接
      .replace(/(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg))/gi, '<img src="$1" alt="Image" class="inline-block rounded shadow max-w-full h-auto" loading="lazy" />')
      // 处理Markdown格式图片 (在链接之前处理)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<div class="my-6 text-center"><img src="$2" alt="$1" class="mx-auto rounded-lg shadow-lg max-w-full h-auto" loading="lazy" /></div>')
      // 处理链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
      // 处理列表
      .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      // 处理段落
      .replace(/\n\n/g, '</p><p class="mb-4">')
      // 处理换行
      .replace(/\n/g, '<br />')
  }

  const defaultClassName = "prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-gray-900 prose-pre:bg-gray-100"

  return (
    <div 
      className={`${defaultClassName} ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  )
}