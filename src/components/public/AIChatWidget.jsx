// src/components/public/AIChatWidget.jsx
// Rule-based campaign AI assistant for Fred Maisiba Marungu.
// Matches user input against a knowledge base and returns relevant answers.
// Sits as a floating bubble bottom-right on every public page.

import { Bot, ChevronDown, MessageCircle, Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// ─── Knowledge Base ──────────────────────────────────────────────────────────
// Each entry has: keywords (array of strings to match against),
// answer (string or JSX-returning function), and optional link.
const knowledgeBase = [
    // Candidate / General
    {
        keywords: ['who', 'fred', 'maisiba', 'marungu', 'candidate', 'about', 'background'],
        answer: `Fred Maisiba Marungu is the candidate for Bogeka Ward MCA. He is a community-focused leader with a proven track record of delivering real projects for the people of Bogeka Ward. His campaign slogan is "Chinsiaga" — meaning together we move forward.`,
        link: { label: 'Learn more about Fred', to: '/about' },
    },
    // Slogan
    {
        keywords: ['chinsiaga', 'slogan', 'motto', 'meaning'],
        answer: `"Chinsiaga" is Fred Maisiba's campaign slogan. It reflects the spirit of unity and collective progress — together, the people of Bogeka Ward can move forward and build a stronger community.`,
    },
    // Position / Ward
    {
        keywords: ['ward', 'bogeka', 'mca', 'position', 'running', 'election'],
        answer: `Fred Maisiba Marungu is running for the position of Member of County Assembly (MCA) for Bogeka Ward. He is committed to representing every village and resident of Bogeka Ward with transparency and accountability.`,
    },
    // Vision & Mission
    {
        keywords: ['vision', 'mission', 'plan', 'goal', 'future', 'agenda'],
        answer: `Fred's vision is a stronger, more prosperous Bogeka Ward built on six key priorities: Education, Healthcare, Youth Empowerment, Infrastructure, Agriculture, and Digital Transformation. Every decision is guided by the needs of the Bogeka community.`,
        link: { label: 'Read our Vision & Mission', to: '/vision-mission' },
    },
    // Manifesto
    {
        keywords: ['manifesto', 'policy', 'policies', 'promise', 'commitment', 'pledge'],
        answer: `Fred Maisiba's manifesto covers 10 key areas including Education, Healthcare, Economy & Jobs, Infrastructure, Agriculture, Youth & Sports, Women & Family, Security, Environment, and Governance. Each policy is grounded in real community needs.`,
        link: { label: 'Read the Full Manifesto', to: '/manifesto' },
    },
    // Education
    {
        keywords: ['education', 'school', 'student', 'learning', 'classroom', 'scholarship'],
        answer: `Education is a top priority. Fred's plan includes investing in schools, supporting scholarships, and ensuring every child in Bogeka Ward has access to quality learning resources and modern classroom facilities.`,
        link: { label: 'View Education Projects', to: '/projects' },
    },
    // Healthcare
    {
        keywords: ['health', 'healthcare', 'hospital', 'clinic', 'medical', 'doctor'],
        answer: `Fred is committed to improving access to quality, affordable healthcare across every village in Bogeka Ward — including upgrading health facilities, increasing staffing, and reducing the cost burden on families.`,
        link: { label: 'View Healthcare Projects', to: '/projects' },
    },
    // Youth
    {
        keywords: ['youth', 'young', 'empowerment', 'job', 'employment', 'opportunity', 'sport'],
        answer: `Youth Empowerment is central to Fred's agenda. The plan creates skills training, mentorship programmes, and economic opportunities so young people in Bogeka have a future worth staying for.`,
    },
    // Infrastructure
    {
        keywords: ['road', 'infrastructure', 'water', 'bridge', 'building', 'construction'],
        answer: `Fred has already delivered infrastructure projects in Bogeka Ward and plans to expand — building and maintaining roads, clean water systems, and public facilities that connect and serve all communities.`,
        link: { label: 'See Our Projects', to: '/projects' },
    },
    // Agriculture
    {
        keywords: ['agriculture', 'farming', 'farmer', 'crop', 'food', 'livestock'],
        answer: `Fred's agricultural plan supports local farmers with resources, training, better market access, and modern farming techniques to strengthen food security and improve livelihoods across Bogeka Ward.`,
    },
    // Digital
    {
        keywords: ['digital', 'internet', 'technology', 'tech', 'wifi', 'connectivity', 'online'],
        answer: `Fred plans to bring connectivity and digital literacy to Bogeka Ward — ensuring our community can access e-government services, digital markets, and online education to compete in the modern economy.`,
    },
    // Projects
    {
        keywords: ['project', 'completed', 'built', 'delivered', 'achievement', 'done', 'community work'],
        answer: `Fred Maisiba has a proven track record of completed community projects across Bogeka Ward — including schools, clinics, roads, water systems, and youth programmes. These are real, tangible deliveries — not just promises.`,
        link: { label: 'View All Projects', to: '/projects' },
    },
    // Gallery
    {
        keywords: ['photo', 'picture', 'image', 'gallery', 'see', 'visual'],
        answer: `You can see photos from Fred's community projects and campaign activities in the Projects Gallery. It's a visual record of the real work done across Bogeka Ward.`,
        link: { label: 'Open Gallery', to: '/gallery' },
    },
    // News & Events
    {
        keywords: ['news', 'event', 'rally', 'meeting', 'latest', 'update', 'upcoming', 'calendar'],
        answer: `Stay up to date with the latest campaign news, press releases, and upcoming events — including community meetings, rallies, and ward visits — all on the News & Events page.`,
        link: { label: 'See News & Events', to: '/news' },
    },
    // Volunteer
    {
        keywords: ['volunteer', 'help', 'join', 'support', 'involved', 'campaign', 'team', 'canvass'],
        answer: `You can volunteer for the Fred Maisiba campaign in many ways — door-to-door canvassing, social media, event support, youth mobilisation, and more. Sign up and the team will contact you within 48 hours.`,
        link: { label: 'Register as Volunteer', to: '/volunteer' },
    },
    // Contact
    {
        keywords: ['contact', 'reach', 'call', 'phone', 'email', 'message', 'talk', 'office'],
        answer: `You can reach the Fred Maisiba campaign team at:\n📞 +254 719 562 294\n✉️ fmarungu2011@gmail.com\n📍 Bogeka Ward, Kenya\nOffice hours: Mon–Fri, 8am–6pm`,
        link: { label: 'Send a Message', to: '/contact' },
    },
    // Donate / Support
    {
        keywords: ['donate', 'donation', 'fund', 'money', 'contribution', 'support financially'],
        answer: `To support the Fred Maisiba campaign financially, please reach out directly via the Contact page or call +254 719 562 294. The team will guide you on how to contribute.`,
        link: { label: 'Contact the Campaign', to: '/contact' },
    },
    // Testimonials
    {
        keywords: ['testimonial', 'review', 'community says', 'people say', 'feedback', 'opinion'],
        answer: `Community members across Bogeka Ward have shared their experiences with Fred's leadership and the impact of his projects. Check the homepage testimonials section to hear directly from residents.`,
        link: { label: 'Visit Homepage', to: '/' },
    },
    // Greeting
    {
        keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'hola', 'greetings'],
        answer: `Hello! 👋 I'm here to help you learn more about Fred Maisiba Marungu's campaign for Bogeka Ward MCA. Ask me anything — about Fred, our projects, the manifesto, events, or how to get involved!`,
    },
    // Thank you
    {
        keywords: ['thank', 'thanks', 'appreciate', 'helpful'],
        answer: `You're very welcome! 😊 If you have any more questions about the Fred Maisiba campaign, feel free to ask. Together — Chinsiaga! 🙏`,
    },
]

