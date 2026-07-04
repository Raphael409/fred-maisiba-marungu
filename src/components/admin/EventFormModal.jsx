// src/components/admin/EventFormModal.jsx
// Create/Edit form modal for events. Supports multi-day date ranges.

import Button from '@/components/shared/Button'
import Input from '@/components/shared/Input'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ImageUploader from './ImageUploader'

const emptyForm = {
    title: '',
    description: '',
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    bannerImage: '',
}

// Combine a date input value ("2026-07-12") and time input value ("09:00")
// into a single JS Date object.
function combineDateTime(dateStr, timeStr) {
    if (!dateStr) return null
    const time = timeStr || '00:00'
    return new Date(`${dateStr}T${time}`)
}

// Split a JS Date (or Firestore Timestamp) back into separate
// date/time input strings for editing.
function splitDateTime(value) {
    if (!value) return { date: '', time: '' }
    const d = value?.toDate ? value.toDate() : new Date(value)
    const date = d.toISOString().split('T')[0]
    const time = d.toTimeString().slice(0, 5)
    return { date, time }
}

export default function EventFormModal({
    isOpen,
    onClose,
    onSave,        // async (formData) => void
    initialData,   // event object when editing, null when creating
}) {
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState({})

    const isEditing = !!initialData

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                const start = splitDateTime(initialData.startDateTime)
                const end = splitDateTime(initialData.endDateTime)
                setForm({
                    title: initialData.title || '',
                    description: initialData.description || '',
                    location: initialData.location || '',
                    startDate: start.date,
                    startTime: start.time,
                    endDate: end.date,
                    endTime: end.time,
                    bannerImage: initialData.bannerImage || '',
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
        if (!form.title.trim()) next.title = 'Event title is required.'
        if (!form.location.trim()) next.location = 'Location is required.'
        if (!form.description.trim()) next.description = 'Description is required.'
        if (!form.startDate) next.startDate = 'Start date is required.'
        if (!form.endDate) next.endDate = 'End date is required.'

        if (form.startDate && form.endDate) {
            const start = combineDateTime(form.startDate, form.startTime)
            const end = combineDateTime(form.endDate, form.endTime)
            if (end < start) {
                next.endDate = 'End date/time must be after the start date/time.'
            }
        }

        setErrors(next)
        return Object.keys(next).length === 0
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!validate()) {
            toast.error('Please fix the highlighted fields.')
            return
        }

        setSaving(true)
        try {
            const payload = {
                title: form.title,
                description: form.description,
                location: form.location,
                bannerImage: form.bannerImage,
                startDateTime: combineDateTime(form.startDate, form.startTime),
                endDateTime: combineDateTime(form.endDate, form.endTime),
            }
            await onSave(payload)
            toast.success(isEditing ? 'Event updated.' : 'Event created.')
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
                        {isEditing ? 'Edit Event' : 'Add New Event'}
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
                        label="Event Title *"
                        id="title"
                        value={form.title}
                        onChange={e => update('title', e.target.value)}
                        error={errors.title}
                        placeholder="e.g. Community water project Bogeka"
                    />

                    <Input
                        label="Location *"
                        id="location"
                        value={form.location}
                        onChange={e => update('location', e.target.value)}
                        error={errors.location}
                        placeholder="e.g. Irianyi, Bogeka, Kisii county"
                    />

                    <Input
                        label="Description *"
                        id="description"
                        textarea
                        rows={3}
                        value={form.description}
                        onChange={e => update('description', e.target.value)}
                        error={errors.description}
                        placeholder="What should attendees expect..."
                    />

                    {/* Date range */}
                    <div className="border border-neutral-border rounded-lg p-4 space-y-4">
                        <p className="text-sm font-semibold text-neutral-dark">Event Date & Time</p>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Start Date *"
                                id="startDate"
                                type="date"
                                value={form.startDate}
                                onChange={e => update('startDate', e.target.value)}
                                error={errors.startDate}
                            />
                            <Input
                                label="Start Time"
                                id="startTime"
                                type="time"
                                value={form.startTime}
                                onChange={e => update('startTime', e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="End Date *"
                                id="endDate"
                                type="date"
                                value={form.endDate}
                                onChange={e => update('endDate', e.target.value)}
                                error={errors.endDate}
                            />
                            <Input
                                label="End Time"
                                id="endTime"
                                type="time"
                                value={form.endTime}
                                onChange={e => update('endTime', e.target.value)}
                            />
                        </div>

                        <p className="text-xs text-neutral-muted">
                            For a single-day event, use the same Start Date and End Date.
                            Leave time fields blank for all-day events.
                        </p>
                    </div>

                    <ImageUploader
                        label="Event Banner (optional)"
                        folder="campaign/events"
                        currentImageUrl={form.bannerImage}
                        onUploadComplete={({ url }) => update('bannerImage', url)}
                    />

                </form>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-neutral-border">
                    <Button variant="ghost" onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} loading={saving}>
                        {isEditing ? 'Save Changes' : 'Create Event'}
                    </Button>
                </div>

            </div>
        </div>
    )
}