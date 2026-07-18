// src/pages/public/Gallery.jsx

import Lightbox from '@/components/public/Lightbox'
import YouTubeModal from '@/components/public/YouTubeModal'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { usePublicGallery } from '@/hooks/usePublicGallery'
import { getYouTubeThumbnail } from '@/utils/youtube'
import { Image, Play } from 'lucide-react'
import { useState } from 'react'

export default function Gallery() {
  const { galleryItems, loading } = usePublicGallery()
  const [filter, setFilter] = useState('all') // 'all' | 'images' | 'videos'
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [activeVideo, setActiveVideo] = useState(null)

  // Separate images and videos
  const images = galleryItems.filter(i => i.type !== 'video')
  const videos = galleryItems.filter(i => i.type === 'video')

  const filtered = filter === 'images' ? images
    : filter === 'videos' ? videos
      : galleryItems

  const imageItems = filtered.filter(i => i.type !== 'video')

  return (
    <div>

      {/* Hero */}
      <section className="relative bg-gradient-hero text-white pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '36px 36px' }}
        />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <Image size={12} className="text-accent" />
            <span className="text-xs font-heading font-semibold uppercase tracking-widest text-white/90">
              Our Work in Pictures &amp; Video
            </span>
          </div>
          <h1 className="font-heading font-bold text-3xl lg:text-5xl text-white mb-4">Gallery</h1>
          <p className="text-white/70 max-w-xl mx-auto">
            A visual journey through Fred Maisiba's community projects, events, and the people of Bogeka Ward.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="bg-white border-b border-neutral-border sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-1 py-3">
            {[
              { key: 'all', label: `All (${galleryItems.length})` },
              { key: 'images', label: `Photos (${images.length})` },
              { key: 'videos', label: `Videos (${videos.length})` },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-heading font-semibold transition-colors ${filter === tab.key
                    ? 'bg-accent text-white'
                    : 'text-neutral-muted hover:text-primary hover:bg-neutral-bg'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="bg-neutral-bg py-12 lg:py-16 min-h-[400px]">
        <div className="container mx-auto px-4 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <Image size={40} className="text-neutral-muted mx-auto mb-3" />
              <p className="font-heading font-semibold text-primary mb-1">No items yet</p>
              <p className="text-sm text-neutral-muted">Check back soon for photos and videos from Bogeka Ward.</p>
            </div>
          ) : (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
              {filtered.map((item, idx) => {
                const isVideo = item.type === 'video'
                const thumb = isVideo
                  ? (item.thumbnail || getYouTubeThumbnail(item.videoId, 'hqdefault'))
                  : item.imageUrl

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (isVideo) setActiveVideo(item)
                      else setLightboxIndex(imageItems.findIndex(i => i.id === item.id))
                    }}
                    className="group relative block w-full mb-4 break-inside-avoid rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer"
                  >
                    <img
                      src={thumb}
                      alt={item.caption || item.title || ''}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Video play overlay */}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center shadow-float group-hover:scale-110 transition-transform duration-200">
                          <Play size={22} className="text-white ml-1" fill="white" />
                        </div>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      {item.category && (
                        <span className="text-white text-xs font-heading font-semibold uppercase tracking-wide mb-1">
                          {item.category}
                        </span>
                      )}
                      {(item.caption || item.title) && (
                        <p className="text-white/90 text-xs line-clamp-2">
                          {item.caption || item.title}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Image lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={imageItems}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* YouTube video modal */}
      {activeVideo && (
        <YouTubeModal
          videoId={activeVideo.videoId}
          title={activeVideo.title}
          onClose={() => setActiveVideo(null)}
        />
      )}

    </div>
  )
}