// ─── Matcher ─────────────────────────────────────────────────────────────────
function findAnswer(input) {
    const lower = input.toLowerCase().trim()
    if (!lower) return null

    let bestMatch = null
    let bestScore = 0

    for (const entry of knowledgeBase) {
        const score = entry.keywords.filter(kw => lower.includes(kw)).length
        if (score > bestScore) {
            bestScore = score
            bestMatch = entry
        }
    }

    if (bestScore === 0) return null
    return bestMatch
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
    const isBot = msg.from === 'bot'
    return (
        <div className={`flex gap-2 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
            {isBot && (
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot size={14} className="text-white" />
                </div>
            )}
            <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isBot
                    ? 'bg-neutral-bg text-neutral-dark rounded-tl-none'
                    : 'bg-secondary text-white rounded-tr-none'
                    }`}
            >
                <p className="whitespace-pre-line">{msg.text}</p>
                {msg.link && (
                    <Link
                        to={msg.link.to}
                        className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-accent hover:text-accent-dark transition-colors"
                    >
                        {msg.link.label} →
                    </Link>
                )}
            </div>
        </div>
    )
}

// ─── Quick reply suggestions ──────────────────────────────────────────────────
const quickReplies = [
    'Who is Fred Maisiba?',
    'What projects have been completed?',
    'How do I volunteer?',
    'What is the manifesto?',
    'Upcoming events?',
    'How do I contact the campaign?',
]

