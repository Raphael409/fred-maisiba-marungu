// src/components/public/YouTubeModal.jsx
// Lightbox-style modal that plays a YouTube video when triggered.

import { getYouTubeEmbedUrl } from '@/utils/youtube'
import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function YouTubeModal({ videoId, title, onClose }) {
    useEffect(() => {
        function handleKey(e) { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [onClose])

    if (!videoId) return null

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-4xl animate-slide-up">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 text-white/70 hover:text-white flex items-center gap-1.5 text-sm transition-colors"
                    aria-label="Close video"
                >
                    <X size={18} /> Close
                </button>

                {/* 16:9 iframe container */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-float">
                    <iframe
                        src={getYouTubeEmbedUrl(videoId)}
                        title={title || 'Campaign Video'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                    />
                </div>

                {title && (
                    <p className="text-center text-white/70 text-sm mt-3">{title}</p>
                )}
            </div>
        </div>
    )
}