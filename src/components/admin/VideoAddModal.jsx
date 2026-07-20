// src/components/admin/VideoAddModal.jsx
// Admin modal for adding a YouTube video to the gallery.

import { addDocument } from '@/firebase/firestore'
import { extractYouTubeId, getYouTubeThumbnail } from '@/utils/youtube'
import { AlignLeft, Link as LinkIcon, Tag, X, Youtube } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function VideoAddModal({ onClose, onAdded, projects = [] }) {
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')
    const [caption, setCaption] = useState('')
    const [category, setCategory] = useState('')
    const [projectId, setProjectId] = useState('')
    const [saving, setSaving] = useState(false)
    const [preview, setPreview] = useState(null)

    function handleUrlChange(e) {
        const val = e.target.value
        setUrl(val)
        const id = extractYouTubeId(val.trim())
        setPreview(id ? getYouTubeThumbnail(id, 'hqdefault') : null)
    }

    async function handleSave() {
        const videoId = extractYouTubeId(url.trim())
        if (!videoId) {
            toast.error('Please enter a valid YouTube URL or video ID.')
            return
        }
        if (!title.trim()) {
            toast.error('Please enter a title for this video.')
            return
        }

        setSaving(true)
        try {
            const doc = {
                type: 'video',
                videoId,
                title: title.trim(),
                caption: caption.trim(),
                category: category.trim(),
                projectId: projectId || null,
                thumbnail: getYouTubeThumbnail(videoId, 'hqdefault'),
            }
            const id = await addDocument('galleryItems', doc)
            toast.success('Video added to gallery!')
            onAdded?.({ id, ...doc })
            onClose()
        } catch (err) {
            console.error('Video add error:', err?.code, err?.message)
            toast.error(`Failed to add video: ${err?.message || 'Unknown error'}`)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
            <div className="relative bg-white rounded-2xl shadow-card-hover w-full max-w-md animate-slide-up">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-border bg-red-50 rounded-t-2xl">
                    <div className="flex items-center gap-2">
                        <Youtube size={20} className="text-red-600" />
                        <h2 className="font-heading font-semibold text-primary">Add YouTube Video</h2>
                    </div>
                    <button onClick={onClose} className="text-neutral-muted hover:text-neutral-dark">
                        <X size={18} />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4">

                    {/* URL input */}
                    <div>
                        <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                            YouTube URL or Video ID *
                        </label>
                        <div className="relative">
                            <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-muted" />
                            <input
                                type="text"
                                value={url}
                                onChange={handleUrlChange}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-border text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Thumbnail preview */}
                    {preview && (
                        <div className="rounded-xl overflow-hidden border border-neutral-border aspect-video bg-neutral-bg">
                            <img src={preview} alt="Video thumbnail" className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Video title"
                            className="w-full px-4 py-3 rounded-xl border border-neutral-border text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors"
                        />
                    </div>

                    {/* Caption */}
                    <div>
                        <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                            Caption (optional)
                        </label>
                        <div className="relative">
                            <AlignLeft size={14} className="absolute left-3.5 top-3 text-neutral-muted" />
                            <textarea
                                value={caption}
                                onChange={e => setCaption(e.target.value)}
                                placeholder="Short description of this video..."
                                rows={2}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-border text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors resize-none"
                            />
                        </div>
                    </div>

                    {/* Category + Project */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                                Category
                            </label>
                            <div className="relative">
                                <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted" />
                                <input
                                    type="text"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    placeholder="e.g. Events"
                                    className="w-full pl-9 pr-3 py-3 rounded-xl border border-neutral-border text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                                Link to Project
                            </label>
                            <select
                                value={projectId}
                                onChange={e => setProjectId(e.target.value)}
                                className="w-full px-3 py-3 rounded-xl border border-neutral-border text-sm focus:outline-none focus:border-secondary bg-white"
                            >
                                <option value="">None</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 border border-neutral-border text-neutral-dark font-heading font-semibold text-sm rounded-xl hover:bg-neutral-bg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || !url || !title}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white font-heading font-bold text-sm rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {saving ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Youtube size={15} />
                            )}
                            Add Video
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}