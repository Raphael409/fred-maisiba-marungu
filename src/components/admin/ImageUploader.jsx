// src/components/admin/ImageUploader.jsx
// Drag-and-drop / click-to-upload component backed by Cloudinary.

import { transformImage, uploadImage } from '@/utils/cloudinary'
import { CheckCircle, UploadCloud, X } from 'lucide-react'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'

export default function ImageUploader({
    onUploadComplete,
    folder = 'campaign',
    label = 'Upload Image',
    currentImageUrl,
    accept = 'image/*',
}) {
    const [dragging, setDragging] = useState(false)
    const [progress, setProgress] = useState(null)
    const [preview, setPreview] = useState(currentImageUrl || null)
    const inputRef = useRef(null)

    async function handleFile(file) {
        if (!file) return
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file.')
            return
        }
        const localUrl = URL.createObjectURL(file)
        setPreview(localUrl)
        setProgress(0)
        try {
            const result = await uploadImage(file, folder, (pct) => setProgress(pct))
            setProgress(null)
            onUploadComplete(result)
            toast.success('Image uploaded successfully.')
        } catch (err) {
            toast.error('Upload failed — please try again.')
            setPreview(currentImageUrl || null)
            setProgress(null)
        }
    }

    function onInputChange(e) {
        handleFile(e.target.files?.[0])
    }

    function onDrop(e) {
        e.preventDefault()
        setDragging(false)
        handleFile(e.dataTransfer.files?.[0])
    }

    function clearImage() {
        setPreview(null)
        onUploadComplete({ url: '', publicId: '' })
        if (inputRef.current) inputRef.current.value = ''
    }

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-dark">{label}</label>
            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`
          relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
          transition-colors duration-150 min-h-[140px] flex items-center justify-center
          ${dragging
                        ? 'border-accent bg-accent/5'
                        : 'border-neutral-border hover:border-primary hover:bg-neutral-bg'
                    }
        `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={onInputChange}
                    className="hidden"
                />
                {preview ? (
                    <div className="relative w-full">
                        <img
                            src={transformImage(preview, { width: 400, height: 300 })}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded object-cover"
                        />
                        {progress === null && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); clearImage() }}
                                className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow hover:text-red-500"
                                aria-label="Remove image"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-neutral-muted">
                        <UploadCloud size={32} />
                        <p className="text-sm">
                            Drag & drop an image here, or <span className="text-accent font-medium">click to browse</span>
                        </p>
                        <p className="text-xs">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                )}
                {progress !== null && (
                    <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-lg gap-2">
                        <div className="w-3/4 bg-neutral-border rounded-full h-2">
                            <div
                                className="bg-accent h-2 rounded-full transition-all duration-200"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-sm font-medium text-primary">
                            {progress < 100 ? `Uploading… ${progress}%` : (
                                <span className="flex items-center gap-1 text-success">
                                    <CheckCircle size={16} /> Done
                                </span>
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}