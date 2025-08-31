'use client'

import React, { useEffect } from 'react'
import { BlogConfig, initSupabase } from './lib/supabase'

interface BlogSystemProps {
  config: BlogConfig
  children: React.ReactNode
}

const BlogSystem: React.FC<BlogSystemProps> = ({ config, children }) => {
  useEffect(() => {
    // Initialize Supabase with the provided config
    initSupabase(config)
  }, [config])

  return <>{children}</>
}

export default BlogSystem