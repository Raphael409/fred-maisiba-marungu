// src/pages/public/Contact.jsx

import { useState }   from 'react'
import { Link }       from 'react-router-dom'
import {
  Phone, Mail, MapPin, Clock, Send,
  User, MessageSquare, CheckCircle, ArrowRight,
  Facebook, Youtube,
} from 'lucide-react'
import { addDocument } from '@/firebase/firestore'
import toast           from 'react-hot-toast'

// TikTok icon
function TikTokIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
    </svg>
  )
}

// WhatsApp icon
function WhatsAppIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  )
}

const emptyForm = { name: '', email: '', phone: '', subject: '', message: '' }

const socials = [
  { icon: Facebook,     label: 'Facebook',  href: 'https://www.facebook.com/mca.bogeka.marungu' },
  { icon: WhatsAppIcon, label: 'WhatsApp',  href: 'https://wa.me/254719562294'                   },
  { icon: Youtube,      label: 'YouTube',   href: 'https://www.youtube.com/@fredrickmarungu1340' },
  { icon: TikTokIcon,   label: 'TikTok',    href: 'https://www.tiktok.com/@fredhenry91'          },
]

export default function Contact() {
  const [form,       setForm]       = useState(emptyForm)
  const [errors,     setErrors]     = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim())    next.name    = 'Your name is required.'
    if (!form.email.trim())   next.email   = 'Your email is required.'
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
        status:      'unread',
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
    `w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors ${
      hasError ? 'border-red-400' : 'border-neutral-border'
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

                <a
                  href="https://maps.app.goo.gl/YyPHX8v6k5jDSPHs8?g_st=awb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-shadow group"
                >
                  <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors">
                    <MapPin size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-muted uppercase tracking-wide">Location</p>
                    <p className="font-heading font-semibold text-primary group-hover:text-accent transition-colors">
                      Bogeka Ward, Kenya
                    </p>
                    <p className="text-xs text-accent mt-0.5">Get Directions →</p>
                  </div>
                </a>

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
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors resize-none ${
                        errors.message ? 'border-red-400' : 'border-neutral-border'
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