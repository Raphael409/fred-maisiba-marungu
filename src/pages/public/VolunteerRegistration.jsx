// src/pages/public/VolunteerRegistration.jsx

import { addDocument, getDocuments, where } from '@/firebase/firestore'
import {
  ArrowRight,
  Briefcase,
  Calendar,
  CalendarDays,
  CheckCircle,
  ClipboardList,
  CreditCard,
  Heart,
  Mail, MapPin,
  Megaphone,
  Phone,
  Send,
  Smartphone,
  Truck,
  User,
  Users
} from 'lucide-react'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

// ─── Volunteer roles ──────────────────────────────────────────────────────────
const roles = [
  { value: 'Door-to-Door Canvassing', icon: Users, description: 'Visit homes across Bogeka villages to share Fred\'s message and register supporters.' },
  { value: 'Social Media Ambassador', icon: Smartphone, description: 'Create and share campaign content across Facebook, Twitter, Instagram, and WhatsApp.' },
  { value: 'Event Support', icon: Calendar, description: 'Help organise and run campaign rallies, community meetings, and ward events.' },
  { value: 'Youth Mobilisation', icon: Heart, description: 'Engage young people in Bogeka Ward and drive youth participation in the campaign.' },
  { value: 'Transport & Logistics', icon: Truck, description: 'Provide or coordinate transport for campaign materials, team members, and events.' },
  { value: 'Data Entry & Administration', icon: ClipboardList, description: 'Support the campaign office with data, record-keeping, and administrative tasks.' },
  { value: 'Community Outreach', icon: Megaphone, description: 'Speak at community gatherings, churches, schools, and local forums about Fred\'s vision.' },
  { value: 'Other', icon: Briefcase, description: 'Have a skill or idea not listed above? Tell us how you\'d like to contribute.' },
]

const availability = [
  'Weekdays (Morning)',
  'Weekdays (Afternoon)',
  'Weekdays (Evening)',
  'Weekends only',
  'Flexible / Any time',
  'Events only',
]

const emptyForm = {
  fullName: '',
  idNumber: '',
  yearOfBirth: '',
  email: '',
  phone: '',
  village: '',
  role: '',
  availability: '',
  skills: '',
  agree: false,
}

