// src/components/admin/ProjectFormModal.jsx
// Create/Edit form modal for projects. Used by ProjectManagement.jsx.

import Button from '@/components/shared/Button'
import Input from '@/components/shared/Input'
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from '@/utils/constants'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ImageUploader from './ImageUploader'

const emptyForm = {
    title: '',
    category: PROJECT_CATEGORIES[0],
    status: 'completed',
    location: '',
    description: '',
    impactSummary: '',
    coverImage: '',
    budget: '',
    completedDate: '',
    featured: false,
}

export default function ProjectFormModal({
    isOpen,
    onClose,
    onSave,         // async (formData) => void
    initialData,    // project object when editing, null when creating
}) {
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState({})

    const isEditing = !!initialData

    // Populate form when opening for edit, reset when opening for create
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setForm({
                    title: initialData.title || '',
                    category: initialData.category || PROJECT_CATEGORIES[0],
                    status: initialData.status || 'completed',
                    location: initialData.location || '',
                    description: initialData.description || '',
                    impactSummary: initialData.impactSummary || '',
                    coverImage: initialData.coverImage || '',
                    budget: initialData.budget || '',
                    completedDate: initialData.completedDate
                        ? new Date(initialData.completedDate.toDate?.() || initialData.completedDate)
                            .toISOString().split('T')[0]
                        : '',
                    featured: initialData.featured || false,
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
        if (!form.location.trim()) next.location = 'Location is required.'
        if (!form.description.trim()) next.description = 'Description is required.'
        if (!form.impactSummary.trim()) next.impactSummary = 'Impact summary is required.'
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
                budget: form.budget ? Number(form.budget) : null,
                completedDate: form.completedDate ? new Date(form.completedDate) : null,
            }
            await onSave(payload)
            toast.success(isEditing ? 'Project updated.' : 'Project created.')
            onClose()
        } catch (err) {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={saving ? undefined : onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-card-hover w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-border">
                    <h2 className="font-heading text-lg font-semibold text-primary">
                        {isEditing ? 'Edit Project' : 'Add New Project'}
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

                {/* Form (scrollable) */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

                    <Input
                        label="Project Title *"
                        id="title"
                        value={form.title}
                        onChange={e => update('title', e.target.value)}
                        error={errors.title}
                        placeholder="e.g. New Streetlight, Gesoni Boda Boda stage"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-neutral-dark">Category *</label>
                            <select
                                value={form.category}
                                onChange={e => update('category', e.target.value)}
                                className="w-full px-4 py-2.5 rounded border border-neutral-border bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                            >
                                {PROJECT_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-neutral-dark">Status *</label>
                            <select
                                value={form.status}
                                onChange={e => update('status', e.target.value)}
                                className="w-full px-4 py-2.5 rounded border border-neutral-border bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                            >
                                {PROJECT_STATUSES.map(s => (
                                    <option key={s} value={s} className="capitalize">{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <Input
                        label="Location / Ward *"
                        id="location"
                        value={form.location}
                        onChange={e => update('location', e.target.value)}
                        error={errors.location}
                        placeholder="e.g. Bogeka Ward, Kisii County"
                    />

                    <Input
                        label="Impact Summary *"
                        id="impactSummary"
                        value={form.impactSummary}
                        onChange={e => update('impactSummary', e.target.value)}
                        error={errors.impactSummary}
                        placeholder="e.g. Improved security, more working hours, and more income"
                    />

                    <Input
                        label="Full Description *"
                        id="description"
                        textarea
                        rows={4}
                        value={form.description}
                        onChange={e => update('description', e.target.value)}
                        error={errors.description}
                        placeholder="Describe the project in detail..."
                    />

                    <ImageUploader
                        label="Cover Image *"
                        folder="campaign/projects"
                        currentImageUrl={form.coverImage}
                        onUploadComplete={({ url }) => update('coverImage', url)}
                    />
                    {errors.coverImage && (
                        <p className="text-xs text-red-600 -mt-2">{errors.coverImage}</p>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Budget (optional)"
                            id="budget"
                            type="number"
                            value={form.budget}
                            onChange={e => update('budget', e.target.value)}
                            placeholder="e.g. 1500000"
                        />
                        <Input
                            label="Completion Date (optional)"
                            id="completedDate"
                            type="date"
                            value={form.completedDate}
                            onChange={e => update('completedDate', e.target.value)}
                        />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.featured}
                            onChange={e => update('featured', e.target.checked)}
                            className="w-4 h-4 rounded border-neutral-border text-accent focus:ring-accent"
                        />
                        <span className="text-sm font-medium text-neutral-dark">
                            Feature this project on the Home page
                        </span>
                    </label>

                </form>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-neutral-border">
                    <Button variant="ghost" onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} loading={saving}>
                        {isEditing ? 'Save Changes' : 'Create Project'}
                    </Button>
                </div>

            </div>
        </div>
    )
}