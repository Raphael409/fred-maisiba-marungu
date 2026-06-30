// src/components/admin/VolunteerDetailModal.jsx
// Read-only detail panel showing a volunteer's full submission.

import { VOLUNTEER_STATUSES } from '@/utils/constants'
import { formatDate, timeAgo } from '@/utils/formatDate'
import { Award, Clock, Mail, MapPin, Phone, X } from 'lucide-react'
import StatusDropdown from './StatusDropdown'

function DetailRow({ icon: Icon, label, value }) {
    if (!value) return null
    return (
        <div className="flex gap-3">
            <Icon size={18} className="text-neutral-muted flex-shrink-0 mt-0.5" />
            <div>
                <p className="text-xs text-neutral-muted">{label}</p>
                <p className="text-sm text-neutral-dark">{value}</p>
            </div>
        </div>
    )
}

export default function VolunteerDetailModal({
    volunteer,
    onClose,
    onStatusChange,
}) {
    if (!volunteer) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
                aria-hidden="true"
            />

            <div className="relative bg-white rounded-xl shadow-card-hover w-full max-w-lg max-h-[85vh] flex flex-col animate-slide-up">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-border">
                    <div>
                        <h2 className="font-heading text-lg font-semibold text-primary">
                            {volunteer.fullName}
                        </h2>
                        <p className="text-xs text-neutral-muted">
                            Submitted {timeAgo(volunteer.submittedAt)} &middot; {formatDate(volunteer.submittedAt)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-neutral-muted hover:text-neutral-dark rounded"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

                    {/* Status */}
                    <div className="flex items-center justify-between bg-neutral-bg rounded-lg p-3">
                        <span className="text-sm font-medium text-neutral-dark">Status</span>
                        <StatusDropdown
                            value={volunteer.status || 'new'}
                            options={VOLUNTEER_STATUSES}
                            onChange={(status) => onStatusChange(volunteer.id, status)}
                        />
                    </div>

                    {/* Contact info */}
                    <div className="space-y-3">
                        <DetailRow icon={Mail} label="Email" value={volunteer.email} />
                        <DetailRow icon={Phone} label="Phone" value={volunteer.phone} />
                        <DetailRow icon={MapPin} label="Location" value={volunteer.location} />
                        <DetailRow icon={Clock} label="Availability" value={volunteer.availability} />
                    </div>

                    {/* Areas of interest */}
                    {volunteer.areasOfInterest?.length > 0 && (
                        <div>
                            <p className="text-xs text-neutral-muted mb-2 flex items-center gap-1.5">
                                <Award size={14} /> Areas of Interest
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {volunteer.areasOfInterest.map(area => (
                                    <span
                                        key={area}
                                        className="text-xs px-2.5 py-1 bg-primary/5 text-primary rounded-full font-medium"
                                    >
                                        {area}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skills / experience */}
                    {volunteer.skillsExperience && (
                        <div>
                            <p className="text-xs text-neutral-muted mb-1">Skills / Experience</p>
                            <p className="text-sm text-neutral-dark whitespace-pre-line bg-neutral-bg rounded-lg p-3">
                                {volunteer.skillsExperience}
                            </p>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-neutral-border">
                    <a
                        href={`mailto:${volunteer.email}`}
                        className="px-4 py-2 bg-primary text-white text-sm font-heading font-semibold rounded hover:bg-primary-dark transition-colors"
                    >
                        Email Volunteer
                    </a>
                </div>

            </div>
        </div>
    )
}