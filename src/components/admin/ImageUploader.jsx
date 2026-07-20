// src/components/admin/ImageUploader.jsx
// Drag-and-drop / click-to-upload with integrated 16:9 cropper.
// When admin selects an image, the ImageCropper modal opens first.
// Only after cropping is the image uploaded to Cloudinary.

import ImageCropper from '@/components/admin/ImageCropper'
import { uploadImage } from '@/utils/cloudinary'
import { Crop, UploadCloud, X } from 'lucide-react'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'

export default function ImageUploader({
    onUploadComplete,
    folder = 'campaign',
    label = 'Upload Cover Image',
    currentImageUrl,
    accept = 'image/*',
    aspectRatio = '16/9',   // info label only — cropper always uses 16:9
}) {
    const [preview, setPreview] = useState(currentImageUrl || null)
    const [cropSrc, setCropSrc] = useState(null)   // raw src for cropper
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(null)
    const inputRef = useRef(null)

    // Step 1: file selected → open cropper
    function handleFileSelect(file) {
        if (!file) return
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file.')
            return
        }
        const reader = new FileReader()
        reader.onload = () => setCropSrc(reader.result)
        reader.readAsDataURL(file)
    }

    function onInputChange(e) { handleFileSelect(e.target.files?.[0]) }
    function onDrop(e) {
        e.preventDefault()
        handleFileSelect(e.dataTransfer.files?.[0])
    }

    // Step 2: crop confirmed → upload the cropped blob
    async function handleCropComplete(blob) {
        setCropSrc(null)

        // Show local preview immediately
        const localUrl = URL.createObjectURL(blob)
        setPreview(localUrl)
        setUploading(true)
        setProgress(0)

        try {
            // Convert blob to File for Cloudinary upload
            const file = new File([blob], 'cover.jpg', { type: 'image/jpeg' })
            const result = await uploadImage(file, folder, pct => setProgress(pct))
            setProgress(null)
            setUploading(false)
            onUploadComplete(result)
            toast.success('Cover image uploaded successfully.')
        } catch {
            toast.error('Upload failed — please try again.')
            setPreview(currentImageUrl || null)
            setProgress(null)
            setUploading(false)
        }
    }

    function handleCropCancel() {
        setCropSrc(null)
        if (inputRef.current) inputRef.current.value = ''
    }

    function clearImage() {
        setPreview(null)
        onUploadComplete({ url: '', publicId: '' })
        if (inputRef.current) inputRef.current.value = ''
    }

    return (
        <>
            <div>
                <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                    {label}
                    <span className="ml-2 text-[10px] font-normal text-neutral-muted uppercase tracking-wide">
                        16:9 ratio • Cropped before upload
                    </span>
                </label>

                {preview ? (
                    /* Preview of cropped + uploaded image */
                    <div className="relative rounded-xl overflow-hidden border border-neutral-border bg-neutral-bg">
                        <img
                            src={preview}
                            alt="Cover preview"
                            className="w-full aspect-video object-cover"
                        />

                        {/* Upload progress overlay */}
                        {uploading && (
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                                <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                <p className="text-white text-xs font-medium">
                                    Uploading{progress !== null ? ` ${progress}%` : '...'}
                                </p>
                                <div className="w-40 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white rounded-full transition-all duration-200"
                                        style={{ width: `${progress || 0}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        {!uploading && (
                            <div className="absolute top-2 right-2 flex gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => inputRef.current?.click()}
                                    className="flex items-center gap-1 px-2.5 py-1.5 bg-black/60 hover:bg-black/80 text-white text-xs font-medium rounded-lg transition-colors"
                                >
                                    <Crop size={12} /> Re-crop
                                </button>
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    className="p-1.5 bg-red-600/80 hover:bg-red-700 text-white rounded-lg transition-colors"
                                    aria-label="Remove image"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Drop zone */
                    <div
                        onClick={() => !uploading && inputRef.current?.click()}
                        onDrop={onDrop}
                        onDragOver={e => e.preventDefault()}
                        className="border-2 border-dashed border-neutral-border hover:border-secondary rounded-xl cursor-pointer transition-colors bg-neutral-bg hover:bg-secondary/5 group"
                    >
                        <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center">
                            <div className="w-12 h-12 rounded-full bg-secondary/10 group-hover:bg-secondary/20 flex items-center justify-center transition-colors">
                                <UploadCloud size={22} className="text-secondary" />
                            </div>
                            <div>
                                <p className="text-sm font-heading font-semibold text-neutral-dark">
                                    Click to upload or drag & drop
                                </p>
                                <p className="text-xs text-neutral-muted mt-0.5">
                                    PNG, JPG, WebP · You'll be able to crop before uploading
                                </p>
                            </div>
                            {/* Visual 16:9 ratio indicator */}
                            <div className="mt-2 border border-dashed border-secondary/40 rounded bg-secondary/5 flex items-center justify-center"
                                style={{ width: '160px', height: '90px' }}>
                                <p className="text-[10px] text-secondary font-medium">16 : 9</p>
                            </div>
                        </div>
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={onInputChange}
                    className="hidden"
                />
            </div>

            {/* Cropper modal — opens when file is selected */}
            {cropSrc && (
                <ImageCropper
                    imageSrc={cropSrc}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}
        </>
    )
}