import { Metadata } from 'next'
import { getBlogPosts } from 'easyglobe-blog-system'
import { BlogList } from 'easyglobe-blog-system'

export const metadata: Metadata = {
  title: 'Blog - Your Site | Latest Articles & Insights',
  description: 'Explore the latest articles, insights, and trends in our blog.',
  openGraph: {
    title: 'Blog - Your Site',
    description: 'Explore the latest articles, insights, and trends in our blog.',
    type: 'website',
  },
}

export default async function BlogPage() {
  try {
    const posts = await getBlogPosts()
    
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Our Blog
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
                Explore the latest articles, insights, and trends. Stay updated with our expert content and industry knowledge.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <BlogList posts={posts} />
          </div>
        </section>
      </div>
    )
  } catch (error) {
    console.error('Failed to fetch blog posts:', error)
    
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Our Blog
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
                Explore the latest articles, insights, and trends. Stay updated with our expert content and industry knowledge.
              </p>
            </div>
          </div>
        </section>

        {/* Error State */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load blog content</h3>
              <p className="text-gray-600">Please try again later or contact our support team</p>
            </div>
          </div>
        </section>
      </div>
    )
  }
}