// src/pages/public/NewsDetail.jsx

import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useSingleDocument } from '@/hooks/useSingleDocument'
import { formatDate } from '@/utils/formatDate'
import { ArrowLeft, Calendar, Newspaper, Share2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

export default function NewsDetail() {
  const { id } = useParams()
  const { document: article, loading } = useSingleDocument('news', id)

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <LoadingSpinner size="lg" />
    </div>
  )

  if (!article) return (
    <div className="text-center py-32">
      <Newspaper size={40} className="text-neutral-muted mx-auto mb-3" />
      <h2 className="font-heading font-bold text-xl text-primary mb-2">Article not found</h2>
      <Link to="/news" className="text-accent font-semibold hover:text-accent-dark">
        Back to News
      </Link>
    </div>
  )

  return (
    <div>
      {/* Hero */}
      {/* Hero image — natural aspect ratio, no crop */}
      {article.coverImage && (
        <div className="w-full bg-neutral-dark pt-28 lg:pt-36">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full max-h-[600px] object-contain mx-auto block"
          />
        </div>
      )}

      {/* Title bar */}
      <section className="relative bg-gradient-to-b from-primary to-secondary py-8 lg:py-10 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-3xl">
          <Link to="/news" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-5 transition-colors">
            <ArrowLeft size={15} /> Back to News
          </Link>
          {article.category && (
            <span className="inline-block text-xs font-bold bg-accent text-white px-3 py-1 rounded-full uppercase tracking-wide mb-3">
              {article.category}
            </span>
          )}
          <h1 className="font-heading font-bold text-2xl lg:text-4xl text-white mb-4 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-3 text-white/60 text-sm">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-accent" />
              {formatDate(article.publishedAt || article.createdAt)}
            </span>
            {article.author && <span>by <strong className="text-white/80">{article.author}</strong></span>}
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="bg-white py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">

            {article.excerpt && (
              <p className="text-lg text-neutral-muted leading-relaxed mb-8 pb-8 border-b border-neutral-border font-medium">
                {article.excerpt}
              </p>
            )}

            {/* Rich text content from Quill */}
            <div
              className="article-content prose prose-sm lg:prose max-w-none text-neutral-dark leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content || article.body || '' }}
            />

            {/* Share row */}
            <div className="mt-10 pt-8 border-t border-neutral-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-neutral-muted uppercase tracking-wide mb-1">Published by</p>
                <p className="font-heading font-semibold text-primary">Fred Maisiba Campaign — Bogeka Ward</p>
              </div>
              <button
                onClick={() => { navigator.share?.({ title: article.title, url: window.location.href }) }}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-neutral-border text-neutral-dark font-heading font-semibold text-sm rounded-xl hover:bg-neutral-bg transition-colors"
              >
                <Share2 size={14} /> Share Article
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary py-12">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-xl lg:text-2xl text-white mb-3">Stay Updated</h2>
          <p className="text-white/70 mb-6 max-w-md mx-auto text-sm">
            Get the latest news and events from the Fred Maisiba campaign delivered to you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/news" className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-white/40 text-white font-heading font-semibold text-sm rounded-full hover:bg-white hover:text-secondary transition-colors">
              More News
            </Link>
            <Link to="/volunteer" className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white font-heading font-semibold text-sm rounded-full hover:bg-accent-dark transition-colors shadow-glow">
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}