// ─── Main widget ──────────────────────────────────────────────────────────────
export default function AIChatWidget() {
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([
        {
            id: 0,
            from: 'bot',
            text: 'Mambo! 👋 I\'m Chinsiaga — Fred Maisiba\'s campaign assistant for Bogeka Ward.\n\nAsk me anything about Fred, our projects, the manifesto, upcoming events, or how to get involved!',
        },
    ])
    const [typing, setTyping] = useState(false)
    const [unread, setUnread] = useState(0)
    const bodyRef = useRef(null)
    const inputRef = useRef(null)

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight
        }
    }, [messages, typing])

    // Focus input when chat opens
    useEffect(() => {
        if (open && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 200)
            setUnread(0)
        }
    }, [open])

    function addMessage(from, text, link = null) {
        setMessages(prev => [
            ...prev,
            { id: Date.now() + Math.random(), from, text, link },
        ])
    }

    function handleSend(text) {
        const query = (text || input).trim()
        if (!query) return
        setInput('')

        addMessage('user', query)
        setTyping(true)

        setTimeout(() => {
            setTyping(false)
            const match = findAnswer(query)

            if (match) {
                addMessage('bot', match.answer, match.link || null)
            } else {
                addMessage(
                    'bot',
                    `I'm not sure about that yet — but the Fred Maisiba campaign team can help!\n\n📞 +254 719 562 294\n✉️ fmarungu2011@gmail.com`,
                    { label: 'Send a Message', to: '/contact' }
                )
            }

            if (!open) setUnread(prev => prev + 1)
        }, 800)
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="fixed bottom-5 right-5 z-[200] flex flex-col items-end gap-3">

            {/* ── Chat panel ─────────────────────────────────────── */}
            {open && (
                <div className="w-[340px] sm:w-[380px] max-h-[70vh] bg-white rounded-3xl shadow-float flex flex-col overflow-hidden border border-neutral-border animate-slide-up">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-secondary px-4 py-3.5 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md">
                                <Bot size={18} className="text-secondary" />
                            </div>
                            <div>
                                <p className="font-heading font-bold text-white text-sm">Chinsiaga Assistant</p>
                                <p className="text-[10px] text-white/70">Fred Maisiba Campaign · Bogeka Ward</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                            <span className="text-[10px] text-white/70 mr-1">Online</span>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                                aria-label="Close chat"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages body */}
                    <div
                        ref={bodyRef}
                        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[200px] max-h-[360px]"
                    >
                        {messages.map(msg => (
                            <MessageBubble key={msg.id} msg={msg} />
                        ))}

                        {/* Typing indicator */}
                        {typing && (
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                    <Bot size={14} className="text-white" />
                                </div>
                                <div className="bg-neutral-bg rounded-2xl rounded-tl-none px-4 py-3 flex gap-1.5 items-center">
                                    <span className="w-1.5 h-1.5 bg-neutral-muted rounded-full animate-bounce [animation-delay:0ms]" />
                                    <span className="w-1.5 h-1.5 bg-neutral-muted rounded-full animate-bounce [animation-delay:150ms]" />
                                    <span className="w-1.5 h-1.5 bg-neutral-muted rounded-full animate-bounce [animation-delay:300ms]" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick replies */}
                    {messages.length <= 1 && (
                        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                            {quickReplies.map(qr => (
                                <button
                                    key={qr}
                                    onClick={() => handleSend(qr)}
                                    className="text-[11px] px-3 py-1.5 bg-neutral-bg border border-neutral-border text-neutral-dark rounded-full hover:border-secondary hover:text-secondary transition-colors duration-150 font-medium"
                                >
                                    {qr}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input bar */}
                    <div className="px-4 pb-4 flex-shrink-0">
                        <div className="flex items-center gap-2 bg-neutral-bg rounded-2xl border border-neutral-border focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20 transition-all duration-200 px-4 py-2.5">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about Fred's campaign..."
                                className="flex-1 bg-transparent text-sm text-neutral-dark placeholder-neutral-muted focus:outline-none"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim()}
                                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white hover:bg-secondary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                                aria-label="Send message"
                            >
                                <Send size={14} />
                            </button>
                        </div>
                        <p className="text-[10px] text-neutral-muted text-center mt-1.5">
                            Powered by the Chinsiaga Campaign
                        </p>
                    </div>

                </div>
            )}

            {/* ── Floating trigger button ─────────────────────────── */}
            <button
                onClick={() => setOpen(v => !v)}
                aria-label={open ? 'Close chat assistant' : 'Open campaign assistant'}
                aria-expanded={open}
                className="relative w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-primary shadow-float flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200"
            >
                {open ? (
                    <ChevronDown size={24} className="text-white" />
                ) : (
                    <MessageCircle size={24} className="text-white" />
                )}

                {/* Pulse ring animation when closed */}
                {!open && (
                    <span className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-20" />
                )}

                {/* Unread badge */}
                {!open && unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                        {unread}
                    </span>
                )}
            </button>

        </div>
    )
}