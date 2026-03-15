import { useState, useEffect, useRef } from "react";

const ACCENT = "#E8491C";
const ACCENT2 = "#FF6B3D";
const BG = "#0A0A0A";
const SURFACE = "#111111";
const SURFACE2 = "#1A1A1A";
const TEXT = "#E0E0E0";
const MUTED = "#777777";
const DIM = "#444444";

const sections = ["home", "about", "services", "pricing", "process", "contact"];

function useInView(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const visible = useInView(ref);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: `all 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function Logo({ size = 28 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <svg width={size * 1.4} height={size * 1.4} viewBox="0 0 56 56">
        <rect x="4" y="4" width="48" height="48" rx="4" fill="none" stroke={ACCENT} strokeWidth="1.5"/>
        <text x="28" y="36" textAnchor="middle" fill={ACCENT} fontSize="28" fontWeight="900" fontFamily="'Orbitron', sans-serif">M</text>
        <line x1="52" y1="16" x2="62" y2="16" stroke={ACCENT2} strokeWidth="1"/><circle cx="62" cy="16" r="2" fill={ACCENT2}/>
        <line x1="52" y1="40" x2="62" y2="40" stroke={ACCENT2} strokeWidth="1"/><circle cx="62" cy="40" r="2" fill={ACCENT2}/>
        <line x1="4" y1="28" x2="-6" y2="28" stroke={ACCENT2} strokeWidth="1"/><circle cx="-6" cy="28" r="2" fill={ACCENT2}/>
      </svg>
      <div>
        <div style={{ fontSize: size * 0.7, fontWeight: 700, color: "#FFF", letterSpacing: 4, fontFamily: "'Orbitron', sans-serif", lineHeight: 1 }}>MARS</div>
        <div style={{ fontSize: size * 0.4, color: ACCENT, letterSpacing: 6, fontFamily: "'Rajdhani', sans-serif", fontWeight: 500, lineHeight: 1.2 }}>DESIGNS</div>
      </div>
    </div>
  );
}

function ThinLine({ width = "100%", opacity = 0.3 }) {
  return <div style={{ width, height: 1, background: ACCENT, opacity, margin: "0 auto" }} />;
}

function SectionTitle({ label, title, align = "center" }) {
  return (
    <div style={{ textAlign: align, marginBottom: 48 }}>
      <div style={{ fontSize: 11, color: ACCENT, letterSpacing: 6, fontFamily: "'Rajdhani', sans-serif", fontWeight: 300, marginBottom: 8, textTransform: "uppercase" }}>{label}</div>
      <h2 style={{ fontSize: 32, fontWeight: 700, color: "#FFF", margin: 0, fontFamily: "'Orbitron', sans-serif", letterSpacing: 2, lineHeight: 1.3 }}>{title}</h2>
      <div style={{ width: 60, height: 2, background: ACCENT, margin: align === "center" ? "16px auto 0" : "16px 0 0" }} />
    </div>
  );
}

export default function MARSDesignsWebsite() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {}, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const services = [
    { icon: "01", title: "AI Account Setup", desc: "Configure Claude, Grok, Gemini, and ChatGPT accounts with proper billing, team access, API keys, and security settings.", price: "Included in setup" },
    { icon: "02", title: "Hardware Config", desc: "Assess your current devices and recommend optimal hardware for AI workloads — tablets, laptops, networking.", price: "Included in setup" },
    { icon: "03", title: "Workflow Analysis", desc: "On-site or virtual observation of your core business processes. Time-and-motion analysis. Bottleneck identification and AI opportunity mapping.", price: "$500 - $1,500" },
    { icon: "04", title: "Custom AI Skills", desc: "Purpose-built Claude or OpenClaw skills with specialized prompts, tools, and knowledge bases specific to your business.", price: "$150 / skill" },
    { icon: "05", title: "Sandbox Testing", desc: "Dedicated testing environments where you experiment safely before going live. Break things without consequence.", price: "Included" },
    { icon: "06", title: "GitHub Repository", desc: "Full documentation, version control, and code management for all your AI configurations. You own everything we build.", price: "Included + maintained" },
  ];

  const pricingTiers = [
    { name: "LAUNCHPAD", price: "$4,000", period: "one-time", desc: "Get set up right from day one", features: ["AI account setup & configuration", "Hardware assessment & recommendations", "5 custom AI skills included", "Tool orientation & training", "Quick-start prompt library", "GitHub repository setup", "Sandbox testing environment", "30-day post-launch support"], highlight: false },
    { name: "RETAINER", price: "$458", period: "/month", desc: "Ongoing optimization & support", features: ["Monthly performance reviews", "Prompt & agent updates", "GitHub maintenance & backups", "Priority 24hr support", "1-2 new features per quarter", "Staff training as needed", "Monthly analytics report", "Workflow optimization"], highlight: true },
    { name: "CUSTOM BUILD", price: "$150 - $1,500", period: "per project", desc: "Expand your AI capabilities", features: ["New AI skills: $150 each", "New workflows: $500 - $1,500", "Integration architecture", "Custom agent development", "Sandbox testing included", "Full documentation", "Training on new systems", "90-day support window"], highlight: false },
  ];

  const processSteps = [
    { num: "01", title: "Discovery", desc: "Free 30-minute call. We listen first — understand your business, pain points, and goals." },
    { num: "02", title: "Proposal", desc: "Clear, plain-language proposal within 48 hours. No jargon, no mystery. You'll know exactly what you're getting." },
    { num: "03", title: "Assessment", desc: "Deep dive into your workflows. We find where AI saves the most time and money." },
    { num: "04", title: "Build", desc: "Configure accounts, build custom agents, create integrations. Everything tracked in your GitHub repo from day one." },
    { num: "05", title: "Test & Train", desc: "Sandbox first, production second. Hands-on training for you and your team until everyone's confident." },
    { num: "06", title: "Launch & Support", desc: "Go live. Full documentation handoff. You own everything. We're here when you need us." },
  ];

  const stats = [
    { value: "61", unit: "hrs/wk", label: "Average time saved" },
    { value: "8x", unit: "", label: "Return on investment" },
    { value: "80%", unit: "", label: "Admin task reduction" },
    { value: "90%", unit: "", label: "Below market pricing" },
  ];

  return (
    <div style={{ background: BG, color: TEXT, fontFamily: "'Rajdhani', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: `${BG}ee`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${ACCENT}15`, padding: "12px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ cursor: "pointer" }} onClick={() => scrollTo("home")}><Logo size={20} /></div>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {sections.map(s => (
              <span key={s} onClick={() => scrollTo(s)} style={{ fontSize: 12, letterSpacing: 3, cursor: "pointer", color: activeSection === s ? ACCENT : MUTED, textTransform: "uppercase", fontWeight: 500, transition: "color 0.3s" }}>{s}</span>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" style={{ minHeight: "90vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 20% 50%, ${ACCENT}08 0%, transparent 60%)` }} />
        <div style={{ position: "absolute", top: "10%", right: "5%", width: 400, height: 400, border: `1px solid ${ACCENT}10`, borderRadius: "50%", animation: "spin 60s linear infinite" }}>
          <div style={{ position: "absolute", top: -4, left: "50%", width: 8, height: 8, borderRadius: "50%", background: ACCENT, transform: "translateX(-50%)" }} />
        </div>
        <div style={{ position: "absolute", top: "25%", right: "12%", width: 250, height: 250, border: `1px solid ${ACCENT}08`, borderRadius: "50%" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <FadeIn>
            <div style={{ fontSize: 12, color: ACCENT, letterSpacing: 8, marginBottom: 24, fontWeight: 300 }}>HOUSTON, TEXAS</div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <h1 style={{ fontSize: 56, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: "#FFF", margin: "0 0 16px", lineHeight: 1.1, letterSpacing: 2, maxWidth: 700 }}>
              AI THAT WORKS<br/><span style={{ color: ACCENT }}>FOR YOUR BUSINESS</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p style={{ fontSize: 18, color: MUTED, maxWidth: 550, lineHeight: 1.7, margin: "0 0 40px", fontWeight: 300 }}>
              We bridge the gap between powerful AI tools and the small businesses that stand to gain the most from them. No jargon. No mystery. Just measurable results.
            </p>
          </FadeIn>
          <FadeIn delay={0.45}>
            <div style={{ display: "flex", gap: 16 }}>
              <button onClick={() => scrollTo("contact")} style={{ padding: "14px 36px", background: ACCENT, color: "#FFF", border: "none", fontSize: 13, letterSpacing: 3, cursor: "pointer", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, textTransform: "uppercase", transition: "all 0.3s" }}>Book a free call</button>
              <button onClick={() => scrollTo("services")} style={{ padding: "14px 36px", background: "transparent", color: ACCENT, border: `1px solid ${ACCENT}40`, fontSize: 13, letterSpacing: 3, cursor: "pointer", fontFamily: "'Rajdhani', sans-serif", fontWeight: 500, textTransform: "uppercase", transition: "all 0.3s" }}>View services</button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{ borderTop: `1px solid ${ACCENT}20`, borderBottom: `1px solid ${ACCENT}20`, padding: "40px 0", background: SURFACE }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {stats.map((s, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 40, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: "#FFF", lineHeight: 1 }}>{s.value}<span style={{ fontSize: 16, color: ACCENT }}>{s.unit}</span></div>
                <div style={{ fontSize: 12, color: MUTED, letterSpacing: 3, marginTop: 8, textTransform: "uppercase" }}>{s.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <FadeIn>
            <div>
              <SectionTitle label="Who we are" title="NOT ANOTHER TECH CONSULTANCY" align="left" />
              <p style={{ fontSize: 16, lineHeight: 1.8, color: TEXT, marginBottom: 20 }}>
                MARS Designs is a translator — taking the most transformative technology of the decade and making it accessible, practical, and profitable for the businesses that form the backbone of the Texas economy.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: MUTED, marginBottom: 32 }}>
                While 68% of U.S. small businesses report using AI, only about 10% have achieved real, production-level integration. That gap — between "I signed up for ChatGPT" and "AI is saving me 60 hours a month" — is where we live.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { title: "Clarity", desc: "Plain language. No jargon." },
                  { title: "Ownership", desc: "You own everything we build." },
                  { title: "Measurable", desc: "Every project tied to ROI." },
                  { title: "Integrity", desc: "We recommend what works." },
                ].map((v, i) => (
                  <div key={i} style={{ padding: 16, border: `1px solid ${ACCENT}15`, borderLeft: `2px solid ${ACCENT}` }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT, letterSpacing: 2, marginBottom: 4 }}>{v.title}</div>
                    <div style={{ fontSize: 13, color: MUTED }}>{v.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ position: "relative" }}>
              <div style={{ width: "100%", aspectRatio: "1", border: `1px solid ${ACCENT}20`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ position: "absolute", inset: 20, border: `1px solid ${ACCENT}10` }} />
                <div style={{ position: "absolute", inset: 40, border: `1px dashed ${ACCENT}08` }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 80, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: ACCENT, opacity: 0.15 }}>M</div>
                  <div style={{ fontSize: 11, letterSpacing: 6, color: MUTED, marginTop: -10 }}>EST. 2026</div>
                </div>
                <div style={{ position: "absolute", top: -1, left: -1, width: 20, height: 20, borderTop: `2px solid ${ACCENT}`, borderLeft: `2px solid ${ACCENT}` }} />
                <div style={{ position: "absolute", bottom: -1, right: -1, width: 20, height: 20, borderBottom: `2px solid ${ACCENT}`, borderRight: `2px solid ${ACCENT}` }} />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: "100px 24px", background: SURFACE }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionTitle label="What we do" title="SERVICES" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {services.map((s, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div style={{ padding: 28, background: BG, border: `1px solid ${ACCENT}12`, height: "100%", position: "relative", overflow: "hidden", transition: "border-color 0.3s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = `${ACCENT}40`}
                  onMouseLeave={e => e.currentTarget.style.borderColor = `${ACCENT}12`}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(90deg, ${ACCENT}, transparent)` }} />
                  <div style={{ fontSize: 32, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: `${ACCENT}20`, marginBottom: 12 }}>{s.icon}</div>
                  <h3 style={{ fontSize: 16, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: "#FFF", margin: "0 0 12px", letterSpacing: 1 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, margin: "0 0 16px" }}>{s.desc}</p>
                  <div style={{ fontSize: 12, color: ACCENT, letterSpacing: 2, fontWeight: 700 }}>{s.price}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <SectionTitle label="Investment" title="PRICING" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, alignItems: "stretch" }}>
          {pricingTiers.map((t, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div style={{
                padding: 32, background: t.highlight ? SURFACE2 : BG,
                border: `1px solid ${t.highlight ? ACCENT : ACCENT + "15"}`,
                position: "relative", display: "flex", flexDirection: "column", height: "100%"
              }}>
                {t.highlight && <div style={{ position: "absolute", top: -1, left: -1, right: -1, height: 3, background: ACCENT }} />}
                {t.highlight && <div style={{ position: "absolute", top: 12, right: 12, fontSize: 9, letterSpacing: 3, background: ACCENT, color: "#FFF", padding: "4px 10px", fontWeight: 700 }}>POPULAR</div>}
                <div style={{ fontSize: 11, letterSpacing: 4, color: ACCENT, marginBottom: 8, fontWeight: 700 }}>{t.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                  <span style={{ fontSize: 36, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: "#FFF" }}>{t.price}</span>
                  <span style={{ fontSize: 13, color: MUTED }}>{t.period}</span>
                </div>
                <p style={{ fontSize: 14, color: MUTED, marginBottom: 24, lineHeight: 1.5 }}>{t.desc}</p>
                <ThinLine opacity={0.15} />
                <div style={{ flex: 1, padding: "20px 0" }}>
                  {t.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12, fontSize: 13, color: TEXT }}>
                      <span style={{ color: ACCENT, fontSize: 10, marginTop: 3 }}>&#9656;</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => scrollTo("contact")} style={{
                  width: "100%", padding: "12px 0", fontSize: 12, letterSpacing: 3, cursor: "pointer",
                  fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, textTransform: "uppercase",
                  background: t.highlight ? ACCENT : "transparent",
                  color: t.highlight ? "#FFF" : ACCENT,
                  border: t.highlight ? "none" : `1px solid ${ACCENT}40`,
                  transition: "all 0.3s"
                }}>Get started</button>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.4}>
          <div style={{ textAlign: "center", marginTop: 40, padding: 24, border: `1px dashed ${ACCENT}20` }}>
            <div style={{ fontSize: 12, color: MUTED, letterSpacing: 2, marginBottom: 4 }}>MARKET RATE COMPARISON</div>
            <div style={{ fontSize: 14, color: TEXT }}>
              Setup: <span style={{ color: ACCENT, fontWeight: 700 }}>$4,000</span> <span style={{ color: DIM }}>(market: $5K-$15K)</span> &nbsp;&bull;&nbsp;
              Retainer: <span style={{ color: ACCENT, fontWeight: 700 }}>$458/mo</span> <span style={{ color: DIM }}>(market: $2K-$8K/mo)</span> &nbsp;&bull;&nbsp;
              Skills: <span style={{ color: ACCENT, fontWeight: 700 }}>$150/ea</span> <span style={{ color: DIM }}>(market: $1K-$5K)</span>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* PROCESS */}
      <section id="process" style={{ padding: "100px 24px", background: SURFACE }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionTitle label="How it works" title="OUR PROCESS" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {processSteps.map((s, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div style={{ padding: 24, position: "relative", borderLeft: `1px solid ${i === 0 ? ACCENT : ACCENT + "20"}` }}>
                  <div style={{ position: "absolute", left: -5, top: 24, width: 9, height: 9, background: i === 0 ? ACCENT : BG, border: `1px solid ${ACCENT}`, borderRadius: "50%" }} />
                  <div style={{ fontSize: 28, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: `${ACCENT}25`, marginBottom: 8 }}>{s.num}</div>
                  <h3 style={{ fontSize: 15, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: "#FFF", margin: "0 0 8px", letterSpacing: 1 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <SectionTitle label="Who we serve" title="INDUSTRIES" />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
          {["Salons & Spas", "Restaurants", "Boutiques", "Custom Furniture", "Home Decor", "Fitness Studios", "Dental / Medical", "Cleaning Services", "Real Estate", "Legal Practices", "Consulting Firms", "Retail Shops"].map((ind, i) => (
            <FadeIn key={i} delay={i * 0.04}>
              <div style={{ padding: "10px 24px", border: `1px solid ${ACCENT}20`, fontSize: 13, color: TEXT, letterSpacing: 2, transition: "all 0.3s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = ACCENT; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${ACCENT}20`; e.currentTarget.style.color = TEXT; }}>
                {ind}
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "100px 24px", background: SURFACE }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <SectionTitle label="Let's talk" title="START YOUR AI JOURNEY" />
          <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7, marginBottom: 40 }}>
            Book a free 30-minute discovery call. We'll listen first, understand your business, and show you exactly where AI can save you time and money.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <input placeholder="Your name" style={{ padding: "14px 16px", background: BG, border: `1px solid ${ACCENT}20`, color: TEXT, fontSize: 14, fontFamily: "'Rajdhani', sans-serif", outline: "none" }} />
            <input placeholder="Email address" style={{ padding: "14px 16px", background: BG, border: `1px solid ${ACCENT}20`, color: TEXT, fontSize: 14, fontFamily: "'Rajdhani', sans-serif", outline: "none" }} />
          </div>
          <input placeholder="Business name" style={{ width: "100%", padding: "14px 16px", background: BG, border: `1px solid ${ACCENT}20`, color: TEXT, fontSize: 14, fontFamily: "'Rajdhani', sans-serif", outline: "none", marginBottom: 16, boxSizing: "border-box" }} />
          <textarea placeholder="Tell us about your business and what you're hoping AI can help with..." rows={4} style={{ width: "100%", padding: "14px 16px", background: BG, border: `1px solid ${ACCENT}20`, color: TEXT, fontSize: 14, fontFamily: "'Rajdhani', sans-serif", outline: "none", resize: "vertical", marginBottom: 24, boxSizing: "border-box" }} />
          <button style={{ padding: "16px 48px", background: ACCENT, color: "#FFF", border: "none", fontSize: 14, letterSpacing: 4, cursor: "pointer", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, textTransform: "uppercase", transition: "all 0.3s", width: "100%" }}>
            BOOK FREE DISCOVERY CALL
          </button>
          <div style={{ marginTop: 32, display: "flex", justifyContent: "center", gap: 40 }}>
            <div>
              <div style={{ fontSize: 11, color: MUTED, letterSpacing: 3, marginBottom: 4 }}>EMAIL</div>
              <div style={{ fontSize: 14, color: ACCENT }}>marsdesigns458@gmail.com</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: MUTED, letterSpacing: 3, marginBottom: 4 }}>LOCATION</div>
              <div style={{ fontSize: 14, color: TEXT }}>Houston, Texas</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "40px 24px", borderTop: `1px solid ${ACCENT}15` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Logo size={14} />
          <div style={{ fontSize: 11, color: DIM, letterSpacing: 2 }}>&copy; 2026 MARS Designs LLC &bull; Houston, TX</div>
          <div style={{ fontSize: 11, color: DIM, letterSpacing: 2 }}>AI that works for your business.</div>
        </div>
      </footer>
    </div>
  );
}
