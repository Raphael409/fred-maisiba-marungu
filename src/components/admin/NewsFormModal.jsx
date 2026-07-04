// src/components/admin/NewsFormModal.jsx
// Create/Edit form modal for news articles. Used by NewsManagement.jsx.

import Button from '@/components/shared/Button'
import Input from '@/components/shared/Input'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { NEWS_CATEGORIES } from '@/utils/constants'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ImageUploader from './ImageUploader'

const emptyForm = {
    title: '',
    category: NEWS_CATEGORIES[0],
    excerpt: '',
    body: '',
    coverImage: '',
    isPublished: false,
}

function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

export default function NewsFormModal({
    isOpen,
    onClose,
    onSave,        // async (formData) => void
    initialData,   // news object when editing, null when creating
}) {
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState({})

    const isEditing = !!initialData

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setForm({
                    title: initialData.title || '',
                    category: initialData.category || NEWS_CATEGORIES[0],
                    excerpt: initialData.excerpt || '',
                    body: initialData.body || '',
                    coverImage: initialData.coverImage || '',
                    isPublished: initialData.isPublished || false,
                })
            } else {
                setForm(emptyForm)
            }
            setErrors({})
        }
    }, [isOpen, initialData])

    if (!isOpen) return null

    function update(field, value) {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
    }

    function validate() {
        const next = {}
        if (!form.title.trim()) next.title = 'Title is required.'
        if (!form.excerpt.trim()) next.excerpt = 'A short excerpt is required.'
        if (!form.body.trim() || form.body === '<p><br></p>')
            next.body = 'Article body is required.'
        if (!form.coverImage) next.coverImage = 'Cover image is required.'
        setErrors(next)
        return Object.keys(next).length === 0
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!validate()) {
            toast.error('Please fill in all required fields.')
            return
        }

        setSaving(true)
        try {
            const payload = {
                ...form,
                slug: slugify(form.title),
                publishedAt: form.isPublished ? new Date() : null,
            }
            await onSave(payload)
            toast.success(isEditing ? 'Article updated.' : 'Article created.')
            onClose()
        } catch (err) {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={saving ? undefined : onClose}
                aria-hidden="true"
            />

            <div className="relative bg-white rounded-xl shadow-card-hover w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up">

                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-border">
                    <h2 className="font-heading text-lg font-semibold text-primary">
                        {isEditing ? 'Edit Article' : 'Add New Article'}
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="p-1 text-neutral-muted hover:text-neutral-dark rounded"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

                    <Input
                        label="Article Title *"
                        id="title"
                        value={form.title}
                        onChange={e => update('title', e.target.value)}
                        error={errors.title}
                        placeholder="e.g. Marungu Launches Youth Empowerment Fund"
                    />

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-neutral-dark">Category *</label>
                        <select
                            value={form.category}
                            onChange={e => update('category', e.target.value)}
                            className="w-full px-4 py-2.5 rounded border border-neutral-border bg-white capitalize focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                        >
                            {NEWS_CATEGORIES.map(cat => (
                                <option key={cat} value={cat} className="capitalize">{cat}</option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Short Excerpt *"
                        id="excerpt"
                        textarea
                        rows={2}
                        value={form.excerpt}
                        onChange={e => update('excerpt', e.target.value)}
                        error={errors.excerpt}
                        placeholder="One or two sentence summary shown on news cards..."
                    />

                    <RichTextEditor
                        label="Article Body *"
                        value={form.body}
                        onChange={(val) => update('body', val)}
                        error={errors.body}
                        placeholder="Write the full article here..."
                    />

                    <ImageUploader
                        label="Cover Image *"
                        folder="campaign/news"
                        currentImageUrl={form.coverImage}
                        onUploadComplete={({ url }) => update('coverImage', url)}
                    />
                    {errors.coverImage && (
                        <p className="text-xs text-red-600 -mt-2">{errors.coverImage}</p>
                    )}

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.isPublished}
                            onChange={e => update('isPublished', e.target.checked)}
                            className="w-4 h-4 rounded border-neutral-border text-accent focus:ring-accent"
                        />
                        <span className="text-sm font-medium text-neutral-dark">
                            Publish immediately (visible on public site)
                        </span>
                    </label>
                    {!form.isPublished && (
                        <p className="text-xs text-neutral-muted -mt-2">
                            Leave unchecked to save as a draft — only admins can see drafts.
                        </p>
                    )}

                </form>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-neutral-border">
                    <Button variant="ghost" onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} loading={saving}>
                        {isEditing ? 'Save Changes' : 'Create Article'}
                    </Button>
                </div>

            </div>
        </div>
    )
}