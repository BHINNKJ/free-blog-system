# EasyGlobe Blog System - 使用指南

## 📦 博客系统包概述

这个完整的博客系统包包含了你网站博客功能的所有核心组件、类型定义、数据库操作函数和页面模板。你可以轻松地将这套系统集成到任何 Next.js 项目中。

## 🚀 快速部署到新项目

### 方法1：直接复制文件夹

1. **复制整个 `easyglobe-blog-system` 文件夹到新项目**
```bash
cp -r easyglobe-blog-system /path/to/new-project/
cd /path/to/new-project/easyglobe-blog-system
npm install
npm run build
```

2. **在新项目中安装依赖**
```bash
# 在新项目根目录
npm install ./easyglobe-blog-system @supabase/supabase-js lucide-react
```

### 方法2：发布为 npm 包（推荐）

1. **发布到 npm**
```bash
cd easyglobe-blog-system
npm login
npm publish
```

2. **在新项目中安装**
```bash
npm install easyglobe-blog-system @supabase/supabase-js lucide-react
```

## 🔧 集成到新项目

### 1. 环境变量设置
在新项目创建 `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. 初始化博客系统
在 `app/layout.tsx` 或 `pages/_app.tsx`:
```tsx
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

### 3. 创建博客页面

#### 博客列表页面 (`app/blog/page.tsx`)
```tsx
import { getBlogPosts, BlogList } from 'easyglobe-blog-system'

export default async function BlogPage() {
  const posts = await getBlogPosts()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">我的博客</h1>
      <BlogList posts={posts} />
    </div>
  )
}
```

#### 博客文章页面 (`app/blog/[slug]/page.tsx`)
```tsx
import { getBlogPost, BlogContent } from 'easyglobe-blog-system'
import { notFound } from 'next/navigation'

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  
  if (!post) notFound()
  
  return (
    <article className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="mb-4 text-gray-600">
        作者：{post.author} • {post.reading_time}
      </div>
      <BlogContent content={post.content} />
    </article>
  )
}
```

### 4. 数据库设置
在 Supabase 中运行 `scripts/setup-database.sql` 的内容来创建必要的表和权限。

## 🎨 自定义配置选项

### UI 配置
```tsx
const customUIConfig = {
  postsPerPage: 8,           // 每页显示文章数
  showSearch: true,          // 显示搜索功能
  showTags: true,           // 显示标签
  showAuthor: true,         // 显示作者
  showReadingTime: false,   // 隐藏阅读时间
  showFeaturedImage: true,  // 显示特色图片
}
```

### 表名配置
```tsx
const customTables = {
  blogPosts: 'my_blog_posts',
  blogTags: 'my_blog_tags', 
  blogPostTags: 'my_post_tags',
}
```

## 📁 包结构说明

```
easyglobe-blog-system/
├── src/                    # 源代码
│   ├── components/         # React 组件
│   │   ├── BlogList.tsx    # 博客列表组件
│   │   ├── BlogSearch.tsx  # 搜索组件
│   │   ├── BlogContent.tsx # 内容渲染组件
│   │   └── index.ts        # 组件导出
│   ├── lib/               # 核心库函数
│   │   ├── supabase.ts     # Supabase 客户端配置
│   │   ├── blog-functions.ts # 博客数据操作函数
│   │   └── index.ts        # 库函数导出
│   ├── types/             # TypeScript 类型定义
│   │   ├── blog.ts         # 博客相关类型
│   │   └── index.ts        # 类型导出
│   ├── BlogSystem.tsx     # 主系统组件
│   └── index.ts           # 主入口文件
├── templates/             # 页面模板
│   ├── blog-page.tsx      # 博客列表页模板
│   ├── blog-post-page.tsx # 博客文章页模板
│   └── blog-layout.tsx    # 博客布局模板
├── scripts/              # 实用脚本
│   └── setup-database.sql # 数据库初始化脚本
├── docs/                 # 文档
│   ├── INSTALLATION.md    # 详细安装指南
│   └── QUICK_START.md     # 快速开始指南
├── package.json          # 包配置
├── tsconfig.json         # TypeScript 配置
├── README.md             # 项目说明
└── LICENSE               # 许可证
```

## 🔧 核心功能

### 1. 数据获取函数
- `getBlogPosts(options?)` - 获取博客文章列表
- `getBlogPost(slug)` - 获取单篇文章
- `getBlogTags()` - 获取标签列表
- `searchBlogPosts(query, options?)` - 搜索文章
- `getFeaturedPosts(limit?)` - 获取特色文章

### 2. React 组件
- `<BlogList>` - 文章列表展示
- `<BlogSearch>` - 搜索和筛选
- `<BlogContent>` - 文章内容渲染
- `<BlogSystem>` - 系统初始化包装器

### 3. 类型定义
- `BlogPost` - 文章数据类型
- `BlogTag` - 标签数据类型
- `BlogConfig` - 配置类型
- `BlogSearchOptions` - 搜索选项类型

## 🌟 特色功能

✅ **即开即用** - 5分钟内完成设置  
✅ **完全可定制** - 所有组件都支持自定义样式  
✅ **TypeScript 支持** - 完整的类型安全  
✅ **搜索和筛选** - 内置搜索和标签筛选  
✅ **响应式设计** - 完美支持移动端  
✅ **SEO 优化** - 内置 SEO 最佳实践  
✅ **Supabase 集成** - 强大的数据库和实时功能  

## 🚀 生产部署建议

1. **构建优化**
   - 启用 Next.js 的图片优化
   - 配置适当的缓存策略
   - 使用 CDN 托管静态资源

2. **数据库优化**
   - 设置适当的 RLS 策略
   - 配置数据库索引
   - 定期备份数据

3. **监控和分析**
   - 集成 Google Analytics
   - 设置错误监控
   - 监控网站性能

## 💡 使用提示

- 在 `templates/` 文件夹中提供了完整的页面模板，可以直接复制使用
- 所有组件都支持自定义 CSS 类，方便集成到现有设计系统
- 支持 Markdown 和 HTML 内容渲染
- 内置图片懒加载和性能优化

## 🤝 获取支持

- 查看 `docs/` 文件夹中的详细文档
- 参考 `templates/` 中的使用示例
- 有问题请创建 GitHub Issue

这个博客系统已经在 EasyGlobe 网站上经过实际测试，稳定可靠！