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
      <svg width={size * 1.3} height={size * 1.3} viewBox="0 0 64 64">
        <path d="M32 2 L58.8 17 L58.8 47 L32 62 L5.2 47 L5.2 17 Z" fill="none" stroke={ACCENT} strokeWidth="2.2"/>
        <path d="M32 2 L58.8 17 L58.8 47 L32 62 L5.2 47 L5.2 17 Z" fill={ACCENT} opacity="0.05"/>
        <path d="M32 6 L55.6 19.5 L55.6 44.5 L32 58 L8.4 44.5 L8.4 19.5 Z" fill="none" stroke={ACCENT} strokeWidth="0.5" opacity="0.3"/>
        <circle cx="32" cy="32" r="14" fill={ACCENT}/>
        <circle cx="32" cy="32" r="14" fill="none" stroke={ACCENT2} strokeWidth="0.5"/>
        <path d="M24 29 Q28 26 32 30 Q36 34 40 28" fill="none" stroke="#C43E1A" strokeWidth="0.9" opacity="0.5"/>
        <path d="M26 35 Q30 33 34 36" fill="none" stroke="#C43E1A" strokeWidth="0.6" opacity="0.35"/>
        <circle cx="44" cy="18" r="3" fill={ACCENT2} opacity="0.7"/>
        <circle cx="18" cy="46" r="2" fill={ACCENT2} opacity="0.4"/>
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

function Tag({ children }) {
  return <span style={{ display: "inline-block", padding: "3px 10px", border: `1px solid ${ACCENT}12`, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: DIM, marginRight: 4, marginTop: 4 }}>{children}</span>;
}

