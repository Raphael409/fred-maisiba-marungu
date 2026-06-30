// src/components/admin/MultiImageUploader.jsx
// Drag-and-drop / click-to-upload component for MULTIPLE images at once.
// Each file uploads to Cloudinary independently with its own progress bar.

import { transformImage, uploadImage } from '@/utils/cloudinary'
import { AlertCircle, CheckCircle, UploadCloud, X } from 'lucide-react'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'

// One row per file being uploaded, tracked by a temporary local id.
let nextId = 0

export default function MultiImageUploader({
    onFilesUploaded,   // callback(Array<{ url, publicId }>) — called once ALL succeed
    folder = 'campaign/gallery',
    label = 'Upload Photos',
}) {
    const [dragging, setDragging] = useState(false)
    const [queue, setQueue] = useState([]) // [{ id, file, previewUrl, progress, status, result }]
    const inputRef = useRef(null)

    function addFiles(fileList) {
        const files = Array.from(fileList).filter(f => f.type.startsWith('image/'))
        if (files.length === 0) {
            toast.error('Please select image files only.')
            return
        }

        const newItems = files.map(file => ({
            id: nextId++,
            file,
            previewUrl: URL.createObjectURL(file),
            progress: 0,
            status: 'uploading', // uploading | done | error
            result: null,
        }))

        setQueue(prev => [...prev, ...newItems])

        newItems.forEach(item => uploadOne(item))
    }

    async function uploadOne(item) {
        try {
            const result = await uploadImage(item.file, folder, (pct) => {
                setQueue(prev => prev.map(q => q.id === item.id ? { ...q, progress: pct } : q))
            })
            setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'done', result } : q))
        } catch (err) {
            setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'error' } : q))
        }
    }

    function removeItem(id) {
        setQueue(prev => prev.filter(q => q.id !== id))
    }

    function onInputChange(e) {
        addFiles(e.target.files)
        e.target.value = '' // allow re-selecting the same file later
    }

    function onDrop(e) {
        e.preventDefault()
        setDragging(false)
        addFiles(e.dataTransfer.files)
    }

    const doneItems = queue.filter(q => q.status === 'done')
    const isUploading = queue.some(q => q.status === 'uploading')
    const hasErrors = queue.some(q => q.status === 'error')

    function handleConfirm() {
        if (doneItems.length === 0) {
            toast.error('No images have finished uploading yet.')
            return
        }
        onFilesUploaded(doneItems.map(q => q.result))
        setQueue([])
        toast.success(`${doneItems.length} photo${doneItems.length > 1 ? 's' : ''} added to gallery.`)
    }

    return (
        <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-neutral-dark">{label}</label>

            {/* Drop zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-150
          ${dragging
                        ? 'border-accent bg-accent/5'
                        : 'border-neutral-border hover:border-primary hover:bg-neutral-bg'
                    }
        `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onInputChange}
                    className="hidden"
                />
                <div className="flex flex-col items-center gap-2 text-neutral-muted">
                    <UploadCloud size={32} />
                    <p className="text-sm">
                        Drag & drop photos here, or <span className="text-accent font-medium">click to browse</span>
                    </p>
                    <p className="text-xs">Select multiple files at once &middot; PNG, JPG, WEBP up to 10MB each</p>
                </div>
            </div>

            {/* Upload queue grid */}
            {queue.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {queue.map(item => (
                        <div key={item.id} className="relative rounded-lg overflow-hidden border border-neutral-border aspect-square">
                            <img
                                src={transformImage(item.previewUrl, { width: 200, height: 200 })}
                                alt=""
                                className="w-full h-full object-cover"
                            />

                            {/* Status overlay */}
                            {item.status === 'uploading' && (
                                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1">
                                    <div className="w-3/4 bg-white/30 rounded-full h-1.5">
                                        <div
                                            className="bg-secondary h-1.5 rounded-full transition-all duration-200"
                                            style={{ width: `${item.progress}%` }}
                                        />
                                    </div>
                                    <span className="text-white text-xs">{item.progress}%</span>
                                </div>
                            )}

                            {item.status === 'done' && (
                                <div className="absolute top-1 right-1 bg-white rounded-full p-0.5">
                                    <CheckCircle size={16} className="text-success" />
                                </div>
                            )}

                            {item.status === 'error' && (
                                <div className="absolute inset-0 bg-red-600/70 flex flex-col items-center justify-center gap-1 text-white">
                                    <AlertCircle size={18} />
                                    <span className="text-xs">Failed</span>
                                </div>
                            )}

                            {/* Remove button (always available) */}
                            <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="absolute top-1 left-1 bg-white/90 rounded-full p-0.5 shadow hover:text-red-500"
                                aria-label="Remove"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Confirm button */}
            {queue.length > 0 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-neutral-muted">
                        {doneItems.length} of {queue.length} uploaded
                        {hasErrors && <span className="text-red-500"> &middot; some failed</span>}
                    </p>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isUploading || doneItems.length === 0}
                        className="px-4 py-2 bg-secondary text-primary text-sm font-heading font-semibold rounded hover:bg-secondary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Add {doneItems.length > 0 ? doneItems.length : ''} Photo{doneItems.length !== 1 ? 's' : ''} to Gallery
                    </button>
                </div>
            )}
        </div>
    )
}