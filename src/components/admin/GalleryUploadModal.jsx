// src/components/admin/GalleryUploadModal.jsx
// Bulk photo upload modal. Admin sets shared category + optional project
// link once, uploads multiple photos, and each becomes its own gallery
// document in Firestore.

import Button from '@/components/shared/Button'
import { useProjects } from '@/hooks/useProjects'
import { PROJECT_CATEGORIES } from '@/utils/constants'
import { X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import MultiImageUploader from './MultiImageUploader'

export default function GalleryUploadModal({ isOpen, onClose, onSave }) {
    const { projects } = useProjects()

    const [category, setCategory] = useState(PROJECT_CATEGORIES[0])
    const [projectId, setProjectId] = useState('')
    const [saving, setSaving] = useState(false)

    if (!isOpen) return null

    async function handleFilesUploaded(uploadedFiles) {
        setSaving(true)
        try {
            const items = uploadedFiles.map(({ url, publicId }) => ({
                imageUrl: url,
                thumbnailUrl: url,
                publicId,
                category,
                relatedProjectId: projectId || null,
                type: 'photo',
            }))
            await onSave(items)
            handleClose()
        } catch (err) {
            toast.error('Failed to save photos to the gallery.')
        } finally {
            setSaving(false)
        }
    }

    function handleClose() {
        setCategory(PROJECT_CATEGORIES[0])
        setProjectId('')
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={saving ? undefined : handleClose}
                aria-hidden="true"
            />

            <div className="relative bg-white rounded-xl shadow-card-hover w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up">

                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-border">
                    <h2 className="font-heading text-lg font-semibold text-primary">
                        Add Photos to Gallery
                    </h2>
                    <button
                        onClick={handleClose}
                        disabled={saving}
                        className="p-1 text-neutral-muted hover:text-neutral-dark rounded"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

                    {/* Shared metadata — applies to all photos uploaded in this batch */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-neutral-dark">Category *</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="w-full px-4 py-2.5 rounded border border-neutral-border bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                            >
                                {PROJECT_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-neutral-dark">Link to Project (optional)</label>
                            <select
                                value={projectId}
                                onChange={e => setProjectId(e.target.value)}
                                className="w-full px-4 py-2.5 rounded border border-neutral-border bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                            >
                                <option value="">No specific project</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <p className="text-xs text-neutral-muted -mt-2">
                        This category and project link will apply to every photo uploaded in this batch.
                    </p>

                    {/* Multi-uploader */}
                    <MultiImageUploader onFilesUploaded={handleFilesUploaded} />

                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-neutral-border">
                    <Button variant="ghost" onClick={handleClose} disabled={saving}>
                        {saving ? 'Saving...' : 'Close'}
                    </Button>
                </div>

            </div>
        </div>
    )
}