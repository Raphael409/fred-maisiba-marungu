// src/pages/public/Contact.jsx

import { addDocument } from '@/firebase/firestore'
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Facebook,
  Instagram,
  Mail, MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Send,
  Twitter,
  User,
  Youtube,
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const emptyForm = { name: '', email: '', phone: '', subject: '', message: '' }

const socials = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
  { icon: MessageCircle, label: 'WhatsApp', href: '#' },
]

export default function Contact() {
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
    if (!form.name.trim()) next.name = 'Your name is required.'
    if (!form.email.trim()) next.email = 'Your email is required.'
    if (!form.subject.trim()) next.subject = 'Please enter a subject.'
    if (!form.message.trim()) next.message = 'Please enter a message.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await addDocument('contactMessages', {
        ...form,
        status: 'unread',
        submittedAt: new Date(),
      })
      setSubmitted(true)
      setForm(emptyForm)
      toast.success('Message sent! We\'ll get back to you shortly.')
    } catch {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const fieldBase = (hasError) =>
    `w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors ${hasError ? 'border-red-400' : 'border-neutral-border'
    }`

  return (
    <div>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-primary-dark pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '36px 36px' }}
        />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <MessageSquare size={12} className="text-accent" />
            <span className="text-xs font-heading font-semibold uppercase tracking-widest text-white/90">
              Get in Touch
            </span>
          </div>
          <h1 className="font-heading font-bold text-3xl lg:text-5xl text-white mb-4">
            Contact the Campaign
          </h1>
          <p className="text-white/70 max-w-xl mx-auto leading-relaxed">
            Have a question, suggestion, or want to support Fred Maisiba's
            campaign for Bogeka Ward MCA? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────────── */}
      <section className="bg-neutral-bg py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* ── Left: contact info ─────────────────────────── */}
            <div>
              <div className="inline-flex items-center gap-2 bg-secondary/8 rounded-full px-4 py-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-xs font-heading font-semibold uppercase tracking-widest text-secondary">
                  Contact Information
                </span>
              </div>
              <h2 className="font-heading font-bold text-3xl lg:text-4xl text-primary mb-4">
                Send Us a Message
              </h2>
              <p className="text-neutral-muted leading-relaxed mb-8">
                Have a question, suggestion, or want to support the campaign?
                Fill in the form and the Fred Maisiba campaign team will get
                back to you as soon as possible.
              </p>

              {/* Contact detail cards */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-card">
                  <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-muted uppercase tracking-wide">Call Anytime</p>
                    <a
                      href="tel:+254719562294"
                      className="font-heading font-semibold text-primary hover:text-accent transition-colors"
                    >
                      +254 719 562 294
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-card">
                  <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-muted uppercase tracking-wide">Email Us</p>
                    <a
                      href="mailto:fredmaisiba@gmail.com"
                      className="font-heading font-semibold text-primary hover:text-accent transition-colors"
                    >
                      fredmaisiba@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-card">
                  <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-muted uppercase tracking-wide">Location</p>
                    <p className="font-heading font-semibold text-primary">Bogeka Ward, Kenya</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-card">
                  <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-muted uppercase tracking-wide">Office Hours</p>
                    <p className="font-heading font-semibold text-primary">Mon – Fri, 8am – 6pm</p>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div>
                <p className="text-xs font-heading font-semibold uppercase tracking-widest text-neutral-muted mb-3">
                  Follow the Campaign
                </p>
                <div className="flex gap-2">
                  {socials.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white border border-neutral-border flex items-center justify-center text-neutral-muted hover:bg-secondary hover:text-white hover:border-secondary transition-colors duration-200 shadow-card"
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: form ────────────────────────────────── */}
            <div className="bg-white rounded-3xl shadow-card-hover p-7 lg:p-9">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle size={32} className="text-success" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-primary">Message Sent!</h3>
                  <p className="text-neutral-muted text-sm max-w-xs">
                    Thank you for reaching out. The Fred Maisiba campaign team
                    will respond to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-sm text-accent font-semibold hover:text-accent-dark transition-colors"
                  >
                    Send another message →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">

                  <h3 className="font-heading font-bold text-xl text-primary mb-1">
                    Send a Message
                  </h3>
                  <p className="text-sm text-neutral-muted mb-5">
                    Fields marked * are required.
                  </p>

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-muted" />
                        <input
                          type="text"
                          value={form.name}
                          onChange={e => update('name', e.target.value)}
                          placeholder="Your full name"
                          className={fieldBase(errors.name)}
                        />
                      </div>
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-muted" />
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => update('email', e.target.value)}
                          placeholder="your@email.com"
                          className={fieldBase(errors.email)}
                        />
                      </div>
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Phone + Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                        Phone (optional)
                      </label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-muted" />
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => update('phone', e.target.value)}
                          placeholder="+254 7XX XXX XXX"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-border text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                        Subject *
                      </label>
                      <div className="relative">
                        <MessageSquare size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-muted" />
                        <select
                          value={form.subject}
                          onChange={e => update('subject', e.target.value)}
                          className={`${fieldBase(errors.subject)} bg-white appearance-none`}
                        >
                          <option value="">Select a subject</option>
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Community Project">Community Project</option>
                          <option value="Volunteer">Volunteer</option>
                          <option value="Media & Press">Media &amp; Press</option>
                          <option value="Support & Donation">Support &amp; Donation</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-dark mb-1.5">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={e => update('message', e.target.value)}
                      placeholder="Write your message here..."
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors resize-none ${errors.message ? 'border-red-400' : 'border-neutral-border'
                        }`}
                    />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-secondary text-white font-heading font-bold text-sm rounded-xl hover:bg-secondary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </button>

                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-secondary py-14 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-2xl lg:text-3xl text-white mb-3">
            Want to Do More Than Message Us?
          </h2>
          <p className="text-white/70 mb-7 max-w-xl mx-auto">
            Join the Chinsiaga movement as a volunteer and make a real
            difference in Bogeka Ward.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/volunteer"
              className="inline-flex items-center gap-2 px-7 py-3 bg-accent text-white font-heading font-semibold text-sm rounded-full hover:bg-accent-dark transition-colors shadow-glow"
            >
              Join Our Movement <ArrowRight size={15} />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-7 py-3 border-2 border-white/40 text-white font-heading font-semibold text-sm rounded-full hover:bg-white hover:text-secondary transition-colors"
            >
              Meet Fred Maisiba
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}