// src/components/public/Lightbox.jsx
// Full-screen image viewer with keyboard navigation (Escape, arrows).

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect } from 'react'

export default function Lightbox({ items, currentIndex, onClose, onNavigate }) {
    const item = items[currentIndex]

    useEffect(() => {
        function handleKey(e) {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowLeft') onNavigate(Math.max(0, currentIndex - 1))
            if (e.key === 'ArrowRight') onNavigate(Math.min(items.length - 1, currentIndex + 1))
        }
        window.addEventListener('keydown', handleKey)
        document.body.style.overflow = 'hidden'
        return () => {
            window.removeEventListener('keydown', handleKey)
            document.body.style.overflow = ''
        }
    }, [currentIndex, items.length, onClose, onNavigate])

    if (!item) return null

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-10"
                aria-label="Close"
            >
                <X size={28} />
            </button>

            {/* Prev */}
            {currentIndex > 0 && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1) }}
                    className="absolute left-2 sm:left-6 text-white/80 hover:text-white p-2 z-10"
                    aria-label="Previous image"
                >
                    <ChevronLeft size={32} />
                </button>
            )}

            {/* Image */}
            <div
                className="max-w-5xl max-h-[85vh] flex flex-col items-center gap-3"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={item.imageUrl}
                    alt={item.caption || ''}
                    className="max-w-full max-h-[75vh] object-contain rounded"
                />
                {(item.caption || item.category) && (
                    <div className="text-center text-white/90">
                        {item.category && (
                            <span className="text-xs uppercase tracking-wide text-secondary font-semibold">
                                {item.category}
                            </span>
                        )}
                        {item.caption && <p className="text-sm mt-1">{item.caption}</p>}
                    </div>
                )}
                <p className="text-xs text-white/50">{currentIndex + 1} of {items.length}</p>
            </div>

            {/* Next */}
            {currentIndex < items.length - 1 && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1) }}
                    className="absolute right-2 sm:right-6 text-white/80 hover:text-white p-2 z-10"
                    aria-label="Next image"
                >
                    <ChevronRight size={32} />
                </button>
            )}
        </div>
    )
}