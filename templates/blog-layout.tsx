import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Your Blog',
    default: 'Your Blog',
  },
  description: 'Explore our latest articles, insights, and industry knowledge.',
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="blog-layout">
      {children}
    </div>
  )
}