export default function VolunteerRegistration() {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [fieldValid, setFieldValid] = useState({})
  const [checking, setChecking] = useState({}) // per-field async check state
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Update field value and clear error on change
  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    // Clear error as user types
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
    // Clear valid state while typing
    if (fieldValid[field]) setFieldValid(prev => ({ ...prev, [field]: false }))
  }

  // Validate a single field — called on blur
  const validateField = useCallback(async (field, value) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    let error = null
    let valid = false

    switch (field) {
      case 'fullName':
        if (!value.trim()) error = 'Full name is required.'
        else if (value.trim().length < 3) error = 'Name must be at least 3 characters.'
        else valid = true
        break

      case 'idNumber':
        if (!value.trim()) { error = 'ID number is required.'; break }
        if (!/^\d{7,8}$/.test(value.trim())) { error = 'Enter a valid 7-8 digit Kenya national ID.'; break }
        // Async duplicate check
        setChecking(prev => ({ ...prev, idNumber: true }))
        try {
          const existing = await getDocuments('volunteers', [where('idNumber', '==', value.trim())])
          if (existing.length > 0) error = 'This ID number is already registered.'
          else valid = true
        } catch { valid = true } // don't block on network error
        setChecking(prev => ({ ...prev, idNumber: false }))
        break

      case 'yearOfBirth':
        if (!value.trim()) { error = 'Year of birth is required.'; break }
        const yr = parseInt(value)
        if (isNaN(yr) || yr < 1920) { error = 'Enter a valid year of birth.'; break }
        if (yr > new Date().getFullYear() - 18) { error = 'You must be 18 or older to register.'; break }
        valid = true
        break

      case 'phone':
        if (!value.trim()) { error = 'Phone number is required.'; break }
        if (value.replace(/\D/g, '').length < 9) { error = 'Enter at least 9 digits after +254.'; break }
        // Async duplicate check
        const fullPhone = '+254' + value.replace(/\D/g, '')
        setChecking(prev => ({ ...prev, phone: true }))
        try {
          const existing = await getDocuments('volunteers', [where('phone', '==', fullPhone)])
          if (existing.length > 0) error = 'This phone number is already registered.'
          else valid = true
        } catch { valid = true }
        setChecking(prev => ({ ...prev, phone: false }))
        break

      case 'email':
        if (!value.trim()) { valid = true; break } // optional
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) { error = 'Enter a valid email address.'; break }
        // Async duplicate check
        setChecking(prev => ({ ...prev, email: true }))
        try {
          const existing = await getDocuments('volunteers', [where('email', '==', value.trim().toLowerCase())])
          if (existing.length > 0) error = 'This email is already registered.'
          else valid = true
        } catch { valid = true }
        setChecking(prev => ({ ...prev, email: false }))
        break

      case 'village':
        if (!value.trim()) error = 'Village / location is required.'
        else valid = true
        break

      case 'role':
        if (!value) error = 'Please select a role.'
        else valid = true
        break

      case 'availability':
        if (!value) error = 'Please select your availability.'
        else valid = true
        break

      default:
        valid = true
    }

    setErrors(prev => ({ ...prev, [field]: error }))
    setFieldValid(prev => ({ ...prev, [field]: valid }))
  }, [])

  // All required fields must be valid before submit is enabled
  const requiredFields = ['fullName', 'idNumber', 'yearOfBirth', 'phone', 'village', 'role', 'availability']
  const isFormReady = requiredFields.every(f => fieldValid[f] === true)
    && form.agree
    && !Object.values(checking).some(Boolean)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isFormReady || submitting) return

    setSubmitting(true)
    try {
      const fullPhone = '+254' + form.phone.replace(/\D/g, '')
      await addDocument('volunteers', {
        fullName: form.fullName.trim(),
        idNumber: form.idNumber.trim(),
        yearOfBirth: form.yearOfBirth.trim(),
        email: form.email.trim().toLowerCase() || null,
        phone: fullPhone,
        location: form.village.trim(),
        areasOfInterest: [form.role],
        availability: form.availability,
        skillsExperience: form.skills.trim(),
        status: 'new',
        submittedAt: new Date(),
      })
      setSubmitted(true)
      setForm(emptyForm)
      setErrors({})
      setTouched({})
      setFieldValid({})
      toast.success('Registration successful! The team will contact you soon.')
    } catch (err) {
      console.error('Registration error:', err)
      toast.error('Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Field styling based on validation state
  function fieldClass(field, extra = '') {
    const base = `w-full pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${extra}`
    if (checking[field]) return `${base} border-neutral-border bg-white focus:border-secondary focus:ring-secondary/20`
    if (errors[field]) return `${base} border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100`
    if (fieldValid[field]) return `${base} border-success bg-success/5 focus:border-success focus:ring-success/20`
    return `${base} border-neutral-border bg-white focus:border-secondary focus:ring-secondary/20`
  }

  // Inline feedback shown below each field
  function FieldFeedback({ field }) {
    if (checking[field]) return (
      <p className="flex items-center gap-1.5 text-xs text-secondary mt-1.5">
        <span className="w-3 h-3 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin inline-block" />
        Checking...
      </p>
    )
    if (errors[field]) return (
      <p className="flex items-center gap-1 text-xs text-red-600 mt-1.5">
        <span className="text-red-500">✕</span> {errors[field]}
      </p>
    )
    if (fieldValid[field] && touched[field]) return (
      <p className="flex items-center gap-1 text-xs text-success mt-1.5">
        <CheckCircle size={12} /> Looks good
      </p>
    )
    return null
  }

  return (
    <div>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-primary-dark pt-32 pb-20 lg:pt-40 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '36px 36px' }}
        />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <Heart size={12} className="text-accent" />
            <span className="text-xs font-heading font-semibold uppercase tracking-widest text-white/90">
              Join Our Movement
            </span>
          </div>
          <h1 className="font-heading font-bold text-3xl lg:text-5xl text-white mb-4">
            Join Our Movement — Bogeka Ward
          </h1>
          <p className="font-accent italic text-xl text-white/80 mb-4">
            &ldquo;Chinsiaga&rdquo; — Together We Move Forward
          </p>
          <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
            Fred Maisiba's campaign is powered by the people of Bogeka.
            Whether you have an hour a week or a full-time commitment,
            your contribution matters. Join us and help deliver real change.
          </p>
        </div>
      </section>

      {/* ── Roles & Opportunities ─────────────────────────────── */}
      <section className="bg-neutral-bg py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-secondary/8 rounded-full px-4 py-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-xs font-heading font-semibold uppercase tracking-widest text-secondary">
                Ways to Help
              </span>
            </div>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-3">
              Ways to Get Involved
            </h2>
            <p className="text-neutral-muted">
              Choose how you'd like to contribute to the Fred Maisiba campaign.
              Every role makes a real difference in Bogeka Ward.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {roles.map(({ value, icon: Icon, description }) => (
              <div
                key={value}
                className="group bg-white rounded-2xl p-5 border border-neutral-border shadow-card hover:shadow-card-hover hover:border-secondary transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-11 h-11 rounded-xl bg-secondary group-hover:bg-accent flex items-center justify-center mb-4 transition-colors duration-300">
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="font-heading font-bold text-sm text-primary mb-2">{value}</h3>
                <p className="text-xs text-neutral-muted leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Registration Form ──────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

            {/* Left — info panel */}
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-secondary/8 rounded-full px-4 py-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-xs font-heading font-semibold uppercase tracking-widest text-secondary">
                  Registration
                </span>
              </div>
              <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-4">
                Register as a Member
              </h2>
              <p className="text-neutral-muted leading-relaxed mb-8">
                Fill in the form and a member of the Fred Maisiba campaign
                team will contact you within 48 hours to confirm your
                role and get you started.
              </p>

              {/* Why volunteer points */}
              <div className="space-y-4">
                {[
                  { icon: Heart, text: 'Make a real difference in Bogeka Ward' },
                  { icon: Users, text: 'Join a growing community of supporters' },
                  { icon: CheckCircle, text: 'Choose a role that fits your schedule' },
                  { icon: ArrowRight, text: 'Be part of history in Bogeka' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-secondary" />
                    </div>
                    <p className="text-sm text-neutral-dark font-medium">{text}</p>
                  </div>
                ))}
              </div>

              {/* Contact fallback */}
              <div className="mt-8 p-5 bg-neutral-bg rounded-2xl border border-neutral-border">
                <p className="text-sm font-heading font-semibold text-primary mb-1">
                  Prefer to call directly?
                </p>
                <a
                  href="tel:+254719562294"
                  className="flex items-center gap-2 text-sm text-accent hover:text-accent-dark transition-colors font-medium"
                >
                  <Phone size={14} />
                  +254 719 562 294
                </a>
                <a
                  href="mailto:fredmaisiba@gmail.com"
                  className="flex items-center gap-2 text-sm text-accent hover:text-accent-dark transition-colors font-medium mt-1"
                >
                  <Mail size={14} />
                  fredmaisiba@gmail.com
                </a>
              </div>
            </div>

            {/* Right — form card */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-card-hover border border-neutral-border p-7 lg:p-10">

                {submitted ? (
                  /* Success state */
                  <div className="flex flex-col items-center text-center py-12 gap-4">
                    <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle size={40} className="text-success" />
                    </div>
                    <h3 className="font-heading font-bold text-2xl text-primary">
                      Welcome to the Team!
                    </h3>
                    <p className="text-neutral-muted max-w-sm leading-relaxed">
                      Thank you for registering, <strong>{form.fullName || 'volunteer'}</strong>!
                      A member of the Fred Maisiba campaign team will contact
                      you within 48 hours. Together — Chinsiaga! 🙏
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                      <button
                        onClick={() => setSubmitted(false)}
                        className="text-sm text-accent font-semibold hover:text-accent-dark transition-colors"
                      >
                        Register another volunteer →
                      </button>
                      <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-secondary text-white text-sm font-heading font-semibold rounded-full hover:bg-secondary-dark transition-colors"
                      >
                        Back to Home
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <h3 className="font-heading font-bold text-xl text-primary mb-1">
                      Membership Registration
                    </h3>
                    <p className="text-sm text-neutral-muted mb-2">
                      Fields marked * are required. Email is optional.
                    </p>

                    {/* Progress indicator */}
                    <div className="flex gap-1 mb-4">
                      {requiredFields.map(f => (
                        <div key={f} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${errors[f] ? 'bg-red-400' :
                            fieldValid[f] ? 'bg-success' :
                              'bg-neutral-border'
                          }`} />
                      ))}
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-muted" />
                        <input
                          type="text"
                          value={form.fullName}
                          onChange={e => update('fullName', e.target.value)}
                          onBlur={e => validateField('fullName', e.target.value)}
                          placeholder="Your full name"
                          className={`${fieldClass('fullName', 'pl-10')}`}
                        />
                      </div>
                      <FieldFeedback field="fullName" />
                    </div>

                    {/* Phone — Kenya flag + +254 prefix */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                        Phone Number *
                      </label>
                      <div className="flex">
                        {/* Country prefix badge */}
                        <div className="flex items-center gap-1.5 px-3 py-3 bg-neutral-bg border border-r-0 border-neutral-border rounded-l-xl flex-shrink-0">
                          <span className="text-base leading-none">🇰🇪</span>
                          <span className="text-sm font-semibold text-neutral-dark">+254</span>
                        </div>
                        <input
                          type="tel"
                          inputMode="numeric"
                          value={form.phone}
                          onChange={e => update('phone', e.target.value.replace(/\D/g, ''))}
                          onBlur={e => validateField('phone', e.target.value)}
                          placeholder="7XX XXX XXX"
                          maxLength={9}
                          className={`flex-1 px-4 py-3 rounded-r-xl border text-sm focus:outline-none focus:ring-2 transition-all ${errors['phone'] ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100' :
                              fieldValid['phone'] ? 'border-success bg-success/5 focus:border-success focus:ring-success/20' :
                                'border-neutral-border bg-white focus:border-secondary focus:ring-secondary/20'
                            }`}
                        />
                      </div>
                      <FieldFeedback field="phone" />
                    </div>

                    {/* ID Number + Year of Birth */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                          National ID Number *
                        </label>
                        <div className="relative">
                          <CreditCard size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-muted" />
                          <input
                            type="text"
                            inputMode="numeric"
                            value={form.idNumber}
                            onChange={e => update('idNumber', e.target.value.replace(/\D/g, ''))}
                            onBlur={e => validateField('idNumber', e.target.value)}
                            placeholder="e.g. 12345678"
                            maxLength={8}
                            className={`${fieldClass('idNumber', 'pl-10')}`}
                          />
                        </div>
                        <FieldFeedback field="idNumber" />
                        {!touched.idNumber && (
                          <p className="text-[10px] text-neutral-muted mt-1">Each ID can only register once.</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                          Year of Birth *
                        </label>
                        <div className="relative">
                          <CalendarDays size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-muted" />
                          <input
                            type="text"
                            inputMode="numeric"
                            value={form.yearOfBirth}
                            onChange={e => update('yearOfBirth', e.target.value.replace(/\D/g, ''))}
                            onBlur={e => validateField('yearOfBirth', e.target.value)}
                            placeholder="e.g. 1985"
                            maxLength={4}
                            className={`${fieldClass('yearOfBirth', 'pl-10')}`}
                          />
                        </div>
                        <FieldFeedback field="yearOfBirth" />
                      </div>
                    </div>

                    {/* Email + Village */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                          Email <span className="text-neutral-muted font-normal">(optional)</span>
                        </label>
                        <div className="relative">
                          <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-muted" />
                          <input
                            type="email"
                            value={form.email}
                            onChange={e => update('email', e.target.value)}
                            onBlur={e => validateField('email', e.target.value)}
                            placeholder="your@email.com"
                            className={`${fieldClass('email', 'pl-10')}`}
                          />
                        </div>
                        <FieldFeedback field="email" />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                          Village / Location *
                        </label>
                        <div className="relative">
                          <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-muted" />
                          <input
                            type="text"
                            value={form.village}
                            onChange={e => update('village', e.target.value)}
                            onBlur={e => validateField('village', e.target.value)}
                            placeholder="Your village in Bogeka Ward"
                            className={`${fieldClass('village', 'pl-10')}`}
                          />
                        </div>
                        <FieldFeedback field="village" />
                      </div>
                    </div>

                    {/* Role + Availability */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                          Area of Involvement *
                        </label>
                        <select
                          value={form.role}
                          onChange={e => { update('role', e.target.value); validateField('role', e.target.value) }}
                          onBlur={e => validateField('role', e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 transition-all ${errors['role'] ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100' :
                              fieldValid['role'] ? 'border-success bg-success/5 focus:border-success focus:ring-success/20' :
                                'border-neutral-border focus:border-secondary focus:ring-secondary/20'
                            }`}
                        >
                          <option value="">Select a role</option>
                          {roles.map(r => (
                            <option key={r.value} value={r.value}>{r.value}</option>
                          ))}
                        </select>
                        <FieldFeedback field="role" />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                          Availability *
                        </label>
                        <select
                          value={form.availability}
                          onChange={e => { update('availability', e.target.value); validateField('availability', e.target.value) }}
                          onBlur={e => validateField('availability', e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 transition-all ${errors['availability'] ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100' :
                              fieldValid['availability'] ? 'border-success bg-success/5 focus:border-success focus:ring-success/20' :
                                'border-neutral-border focus:border-secondary focus:ring-secondary/20'
                            }`}
                        >
                          <option value="">When are you free?</option>
                          {availability.map(a => (
                            <option key={a} value={a}>{a}</option>
                          ))}
                        </select>
                        <FieldFeedback field="availability" />
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                        Skills / Experience <span className="text-neutral-muted font-normal">(optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={form.skills}
                        onChange={e => update('skills', e.target.value)}
                        placeholder="Any relevant skills, experience, or why you want to join..."
                        className="w-full px-4 py-3 rounded-xl border border-neutral-border bg-white text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors resize-none"
                      />
                    </div>

                    {/* Agreement */}
                    <div>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={form.agree}
                          onChange={e => update('agree', e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-neutral-border text-secondary focus:ring-secondary flex-shrink-0 cursor-pointer"
                        />
                        <span className="text-xs text-neutral-muted leading-relaxed group-hover:text-neutral-dark transition-colors">
                          I agree to be contacted by the Fred Maisiba Marungu campaign team.
                          My information will be used solely for campaign coordination. *
                        </span>
                      </label>
                      {!form.agree && touched.agree && (
                        <p className="text-xs text-red-500 mt-1">You must agree before submitting.</p>
                      )}
                    </div>

                    {/* Submit button — colour changes based on readiness */}
                    <div className="pt-1">
                      {!isFormReady && (
                        <p className="text-xs text-neutral-muted text-center mb-2">
                          {Object.values(checking).some(Boolean)
                            ? '⏳ Checking your details...'
                            : '✏️ Complete all required fields to enable registration'}
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={!isFormReady || submitting}
                        className={`w-full flex items-center justify-center gap-2 px-6 py-4 font-heading font-bold text-sm rounded-xl transition-all duration-300 shadow-md ${isFormReady && !submitting
                            ? 'bg-secondary text-white hover:bg-secondary-dark cursor-pointer shadow-card-hover'
                            : 'bg-neutral-border text-neutral-muted cursor-not-allowed'
                          }`}
                      >
                        {submitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Register as a Member
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-primary py-14 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-2xl lg:text-3xl text-white mb-3">
            Have Questions About Volunteering?
          </h2>
          <p className="text-white/70 mb-7 max-w-xl mx-auto">
            The Fred Maisiba campaign team is happy to answer any questions
            before you sign up.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 bg-accent text-white font-heading font-semibold text-sm rounded-full hover:bg-accent-dark transition-colors shadow-glow"
            >
              Contact the Team <ArrowRight size={15} />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-7 py-3 border-2 border-white/40 text-white font-heading font-semibold text-sm rounded-full hover:bg-white hover:text-primary transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}