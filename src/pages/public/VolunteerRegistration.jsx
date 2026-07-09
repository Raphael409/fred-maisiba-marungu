// src/pages/public/VolunteerRegistration.jsx

import { addDocument } from '@/firebase/firestore'
import {
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  Heart,
  Mail, MapPin,
  Megaphone,
  Phone,
  Send,
  Smartphone,
  Truck,
  User,
  Users,
} from 'lucide-react'
import { useState } from 'react'
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
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  function validate() {
    const next = {}
    if (!form.fullName.trim()) next.fullName = 'Full name is required.'
    if (!form.email.trim()) next.email = 'Email address is required.'
    if (!form.phone.trim()) next.phone = 'Phone number is required.'
    if (!form.village.trim()) next.village = 'Village / location is required.'
    if (!form.role) next.role = 'Please select a role.'
    if (!form.availability) next.availability = 'Please select your availability.'
    if (!form.agree) next.agree = 'You must agree to the terms.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) {
      toast.error('Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    try {
      await addDocument('volunteers', {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        location: form.village,
        areasOfInterest: [form.role],
        availability: form.availability,
        skillsExperience: form.skills,
        status: 'new',
        submittedAt: new Date(),
      })
      setSubmitted(true)
      setForm(emptyForm)
      toast.success('Registration successful! The team will contact you soon.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const fieldBase = (hasError) =>
    `w-full px-4 py-3 rounded-xl border text-sm bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors ${hasError ? 'border-red-400' : 'border-neutral-border'
    }`

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
              Join the Movement
            </span>
          </div>
          <h1 className="font-heading font-bold text-3xl lg:text-5xl text-white mb-4">
            Volunteer for Bogeka Ward
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
              Volunteer Opportunities
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
                Sign Up to Volunteer
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
                    <p className="text-sm text-neutral-muted mb-5">
                      All fields marked * are required.
                    </p>

                    {/* Name + Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            placeholder="Your full name"
                            className={`${fieldBase(errors.fullName)} pl-10`}
                          />
                        </div>
                        {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-muted" />
                          <input
                            type="tel"
                            value={form.phone}
                            onChange={e => update('phone', e.target.value)}
                            placeholder="+254 7XX XXX XXX"
                            className={`${fieldBase(errors.phone)} pl-10`}
                          />
                        </div>
                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    {/* Email + Village */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-muted" />
                          <input
                            type="email"
                            value={form.email}
                            onChange={e => update('email', e.target.value)}
                            placeholder="your@email.com"
                            className={`${fieldBase(errors.email)} pl-10`}
                          />
                        </div>
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
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
                            placeholder="Your village in Bogeka Ward"
                            className={`${fieldBase(errors.village)} pl-10`}
                          />
                        </div>
                        {errors.village && <p className="text-xs text-red-500 mt-1">{errors.village}</p>}
                      </div>
                    </div>

                    {/* Role + Availability */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                          Volunteer Role *
                        </label>
                        <select
                          value={form.role}
                          onChange={e => update('role', e.target.value)}
                          className={fieldBase(errors.role)}
                        >
                          <option value="">Select a role</option>
                          {roles.map(r => (
                            <option key={r.value} value={r.value}>{r.value}</option>
                          ))}
                        </select>
                        {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                          Availability *
                        </label>
                        <div className="relative">
                          <Clock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-muted" />
                          <select
                            value={form.availability}
                            onChange={e => update('availability', e.target.value)}
                            className={`${fieldBase(errors.availability)} pl-10`}
                          >
                            <option value="">When are you free?</option>
                            {availability.map(a => (
                              <option key={a} value={a}>{a}</option>
                            ))}
                          </select>
                        </div>
                        {errors.availability && <p className="text-xs text-red-500 mt-1">{errors.availability}</p>}
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                        Skills / Experience (optional)
                      </label>
                      <textarea
                        rows={3}
                        value={form.skills}
                        onChange={e => update('skills', e.target.value)}
                        placeholder="Tell us about any relevant skills, experience, or why you want to volunteer..."
                        className="w-full px-4 py-3 rounded-xl border border-neutral-border text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors resize-none"
                      />
                    </div>

                    {/* Agreement */}
                    <div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.agree}
                          onChange={e => update('agree', e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-neutral-border text-secondary focus:ring-secondary flex-shrink-0"
                        />
                        <span className="text-xs text-neutral-muted leading-relaxed">
                          I agree to be contacted by the Fred Maisiba Marungu campaign team
                          regarding my volunteer registration. My information will be used
                          solely for campaign coordination purposes. *
                        </span>
                      </label>
                      {errors.agree && <p className="text-xs text-red-500 mt-1">{errors.agree}</p>}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-secondary text-white font-heading font-bold text-sm rounded-xl hover:bg-secondary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Register as a Volunteer
                        </>
                      )}
                    </button>
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