// src/components/admin/ImageCropper.jsx
// Modal that lets the admin crop an image to a fixed 16:9 aspect ratio
// before uploading. Used for project and news cover images.
//
// Install: npm install react-easy-crop
//
// Usage:
//   <ImageCropper
//     imageSrc={previewUrl}        // data URL or object URL from file input
//     onCropComplete={blob => ...} // called with the cropped Blob
//     onCancel={() => ...}
//   />

import getCroppedImg from '@/utils/cropImage'
import { Check, Crop, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react'
import { useCallback, useState } from 'react'
import Cropper from 'react-easy-crop'

// Aspect ratio for the hero section (16:9 is universal for wide hero images)
const ASPECT_RATIO = 16 / 9

export default function ImageCropper({ imageSrc, onCropComplete, onCancel, loading = false }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedArea, setCroppedArea] = useState(null)
    const [processing, setProcessing] = useState(false)

    const onCropChange = useCallback(c => setCrop(c), [])
    const onZoomChange = useCallback(z => setZoom(z), [])

    const onCropAreaComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels)
    }, [])

    async function handleConfirm() {
        if (!croppedArea) return
        setProcessing(true)
        try {
            const blob = await getCroppedImg(imageSrc, croppedArea)
            onCropComplete(blob)
        } catch (err) {
            console.error('Crop failed:', err)
        } finally {
            setProcessing(false)
        }
    }

    function resetZoom() {
        setZoom(1)
        setCrop({ x: 0, y: 0 })
    }

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />

            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-float w-full max-w-2xl flex flex-col overflow-hidden animate-slide-up">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-border bg-neutral-bg">
                    <div className="flex items-center gap-2">
                        <Crop size={18} className="text-secondary" />
                        <div>
                            <h2 className="font-heading font-semibold text-neutral-dark text-sm">
                                Crop Cover Image
                            </h2>
                            <p className="text-[11px] text-neutral-muted">
                                Drag to reposition · Scroll or use slider to zoom · 16:9 ratio
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-neutral-muted hover:text-neutral-dark p-1 rounded-lg transition-colors"
                        aria-label="Cancel crop"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Crop area */}
                <div className="relative w-full bg-neutral-dark" style={{ height: '360px' }}>
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={ASPECT_RATIO}
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onCropComplete={onCropAreaComplete}
                        showGrid={true}
                        style={{
                            containerStyle: { background: '#1a1a1a' },
                            cropAreaStyle: {
                                border: '2px solid #F45A22',
                                boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
                            },
                        }}
                    />
                </div>

                {/* Zoom controls */}
                <div className="px-5 py-3 border-t border-neutral-border bg-neutral-bg">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setZoom(z => Math.max(1, z - 0.1))}
                            className="w-8 h-8 rounded-full bg-white border border-neutral-border flex items-center justify-center text-neutral-muted hover:text-secondary hover:border-secondary transition-colors"
                            aria-label="Zoom out"
                        >
                            <ZoomOut size={15} />
                        </button>

                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.05}
                            value={zoom}
                            onChange={e => setZoom(Number(e.target.value))}
                            className="flex-1 h-1.5 rounded-full accent-secondary cursor-pointer"
                            aria-label="Zoom level"
                        />

                        <button
                            onClick={() => setZoom(z => Math.min(3, z + 0.1))}
                            className="w-8 h-8 rounded-full bg-white border border-neutral-border flex items-center justify-center text-neutral-muted hover:text-secondary hover:border-secondary transition-colors"
                            aria-label="Zoom in"
                        >
                            <ZoomIn size={15} />
                        </button>

                        <button
                            onClick={resetZoom}
                            className="w-8 h-8 rounded-full bg-white border border-neutral-border flex items-center justify-center text-neutral-muted hover:text-secondary hover:border-secondary transition-colors"
                            aria-label="Reset zoom"
                            title="Reset"
                        >
                            <RotateCcw size={14} />
                        </button>
                    </div>
                    <p className="text-[10px] text-neutral-muted text-center mt-1.5">
                        Zoom: {zoom.toFixed(1)}×
                    </p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 px-5 py-4 border-t border-neutral-border">
                    <button
                        onClick={onCancel}
                        disabled={processing || loading}
                        className="flex-1 py-2.5 border border-neutral-border text-neutral-dark font-heading font-semibold text-sm rounded-xl hover:bg-neutral-bg disabled:opacity-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={processing || loading || !croppedArea}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-secondary text-white font-heading font-bold text-sm rounded-xl hover:bg-secondary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {processing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Check size={16} />
                                Apply Crop
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    )
}