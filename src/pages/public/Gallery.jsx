// src/pages/public/Gallery.jsx

import Lightbox from '@/components/public/Lightbox'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { usePublicGallery } from '@/hooks/usePublicGallery'
import { PROJECT_CATEGORIES } from '@/utils/constants'
import { useMemo, useState } from 'react'

export default function Gallery() {
  const { galleryItems, loading } = usePublicGallery()
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const filtered = useMemo(() => {
    if (categoryFilter === 'all') return galleryItems
    return galleryItems.filter(item => item.category === categoryFilter)
  }, [galleryItems, categoryFilter])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-hero text-white pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-secondary font-heading font-semibold text-sm uppercase tracking-wide mb-2">
            Our Work in Pictures
          </p>
          <h1 className="font-heading text-3xl lg:text-5xl font-bold mb-4">
            Projects Gallery
          </h1>
          <p className="text-neutral-on-dark-muted max-w-2xl mx-auto">
            A visual journey through the projects and moments shaping our community.
          </p>
        </div>
      </section>

      {/* Filters + Masonry grid */}
      <section className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${categoryFilter === 'all'
                ? 'bg-primary text-white'
                : 'bg-neutral-bg text-neutral-dark hover:bg-neutral-border'
              }`}
          >
            All
          </button>
          {PROJECT_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${categoryFilter === cat
                  ? 'bg-primary text-white'
                  : 'bg-neutral-bg text-neutral-dark hover:bg-neutral-border'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-neutral-muted py-20">
            No photos in this category yet.
          </p>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
            {filtered.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setLightboxIndex(index)}
                className="block w-full mb-4 break-inside-avoid rounded-lg overflow-hidden group relative"
              >
                <img
                  src={item.imageUrl}
                  alt={item.caption || ''}
                  className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-end p-3 opacity-0 group-hover:opacity-100">
                  <span className="text-white text-xs font-semibold uppercase tracking-wide">
                    {item.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={filtered}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  )
}