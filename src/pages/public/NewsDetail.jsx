// src/pages/public/NewsDetail.jsx

import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useSingleDocument } from '@/hooks/useSingleDocument'
import { formatDate } from '@/utils/formatDate'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

export default function NewsDetail() {
  const { newsId } = useParams()
  const { data: article, loading } = useSingleDocument('news', newsId)

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!article || !article.isPublished) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold text-primary mb-2">Article Not Found</h1>
        <p className="text-neutral-muted mb-6">This article may have been removed or the link is incorrect.</p>
        <Link to="/news" className="text-accent font-semibold hover:text-accent-dark">
          &larr; Back to News &amp; Events
        </Link>
      </div>
    )
  }

  return (
    <article>
      {/* Hero image */}
      <div className="relative h-[35vh] lg:h-[50vh] overflow-hidden">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/20 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 lg:px-8 pb-8">
            <Link
              to="/news"
              className="inline-flex items-center gap-1.5 text-white/90 hover:text-secondary text-sm font-medium mb-4"
            >
              <ArrowLeft size={16} /> Back to News &amp; Events
            </Link>
            <span className="inline-block bg-secondary text-primary text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-3">
              {article.category}
            </span>
            <h1 className="font-heading text-2xl lg:text-4xl font-bold text-white max-w-3xl">
              {article.title}
            </h1>
            <p className="text-white/70 text-sm mt-3">
              {formatDate(article.publishedAt || article.createdAt, 'dd MMMM yyyy')}
            </p>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-primary font-medium mb-6 leading-relaxed">
            {article.excerpt}
          </p>
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          <div className="mt-10 pt-8 border-t border-neutral-border flex justify-between items-center">
            <Link to="/news" className="text-sm font-semibold text-accent hover:text-accent-dark">
              &larr; All News &amp; Events
            </Link>
            <Link
              to="/volunteer"
              className="px-5 py-2.5 bg-secondary text-primary font-heading font-semibold text-sm rounded hover:bg-secondary-dark transition-colors"
            >
              Get Involved
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}