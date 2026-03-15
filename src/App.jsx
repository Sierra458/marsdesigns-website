import { useState, useEffect, useRef } from 'react'

/* ═══════════════════════════════════════════════
   MaRs Designs — Full Website
   ═══════════════════════════════════════════════ */

// ── Mars Logo SVG Component ──
function MarsLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 2 L58.8 17 L58.8 47 L32 62 L5.2 47 L5.2 17 Z" fill="none" stroke="#E8593C" strokeWidth="2"/>
      <circle cx="32" cy="32" r="16" fill="#E8593C"/>
      <path d="M22 28 Q27 25 32 29 Q37 33 42 27" fill="none" stroke="#C43E1A" strokeWidth="1.2" opacity="0.5"/>
      <circle cx="46" cy="18" r="3.5" fill="#FF7F5C" opacity="0.8"/>
      <circle cx="16" cy="46" r="2.5" fill="#FF7F5C" opacity="0.5"/>
    </svg>
  )
}

// ── Fade-in Observer Hook ──
function useFadeIn() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('visible')
        obs.unobserve(el)
      }
    }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function FadeIn({ children, className = '', delay = 0 }) {
  const ref = useFadeIn()
  return (
    <div ref={ref} className={`fade-in ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

// ── Star field for hero ──
function StarField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    delay: `${Math.random() * 5}s`,
    duration: `${Math.random() * 3 + 2}s`
  }))
  return (
    <div className="hero-stars">
      {stars.map(s => (
        <div key={s.id} className="hero-star" style={{
          left: s.left, top: s.top, width: s.size, height: s.size,
          animationDelay: s.delay, animationDuration: s.duration
        }} />
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════
// NAV
// ═══════════════════════════════════════════════
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#" className="nav-logo">
          <MarsLogo size={36} />
          <span className="nav-logo-text">MA<span>R</span>S</span>
        </a>
        <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Menu">
          <span /><span /><span />
        </button>
        <ul className={`nav-links ${open ? 'open' : ''}`}>
          {navItems.map(item => (
            <li key={item.label}>
              <a href={item.href} onClick={() => setOpen(false)}>{item.label}</a>
            </li>
          ))}
          <li>
            <a href="#contact" className="nav-cta" onClick={() => setOpen(false)}>Get Started</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

// ═══════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════
function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg" />
      <StarField />
      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            AI-Powered Design Studio
          </div>
          <h1>
            We Build<br/>
            <span className="highlight">Digital Worlds</span><br/>
            That Convert
          </h1>
          <p className="hero-desc">
            MaRs Designs fuses cutting-edge AI with bold creative vision to deliver
            websites, brands, and digital experiences that launch businesses into orbit.
          </p>
          <div className="hero-buttons">
            <a href="#contact" className="btn-primary">Book Discovery Call</a>
            <a href="#services" className="btn-outline">Our Services</a>
          </div>
        </div>
        <div className="hero-orbit-wrap">
          <div className="orbit-ring orbit-ring-1">
            <div className="orbit-planet orbit-planet-1" />
          </div>
          <div className="orbit-ring orbit-ring-2">
            <div className="orbit-planet orbit-planet-2" />
          </div>
          <div className="orbit-ring orbit-ring-3">
            <div className="orbit-planet orbit-planet-3" />
          </div>
          <div className="orbit-center">
            <MarsLogo size={120} />
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════
// STATS
// ═══════════════════════════════════════════════
function Stats() {
  const stats = [
    { num: '50+', label: 'Projects Launched' },
    { num: '98%', label: 'Client Satisfaction' },
    { num: '3x', label: 'Avg ROI Increase' },
    { num: '24hr', label: 'Response Time' },
  ]
  return (
    <section className="stats-bar">
      <div className="stats-grid">
        {stats.map((s, i) => (
          <FadeIn key={i} delay={i * 100}>
            <div className="stat-item">
              <h3>{s.num}</h3>
              <p>{s.label}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════
// ABOUT
// ═══════════════════════════════════════════════
function About() {
  const icons = ['🚀', '🎨', '🤖', '📊', '💡', '⚡', '🔧', '🌐', '📱']
  return (
    <section className="section" id="about">
      <div className="container">
        <FadeIn>
          <div className="about-grid">
            <div className="about-visual">
              <div className="about-hex-grid">
                {icons.map((icon, i) => (
                  <div key={i} className="about-hex">{icon}</div>
                ))}
              </div>
            </div>
            <div>
              <span className="section-label">About Us</span>
              <h2 className="section-title">Where AI Meets<br/>Creative Vision</h2>
              <p className="section-subtitle">
                We're not just another design agency. MaRs Designs leverages artificial intelligence
                to accelerate every phase of the creative process — from research to deployment.
              </p>
              <h3 className="about-text">
                <h3>AI-Accelerated Workflow</h3>
                <p>We use AI tools like Claude, Midjourney, and custom automation to cut project timelines
                by 60% while maintaining hand-crafted quality.</p>
              </h3>
              <div className="about-text">
                <h3>Full-Stack Execution</h3>
                <p>From brand strategy and UI/UX design to full-stack development and deployment,
                we handle every layer of your digital presence.</p>
              </div>
              <div className="about-text">
                <h3>Results-Driven</h3>
                <p>Every pixel serves a purpose. We build to convert — tracking performance
                metrics and iterating for maximum business impact.</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════
function Services() {
  const services = [
    {
      icon: '🌐',
      title: 'Web Design & Development',
      desc: 'Custom React/Next.js sites with stunning UI, buttery animations, and mobile-first responsive design.',
      tags: ['React', 'Next.js', 'Vite', 'Tailwind']
    },
    {
      icon: '🎨',
      title: 'Branding & Identity',
      desc: 'Logos, color systems, typography, and brand guidelines that make your business instantly recognizable.',
      tags: ['Logo Design', 'Brand Book', 'Style Guide']
    },
    {
      icon: '🤖',
      title: 'AI Integration',
      desc: 'Chatbots, AI-powered content, automated workflows, and intelligent features built into your products.',
      tags: ['Claude API', 'Automation', 'Chatbots']
    },
    {
      icon: '📊',
      title: 'Dashboard & Data Viz',
      desc: 'Interactive analytics dashboards, admin panels, and data visualization tools that make insights clear.',
      tags: ['Charts', 'Analytics', 'Admin Panels']
    },
    {
      icon: '📱',
      title: 'Mobile & PWA',
      desc: 'Progressive web apps and mobile-optimized experiences that work flawlessly on any device.',
      tags: ['PWA', 'Responsive', 'Cross-Platform']
    },
    {
      icon: '⚡',
      title: 'Performance & SEO',
      desc: 'Speed optimization, Core Web Vitals tuning, and search engine optimization for maximum visibility.',
      tags: ['Lighthouse', 'SEO', 'Speed']
    },
  ]

  return (
    <section className="section" id="services">
      <div className="container">
        <FadeIn>
          <span className="section-label">What We Do</span>
          <h2 className="section-title">Services Built for Growth</h2>
          <p className="section-subtitle">
            End-to-end digital solutions — from pixel-perfect design to production deployment.
          </p>
        </FadeIn>
        <div className="services-grid">
          {services.map((s, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div className="service-card">
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="service-tags">
                  {s.tags.map(t => <span key={t} className="service-tag">{t}</span>)}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════
// PRICING
// ═══════════════════════════════════════════════
function Pricing() {
  const plans = [
    {
      tier: 'Launch Pad',
      price: '$2,500',
      period: 'Starting at',
      features: ['5-Page Custom Website', 'Mobile Responsive', 'Basic SEO Setup', 'Contact Form Integration', '2 Rounds of Revisions', '1 Month Support'],
      featured: false,
      cta: 'Get Started'
    },
    {
      tier: 'Orbit',
      price: '$5,000',
      period: 'Starting at',
      features: ['10+ Page Website or App', 'Custom Animations', 'AI Chatbot Integration', 'Advanced SEO & Analytics', 'Brand Identity Package', '3 Months Support'],
      featured: true,
      cta: 'Most Popular'
    },
    {
      tier: 'Mission Control',
      price: 'Custom',
      period: 'Enterprise',
      features: ['Full-Stack Development', 'AI Workflow Automation', 'Dashboard & Admin Panel', 'API Integrations', 'Dedicated Project Manager', 'Ongoing Retainer'],
      featured: false,
      cta: 'Contact Us'
    },
  ]

  return (
    <section className="section" id="pricing">
      <div className="container">
        <FadeIn>
          <span className="section-label">Pricing</span>
          <h2 className="section-title">Investment Tiers</h2>
          <p className="section-subtitle">
            Transparent pricing. No hidden fees. Every project includes strategy, design, and development.
          </p>
        </FadeIn>
        <div className="pricing-grid">
          {plans.map((p, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className={`price-card ${p.featured ? 'featured' : ''}`}>
                <div className="price-tier">{p.tier}</div>
                <div className="price-amount">{p.price}</div>
                <div className="price-period">{p.period}</div>
                <ul className="price-features">
                  {p.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <a href="#contact" className={p.featured ? 'btn-primary' : 'btn-outline'}>
                  {p.cta}
                </a>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════
// PROCESS
// ═══════════════════════════════════════════════
function Process() {
  const steps = [
    { num: '01', title: 'Discovery', desc: 'We learn your business, goals, audience, and competitive landscape through a focused strategy call.' },
    { num: '02', title: 'Design', desc: 'Wireframes, mockups, and interactive prototypes — you see and approve everything before code is written.' },
    { num: '03', title: 'Develop', desc: 'Clean, production-grade code. AI-accelerated development with human-reviewed quality at every step.' },
    { num: '04', title: 'Deploy & Grow', desc: 'We launch, monitor performance, and iterate. Your site evolves as your business scales.' },
  ]
  return (
    <section className="section" id="process">
      <div className="container">
        <FadeIn>
          <span className="section-label">How We Work</span>
          <h2 className="section-title">Our Launch Sequence</h2>
          <p className="section-subtitle">
            A proven 4-step process from idea to live product.
          </p>
        </FadeIn>
        <div className="process-steps">
          {steps.map((s, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="process-step">
                <div className="step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════
// INDUSTRIES
// ═══════════════════════════════════════════════
function Industries() {
  const tags = [
    'HR & Consulting', 'Healthcare', 'Legal', 'Real Estate',
    'E-Commerce', 'SaaS & Tech', 'Education', 'Finance',
    'Restaurants & Hospitality', 'Construction', 'Nonprofits', 'Fitness & Wellness'
  ]
  return (
    <section className="section" id="industries">
      <div className="container">
        <FadeIn>
          <span className="section-label">Industries</span>
          <h2 className="section-title">Who We Work With</h2>
          <p className="section-subtitle">
            From local businesses to enterprise clients, we tailor solutions to your industry.
          </p>
        </FadeIn>
        <FadeIn delay={200}>
          <div className="industries-wrap">
            {tags.map(t => <span key={t} className="industry-tag">{t}</span>)}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════
// CONTACT
// ═══════════════════════════════════════════════
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', business: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle, sending, success, error

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.message.trim()) e.message = 'Message is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')
    try {
      // Replace YOUR_SCRIPT_ID with your Google Apps Script deployment URL
      const SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, timestamp: new Date().toISOString() })
      })
      setStatus('success')
      setForm({ name: '', email: '', business: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <section className="section" id="contact">
      <div className="container">
        <FadeIn>
          <span className="section-label">Get In Touch</span>
          <h2 className="section-title">Ready to Launch?</h2>
        </FadeIn>
        <div className="contact-grid">
          <FadeIn delay={100}>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => { setForm({...form, name: e.target.value}); setErrors({...errors, name: ''}) }}
                  className={errors.name ? 'error' : ''}
                  placeholder="John Doe"
                />
                {errors.name && <span className="form-error show">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => { setForm({...form, email: e.target.value}); setErrors({...errors, email: ''}) }}
                  className={errors.email ? 'error' : ''}
                  placeholder="john@company.com"
                />
                {errors.email && <span className="form-error show">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label>Business / Company</label>
                <input
                  type="text"
                  value={form.business}
                  onChange={e => setForm({...form, business: e.target.value})}
                  placeholder="Company Inc."
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={e => { setForm({...form, message: e.target.value}); setErrors({...errors, message: ''}) }}
                  className={errors.message ? 'error' : ''}
                  placeholder="Tell us about your project..."
                />
                {errors.message && <span className="form-error show">{errors.message}</span>}
              </div>
              <button type="submit" className="btn-primary" disabled={status === 'sending'}>
                {status === 'sending' ? 'Transmitting...' :
                 status === 'success' ? 'Message Received!' :
                 status === 'error' ? 'Error — Try Again' :
                 'Book Free Discovery Call'}
              </button>
              {status === 'success' && (
                <div className="form-success show">
                  ✦ Transmission received — we'll respond within 24 hours.
                </div>
              )}
            </form>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="contact-info">
              <h3>Let's Build Something Extraordinary</h3>
              <p>
                Whether you need a full website, a brand refresh, or AI integration —
                we're ready to make it happen. Book a free discovery call and let's talk strategy.
              </p>
              <div className="contact-detail">
                <div className="contact-detail-icon">📧</div>
                <span>hello@marsdesigns.io</span>
              </div>
              <div className="contact-detail">
                <div className="contact-detail-icon">📍</div>
                <span>South Texas, USA</span>
              </div>
              <div className="contact-detail">
                <div className="contact-detail-icon">⏱</div>
                <span>Response within 24 hours</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo">
              <MarsLogo size={32} />
              <span className="nav-logo-text">MA<span style={{color:'var(--mars-red)'}}>R</span>S</span>
            </div>
            <p>AI-powered design studio building digital experiences that launch businesses into orbit.</p>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <a href="#services">Web Design</a>
            <a href="#services">Branding</a>
            <a href="#services">AI Integration</a>
            <a href="#services">Dashboards</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#about">About</a>
            <a href="#process">Process</a>
            <a href="#pricing">Pricing</a>
            <a href="#industries">Industries</a>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <a href="#contact">Contact Us</a>
            <a href="mailto:hello@marsdesigns.io">Email</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} MaRs Designs. All rights reserved.</span>
          <span>Designed & built with AI + human craft</span>
        </div>
      </div>
    </footer>
  )
}

// ═══════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════
export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Stats />
      <About />
      <Services />
      <Pricing />
      <Process />
      <Industries />
      <Contact />
      <Footer />
    </>
  )
}