export default function MARSDesignsWebsite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", business: "", message: "" });
  const [formStatus, setFormStatus] = useState("idle");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;700&family=Exo+2:wght@300;400;500;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if (privacyOpen) { document.body.style.overflow = "hidden"; } else { document.body.style.overflow = ""; }
  }, [privacyOpen]);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const { name, email, message } = formState;
    if (!name.trim() || !email.trim() || !message.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setFormError("Please fill in your name, a valid email, and a message.");
      return;
    }
    setFormStatus("sending");
    try {
      await fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formState, timestamp: new Date().toISOString() })
      });
      setFormStatus("success");
      setFormState({ name: "", email: "", business: "", message: "" });
      setTimeout(() => setFormStatus("idle"), 5000);
    } catch {
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 4000);
    }
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
    { name: "LAUNCHPAD", price: "$2,000 - $5,000", period: "one-time", desc: "Get set up right from day one", features: ["AI account setup & configuration", "Hardware assessment & recommendations", "5 custom AI skills included", "Tool orientation & training", "Quick-start prompt library", "GitHub repository setup", "Sandbox testing environment", "30-day post-launch support"], highlight: false },
    { name: "RETAINER", price: "$458", period: "/month", desc: "Ongoing optimization, AEO & support", features: ["Monthly performance reviews", "Prompt & agent updates", "AEO monitoring & citation reports", "GitHub maintenance & backups", "Priority 24hr support", "1-2 new features per quarter", "Staff training as needed", "Workflow optimization"], highlight: true },
    { name: "AGENTS & AEO", price: "$500+", period: "per project", desc: "Custom agents, multi-agent systems & AI visibility", features: ["Custom AI agents: $500 - $2,500 each", "Multi-agent A2A systems: $2,500 - $5,000", "AEO strategy & setup: $1,500 - $3,000", "Agent-to-agent architecture design", "Full sandbox testing & deployment", "Answer engine content optimization", "AI citation tracking setup", "90-day support window"], highlight: false },
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

  const agentTypes = [
    { title: "Intake Agent", desc: "Captures leads, qualifies, routes" },
    { title: "Scheduling Agent", desc: "Books meetings, sends reminders" },
    { title: "Support Agent", desc: "Answers FAQs, escalates edge cases" },
    { title: "Reporting Agent", desc: "Daily summaries, KPI dashboards" },
  ];

  const agentFeatures = ["Custom agent architecture & design", "Business knowledge base integration", "Tool connections (CRM, calendar, email)", "Guardrails & safety testing", "Sandbox deployment before going live", "Full documentation in your GitHub repo", "Hands-on training for your team", "90-day post-deployment support"];

  const a2aCards = [
    { num: "01", title: "Discovery", desc: 'Agents publish "Agent Cards" — machine-readable profiles that let other agents find and understand what they do. No manual wiring.', tags: ["Agent Cards", "Auto-Discovery"] },
    { num: "02", title: "Delegation", desc: "When one agent encounters a task outside its scope, it automatically delegates to the right specialist agent via A2A.", tags: ["Task Routing", "Google A2A"] },
    { num: "03", title: "Coordination", desc: "Agents exchange context and status in real-time. Your entire workflow runs end-to-end without a human shepherding each step.", tags: ["Real-Time Sync", "MCP + A2A"] },
  ];

  const a2aFlow = [
    { name: "INTAKE AGENT", sub: "Lead capture" },
    { name: "ORCHESTRATOR", sub: "A2A Protocol", highlight: true },
    { name: "CRM AGENT", sub: "Data sync" },
    { name: "FOLLOW-UP AGENT", sub: "Email & SMS" },
  ];

  const aeoCards = [
    { num: "01", title: "Structured Content", desc: "We restructure your website so AI engines can extract and cite it — FAQ schema, answer blocks, entity markup, and concise formatting.", price: "Schema + Content Audit" },
    { num: "02", title: "AI Citation Strategy", desc: "Optimize for the RAG pipelines powering ChatGPT, Perplexity, and Google AI Overviews. We target the prompts your customers actually type.", price: "Prompt-Matched Optimization" },
    { num: "03", title: "Monitoring & Iteration", desc: "Track your brand's AI citation rate across platforms. Monthly reports showing where you appear, where you don't, and what we're doing about it.", price: "Monthly AEO Reports" },
  ];

  const aeoStats = [
    { value: "25%", label: "Of search shifting to AI by 2026" },
    { value: "60%", label: "Of Google searches end zero-click" },
    { value: "800M+", label: "Weekly ChatGPT users" },
  ];

  const industries = ["Salons & Spas", "Restaurants", "Boutiques", "Custom Furniture", "Home Decor", "Fitness Studios", "Dental / Medical", "Cleaning Services", "Real Estate", "Legal Practices", "Consulting Firms", "Retail Shops"];

  const inputStyle = { padding: "14px 16px", background: BG, border: `1px solid ${ACCENT}12`, color: TEXT, fontSize: 14, fontFamily: "'Rajdhani', sans-serif", outline: "none" };

  return (
    <div style={{ background: BG, color: TEXT, fontFamily: "'Rajdhani', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: `${BG}ee`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${ACCENT}08`, padding: "12px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ cursor: "pointer" }} onClick={() => scrollTo("home")}><Logo size={20} /></div>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {sections.map(s => (
              <span key={s} onClick={() => scrollTo(s)} style={{ fontSize: 12, letterSpacing: 3, cursor: "pointer", color: MUTED, textTransform: "uppercase", fontWeight: 500, transition: "color 0.3s" }}>{s}</span>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" style={{ minHeight: "90vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 20% 50%, ${ACCENT}05 0%, transparent 60%)` }} />
        <div style={{ position: "absolute", top: "10%", right: "5%", width: 400, height: 400, border: `1px solid ${ACCENT}08`, borderRadius: "50%", animation: "spin 60s linear infinite" }}>
          <div style={{ position: "absolute", top: -4, left: "50%", width: 8, height: 8, borderRadius: "50%", background: ACCENT, transform: "translateX(-50%)" }} />
        </div>
        <div style={{ position: "absolute", top: "25%", right: "12%", width: 250, height: 250, border: `1px solid ${ACCENT}06`, borderRadius: "50%" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <FadeIn><div style={{ fontSize: 12, color: ACCENT, letterSpacing: 8, marginBottom: 24, fontWeight: 300 }}>BASED IN TEXAS. AVAILABLE EVERYWHERE.</div></FadeIn>
          <FadeIn delay={0.15}><h1 style={{ fontSize: 56, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: "#FFF", margin: "0 0 16px", lineHeight: 1.1, letterSpacing: 2, maxWidth: 700 }}>AI THAT WORKS<br/><span style={{ color: ACCENT }}>FOR YOUR BUSINESS</span></h1></FadeIn>
          <FadeIn delay={0.3}><p style={{ fontSize: 18, color: MUTED, maxWidth: 550, lineHeight: 1.7, margin: "0 0 40px", fontWeight: 300 }}>We bridge the gap between powerful AI tools and the small businesses that stand to gain the most from them. No jargon. No mystery. Just measurable results.</p></FadeIn>
          <FadeIn delay={0.45}>
            <div style={{ display: "flex", gap: 16 }}>
              <button onClick={() => scrollTo("contact")} style={{ padding: "14px 36px", background: ACCENT, color: "#FFF", border: "none", fontSize: 13, letterSpacing: 3, cursor: "pointer", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, textTransform: "uppercase" }}>Book a free call</button>
              <button onClick={() => scrollTo("services")} style={{ padding: "14px 36px", background: "transparent", color: ACCENT, border: `1px solid ${ACCENT}40`, fontSize: 13, letterSpacing: 3, cursor: "pointer", fontFamily: "'Rajdhani', sans-serif", fontWeight: 500, textTransform: "uppercase" }}>View services</button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* STATS */}
      <div style={{ borderTop: `1px solid ${ACCENT}15`, borderBottom: `1px solid ${ACCENT}15`, padding: "40px 0", background: SURFACE }}>
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
              <p style={{ fontSize: 16, lineHeight: 1.8, color: TEXT, marginBottom: 20 }}>MARS Designs is a translator — taking the most transformative technology of the decade and making it accessible, practical, and profitable for the businesses that form the backbone of the American economy.</p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: MUTED, marginBottom: 32 }}>While 68% of U.S. small businesses report using AI, only about 10% have achieved real, production-level integration. That gap — between "I signed up for ChatGPT" and "AI is saving me 60 hours a month" — is where we live.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[{ title: "Clarity", desc: "Plain language. No jargon." }, { title: "Ownership", desc: "You own everything we build." }, { title: "Measurable", desc: "Every project tied to ROI." }, { title: "Integrity", desc: "We recommend what works." }].map((v, i) => (
                  <div key={i} style={{ padding: 16, border: `1px solid ${ACCENT}15`, borderLeft: `2px solid ${ACCENT}` }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT, letterSpacing: 2, marginBottom: 4 }}>{v.title}</div>
                    <div style={{ fontSize: 13, color: MUTED }}>{v.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ width: "100%", aspectRatio: "1", border: `1px solid ${ACCENT}20`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ position: "absolute", inset: 20, border: `1px solid ${ACCENT}10` }} />
              <div style={{ position: "absolute", inset: 40, border: `1px dashed ${ACCENT}08` }} />
              <div style={{ textAlign: "center" }}>
                <Logo size={40} />
                <div style={{ fontSize: 11, letterSpacing: 6, color: MUTED, marginTop: 8 }}>EST. 2026</div>
              </div>
              <div style={{ position: "absolute", top: -1, left: -1, width: 20, height: 20, borderTop: `2px solid ${ACCENT}`, borderLeft: `2px solid ${ACCENT}` }} />
              <div style={{ position: "absolute", bottom: -1, right: -1, width: 20, height: 20, borderBottom: `2px solid ${ACCENT}`, borderRight: `2px solid ${ACCENT}` }} />
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
                <div style={{ padding: 28, background: BG, border: `1px solid ${ACCENT}12`, height: "100%", position: "relative", overflow: "hidden" }}>
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

      {/* CUSTOM AGENTS */}
      <section style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <SectionTitle label="AI Agents" title="CUSTOM AGENT DEVELOPMENT" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
          <FadeIn>
            <div>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: TEXT, marginBottom: 16 }}>Stop repeating yourself. We build purpose-built AI agents that handle entire workflows autonomously — from intake to execution to reporting — so your team can focus on the work that actually requires a human.</p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: MUTED, marginBottom: 24 }}>Each agent is trained on your business data, connected to your tools, and deployed with guardrails. They don't hallucinate your SOPs — they follow them.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {agentTypes.map((a, i) => (
                  <div key={i} style={{ padding: 14, border: `1px solid ${ACCENT}12`, borderLeft: `2px solid ${ACCENT}` }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT, letterSpacing: 2, marginBottom: 4 }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: MUTED }}>{a.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div style={{ padding: 28, background: SURFACE, border: `1px solid ${ACCENT}12`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(90deg, ${ACCENT}, transparent)` }} />
              <div style={{ fontSize: 11, letterSpacing: 4, color: ACCENT, marginBottom: 16, fontWeight: 700 }}>WHAT'S INCLUDED</div>
              {agentFeatures.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, fontSize: 13, color: TEXT }}>
                  <span style={{ color: ACCENT, fontSize: 10, marginTop: 3 }}>&#9656;</span><span>{f}</span>
                </div>
              ))}
              <ThinLine opacity={0.15} />
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 16 }}>
                <span style={{ fontSize: 28, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: "#FFF" }}>$500 - $2,500</span>
                <span style={{ fontSize: 13, color: MUTED }}>per agent</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* A2A ARCHITECTURE */}
      <section style={{ padding: "100px 24px", background: SURFACE }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionTitle label="Multi-Agent Systems" title="AGENT-TO-AGENT ARCHITECTURE" />
          <FadeIn><p style={{ textAlign: "center", fontSize: 16, color: MUTED, lineHeight: 1.7, maxWidth: 650, margin: "0 auto 40px" }}>One agent is powerful. A team of agents that talk to each other? That's where the real transformation happens. We design multi-agent systems using Google's open A2A protocol — so your agents coordinate autonomously across platforms.</p></FadeIn>
          <FadeIn delay={0.1}>
            <div style={{ background: BG, border: `1px solid ${ACCENT}08`, padding: "32px 24px", marginBottom: 32, textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                {a2aFlow.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ padding: "12px 20px", border: `1px solid ${a.highlight ? ACCENT : ACCENT + "30"}`, background: a.highlight ? SURFACE2 : SURFACE, minWidth: 120 }}>
                      <div style={{ fontSize: 10, color: ACCENT, letterSpacing: 2, fontWeight: 700, marginBottom: 4 }}>{a.name}</div>
                      <div style={{ fontSize: 11, color: MUTED }}>{a.sub}</div>
                    </div>
                    {i < a2aFlow.length - 1 && <div style={{ color: `${ACCENT}50`, fontSize: 18 }}>⟷</div>}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, fontSize: 11, color: DIM, letterSpacing: 2 }}>AGENTS DISCOVER, DELEGATE, AND COORDINATE — WITHOUT HUMAN HANDOFFS</div>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
            {a2aCards.map((c, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div style={{ padding: 28, background: BG, border: `1px solid ${ACCENT}12`, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(90deg, ${ACCENT}, transparent)` }} />
                  <div style={{ fontSize: 32, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: `${ACCENT}20`, marginBottom: 12 }}>{c.num}</div>
                  <h3 style={{ fontSize: 16, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: "#FFF", margin: "0 0 12px", letterSpacing: 1 }}>{c.title}</h3>
                  <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, margin: "0 0 14px" }}>{c.desc}</p>
                  {c.tags.map(t => <Tag key={t}>{t}</Tag>)}
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <div style={{ textAlign: "center", padding: 20, border: `1px dashed ${ACCENT}15` }}>
              <p style={{ fontSize: 14, color: "#999", lineHeight: 1.7, margin: 0 }}>A2A is an open protocol by Google, now under the Linux Foundation, with 150+ enterprise partners. It complements Anthropic's MCP — <span style={{ color: ACCENT, fontWeight: 700 }}>MCP connects agents to tools, A2A connects agents to each other.</span></p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* AEO */}
      <section style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <SectionTitle label="Visibility" title="ANSWER ENGINE OPTIMIZATION" />
        <FadeIn><p style={{ textAlign: "center", fontSize: 16, color: MUTED, lineHeight: 1.7, maxWidth: 650, margin: "0 auto 40px" }}>SEO gets you ranked. AEO gets you <em style={{ color: TEXT, fontStyle: "normal" }}>cited</em>. When customers ask ChatGPT, Gemini, or Perplexity for recommendations, your business needs to be the answer — not just a link.</p></FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
          {aeoCards.map((c, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div style={{ padding: 28, background: SURFACE, border: `1px solid ${ACCENT}12`, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(90deg, ${ACCENT}, transparent)` }} />
                <div style={{ fontSize: 32, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: `${ACCENT}20`, marginBottom: 12 }}>{c.num}</div>
                <h3 style={{ fontSize: 16, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: "#FFF", margin: "0 0 12px", letterSpacing: 1 }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, margin: "0 0 14px" }}>{c.desc}</p>
                <div style={{ fontSize: 12, color: ACCENT, letterSpacing: 2, fontWeight: 700 }}>{c.price}</div>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.2}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
            {aeoStats.map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: 20, border: `1px solid ${ACCENT}12` }}>
                <div style={{ fontSize: 32, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: "#FFF", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: MUTED, letterSpacing: 2, marginTop: 6, textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div style={{ textAlign: "center", padding: 20, border: `1px dashed ${ACCENT}15` }}>
            <p style={{ fontSize: 14, color: "#999", lineHeight: 1.7, margin: 0 }}>Traditional SEO gets you ranked on page 1. AEO gets you <span style={{ color: ACCENT, fontWeight: 700 }}>cited as the answer</span> when 800M+ people ask AI for help. If your competitors optimize for AI search and you don't, you become invisible in the channel that's growing fastest.</p>
          </div>
        </FadeIn>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "100px 24px", background: SURFACE }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionTitle label="Investment" title="PRICING" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, alignItems: "stretch" }}>
            {pricingTiers.map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{ padding: 32, background: t.highlight ? SURFACE2 : BG, border: `1px solid ${t.highlight ? ACCENT : ACCENT + "15"}`, position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>
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
                        <span style={{ color: ACCENT, fontSize: 10, marginTop: 3 }}>&#9656;</span><span>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => scrollTo("contact")} style={{ width: "100%", padding: "12px 0", fontSize: 12, letterSpacing: 3, cursor: "pointer", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, textTransform: "uppercase", background: t.highlight ? ACCENT : "transparent", color: t.highlight ? "#FFF" : ACCENT, border: t.highlight ? "none" : `1px solid ${ACCENT}40` }}>Get started</button>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.4}>
            <div style={{ textAlign: "center", marginTop: 40, padding: 24, border: `1px dashed ${ACCENT}15` }}>
              <div style={{ fontSize: 12, color: MUTED, letterSpacing: 2, marginBottom: 4 }}>MARKET RATE COMPARISON</div>
              <div style={{ fontSize: 14, color: TEXT }}>
                Setup: <span style={{ color: ACCENT, fontWeight: 700 }}>$2K-$5K</span> <span style={{ color: DIM }}>(market: $5K-$15K)</span> &nbsp;&bull;&nbsp;
                Retainer: <span style={{ color: ACCENT, fontWeight: 700 }}>$458/mo</span> <span style={{ color: DIM }}>(market: $2K-$8K/mo)</span> &nbsp;&bull;&nbsp;
                Agents: <span style={{ color: ACCENT, fontWeight: 700 }}>$500+</span> <span style={{ color: DIM }}>(market: $5K-$25K)</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
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
      </section>

      {/* INDUSTRIES */}
      <section style={{ padding: "80px 24px", background: SURFACE }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionTitle label="Who we serve" title="INDUSTRIES" />
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
            {industries.map((ind, i) => (
              <FadeIn key={i} delay={i * 0.04}>
                <div style={{ padding: "10px 24px", border: `1px solid ${ACCENT}15`, fontSize: 13, color: TEXT, letterSpacing: 2, cursor: "default" }}>{ind}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <SectionTitle label="Let's talk" title="START YOUR AI JOURNEY" />
          <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7, marginBottom: 40 }}>Book a free 30-minute discovery call. We'll listen first, understand your business, and show you exactly where AI can save you time and money.</p>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <input placeholder="Your name" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} style={inputStyle} />
              <input placeholder="Email address" value={formState.email} onChange={e => setFormState({...formState, email: e.target.value})} style={inputStyle} />
            </div>
            <input placeholder="Business name" value={formState.business} onChange={e => setFormState({...formState, business: e.target.value})} style={{ ...inputStyle, width: "100%", marginBottom: 16, boxSizing: "border-box" }} />
            <textarea placeholder="Tell us about your business and what you're hoping AI can help with..." rows={4} value={formState.message} onChange={e => setFormState({...formState, message: e.target.value})} style={{ ...inputStyle, width: "100%", resize: "vertical", marginBottom: 16, boxSizing: "border-box" }} />
            {formError && <div style={{ color: "#cc3333", fontSize: 12, marginBottom: 12 }}>{formError}</div>}
            <button type="submit" disabled={formStatus === "sending"} style={{ padding: "16px 48px", background: ACCENT, color: "#FFF", border: "none", fontSize: 14, letterSpacing: 4, cursor: "pointer", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, textTransform: "uppercase", width: "100%" }}>
              {formStatus === "sending" ? "TRANSMITTING..." : formStatus === "success" ? "RECEIVED — WE'LL BE IN TOUCH" : formStatus === "error" ? "SOMETHING WENT WRONG — TRY AGAIN" : "BOOK FREE DISCOVERY CALL"}
            </button>
            {formStatus === "success" && <div style={{ marginTop: 16, padding: 14, border: `1px solid ${ACCENT}40`, color: ACCENT, fontWeight: 600, letterSpacing: 1 }}>Received — we'll be in touch within 24 hours.</div>}
            <p style={{ fontSize: 11, color: DIM, lineHeight: 1.6, marginTop: 12 }}>By submitting this form, you agree to our <a href="#" onClick={e => { e.preventDefault(); setPrivacyOpen(true); }} style={{ color: MUTED, textDecoration: "underline" }}>Privacy Policy</a> and consent to receive communications from MARS Designs at the email provided. You may unsubscribe at any time.</p>
          </form>
          <div style={{ marginTop: 32, display: "flex", justifyContent: "center", gap: 40 }}>
            <div>
              <div style={{ fontSize: 11, color: MUTED, letterSpacing: 3, marginBottom: 4 }}>EMAIL</div>
              <div style={{ fontSize: 14, color: ACCENT }}>discovery@marsdesigns.io</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: MUTED, letterSpacing: 3, marginBottom: 4 }}>LOCATION</div>
              <div style={{ fontSize: 14, color: TEXT }}>Based in Texas. Available everywhere.</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "40px 24px", borderTop: `1px solid ${ACCENT}10` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Logo size={14} />
          <div style={{ fontSize: 11, color: DIM, letterSpacing: 2 }}>&copy; 2026 MARS Designs LLC &nbsp;|&nbsp; <a href="#" onClick={e => { e.preventDefault(); setPrivacyOpen(true); }} style={{ color: "#555" }}>Privacy Policy</a></div>
          <div style={{ fontSize: 11, color: DIM, letterSpacing: 2 }}>AI that works for your business.</div>
        </div>
      </footer>

      {/* PRIVACY OVERLAY */}
      {privacyOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: BG, overflowY: "auto" }}>
          <div style={{ maxWidth: 780, margin: "0 auto", padding: "80px 24px 60px" }}>
            <button onClick={() => setPrivacyOpen(false)} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'Rajdhani', sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: 3, textTransform: "uppercase", color: MUTED, cursor: "pointer", border: "none", background: "none", marginBottom: 36 }}>← Back to Site</button>
            <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: 2, marginBottom: 6 }}>PRIVACY POLICY</h1>
            <p style={{ fontSize: 12, color: MUTED, letterSpacing: 2, marginBottom: 36 }}>Last Updated: March 15, 2026</p>
            {[
              { t: null, p: 'MARS Designs LLC ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit marsdesigns.io (the "Site"), use our services, or communicate with us through any channel including email, SMS, telephone, or AI-assisted communications.' },
              { t: "1. INFORMATION WE COLLECT", p: "We may collect personal information you voluntarily provide: name, email, phone number, business name, mailing address, and project details. We also automatically collect IP address, browser type, OS, pages viewed, and analytics data via cookies." },
              { t: "2. HOW WE USE YOUR INFORMATION", p: "We use information to: respond to inquiries and provide services; send transactional and marketing communications (with consent); improve our website and services; comply with legal obligations; and protect our rights." },
              { t: "3. COMMUNICATIONS & CONSENT", p: null },
              { t: null, sub: "Email", p: "By submitting a form or providing your email, you consent to transactional emails. You may opt in to marketing emails. Unsubscribe at any time via the link in any email or by contacting discovery@marsdesigns.io." },
              { t: null, sub: "SMS / Text Messages", p: "By providing your phone number and opting in, you consent to SMS/text messages including project updates, reminders, and promotional offers. Message frequency varies. Message and data rates may apply. Opt out by replying STOP. Reply HELP for assistance. SMS consent is not a condition of purchase. We comply with the TCPA." },
              { t: null, sub: "Telephone & Voice AI", p: "By providing your phone number, you consent to calls which may include automated dialing systems, pre-recorded messages, and AI-assisted voice technology. Revoke consent by informing us during a call, emailing discovery@marsdesigns.io, or following opt-out instructions. We comply with the TCPA and TSR." },
              { t: null, sub: "AI-Assisted Communications", p: "MARS Designs may use AI tools for email drafting, chatbot responses, voice interactions, and content personalization. When AI is used in real-time interactions, we disclose this at the start." },
              { t: "4. SHARING YOUR INFORMATION", p: "We do not sell, rent, or trade your personal information. We may share with service providers under confidentiality agreements, when required by law, in business transfers, or with your explicit consent." },
              { t: "5. DATA SECURITY", p: "We implement commercially reasonable safeguards. No method of transmission is 100% secure." },
              { t: "6. DATA RETENTION", p: "We retain information as long as needed to fulfill stated purposes, comply with law, resolve disputes, and enforce agreements." },
              { t: "7. YOUR RIGHTS", p: "You may have rights to: access, correct, or delete your data; opt out of marketing; request data portability; and withdraw consent. Contact discovery@marsdesigns.io. Response within 30 days." },
              { t: "8. COOKIES", p: "Our Site may use cookies. Control via browser settings." },
              { t: "9. CHILDREN'S PRIVACY", p: "Services not directed to under-18. We do not knowingly collect children's data." },
              { t: "10. CALIFORNIA RESIDENTS (CCPA/CPRA)", p: "Additional rights include: right to know, delete, opt out of sale/sharing. We do not sell personal information. Contact discovery@marsdesigns.io." },
              { t: "11. CAN-SPAM COMPLIANCE", p: "Marketing emails include physical address, clear unsubscribe, honest subjects. Opt-outs honored within 10 business days." },
              { t: "12. CHANGES", p: "We may update this policy. Changes posted here with revised date." },
              { t: "13. CONTACT US", p: "MARS Designs LLC — Email: discovery@marsdesigns.io — Based in Texas. Available everywhere." },
            ].map((s, i) => (
              <div key={i}>
                {s.t && <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: 1, marginTop: 36, marginBottom: 10 }}>{s.t}</h2>}
                {s.sub && <h3 style={{ fontSize: 15, fontWeight: 700, color: ACCENT, letterSpacing: 2, marginTop: 20, marginBottom: 6 }}>{s.sub}</h3>}
                {s.p && <p style={{ color: "#999", lineHeight: 1.8, marginBottom: 12, fontSize: 14 }}>{s.p}</p>}
              </div>
            ))}
            <hr style={{ border: "none", borderTop: `1px solid ${ACCENT}15`, margin: "28px 0" }} />
            <p style={{ fontSize: 11, color: DIM }}>This policy covers marsdesigns.io and all MARS Designs communications channels.</p>
          </div>
        </div>
      )}
    </div>
  );
}
