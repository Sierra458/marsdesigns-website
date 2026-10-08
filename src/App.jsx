import { useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import PrivacyPage from "./PrivacyPage";
import { faqs, FREE_AUDIT_LABEL, INTEREST_AUDIT, INTEREST_TALK } from "./structuredData";

const ACCENT = "#E8491C";
const ACCENT2 = "#FF6B3D";
const BG = "#0A0A0A";
const SURFACE = "#111111";
const SURFACE2 = "#1A1A1A";
const TEXT = "#E0E0E0";
const MUTED = "#777777";
const DIM = "#444444";

const sections = ["home", "about", "services", "investment", "process", "faq", "contact"];

const emptyForm = { name: "", email: "", business: "", interest: "", message: "" };

function FadeIn({ children, delay = 0, style = {} }) {
  // Always paint content so prerendered HTML stays crawler-visible.
  return (
    <div style={{ opacity: 1, transform: "translateY(0)", transition: `all 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function getPath(url) {
  const raw = url ?? (typeof window !== "undefined" ? window.location.pathname : "/");
  const path = raw.split("?")[0].split("#")[0].replace(/\/+$/, "");
  return path === "" ? "/" : path;
}

function Logo({ size = 28 }) {
  const hexSize = size * 1.3;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <svg width={hexSize} height={hexSize} viewBox="0 0 64 64" aria-hidden="true">
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
      <img
        src="/mars-designs-wordmark.png"
        alt="MARS Designs"
        style={{ height: hexSize, width: "auto", display: "block" }}
      />
    </div>
  );
}

function SectionTitle({ label, title, align = "center" }) {
  return (
    <div style={{ textAlign: align, marginBottom: 48 }}>
      <div style={{ fontSize: 11, color: ACCENT, letterSpacing: 6, fontFamily: "'Rajdhani', sans-serif", fontWeight: 300, marginBottom: 8, textTransform: "uppercase" }}>{label}</div>
      <h2 className="section-heading">{title}</h2>
      <div style={{ width: 60, height: 2, background: ACCENT, margin: align === "center" ? "16px auto 0" : "16px 0 0" }} />
    </div>
  );
}

function Tag({ children }) {
  return <span style={{ display: "inline-block", padding: "3px 10px", border: `1px solid ${ACCENT}12`, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: DIM, marginRight: 4, marginTop: 4 }}>{children}</span>;
}

function DemoVideo({ src, poster, label, caption }) {
  return (
    <figure className="video-card">
      <video
        className="demo-video"
        controls
        playsInline
        preload="metadata"
        poster={poster}
        width={720}
        height={1280}
        aria-label={label}
      >
        <source src={src} type="video/mp4" />
      </video>
      <figcaption className="video-caption">{caption}</figcaption>
    </figure>
  );
}

export default function App({ url }) {
  const path = getPath(url);
  return (
    <>
      {path === "/privacy" || path === "/privacy-policy" ? <PrivacyPage /> : <HomePage />}
      <Analytics />
    </>
  );
}

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formState, setFormState] = useState(emptyForm);
  const [formStatus, setFormStatus] = useState("idle");
  const [formError, setFormError] = useState("");

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const openContact = (interest) => {
    setFormState((prev) => ({ ...prev, interest }));
    setFormError("");
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const { name, email, message, interest } = formState;
    if (!name.trim() || !email.trim() || !message.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setFormError("Please fill in your name, a valid email, and a message.");
      return;
    }
    const requestLine = interest ? `Request: ${interest}` : "";
    const submittedMessage = requestLine ? `${requestLine}\n\n${message.trim()}` : message.trim();
    setFormStatus("sending");
    try {
      await fetch("https://script.google.com/macros/s/AKfycbz1e5IAnDolYSir-fyuNSHkROJYDQc5UbVu152Pj6rPmVzf069RssfFvnM9pUkN_Wqi/exec", {
        method: "POST", mode: "no-cors",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          business: formState.business.trim(),
          interest,
          message: submittedMessage,
          timestamp: new Date().toISOString(),
        }),
      });
      setFormStatus("success");
      setFormState(emptyForm);
      setTimeout(() => setFormStatus("idle"), 5000);
    } catch {
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 4000);
    }
  };

  const jobs = [
    {
      icon: "01",
      title: "Your inbox, sorted and drafted",
      desc: "An assistant reads what came in, sorts it, and drafts the replies. You see the draft and tap Approve. Nothing sends on its own.",
    },
    {
      icon: "02",
      title: "Dead estimates, followed up",
      desc: "Estimates that went quiet get a follow-up drafted for you. The assistant lines up who to nudge and what to say. You approve each one before it goes out.",
    },
    {
      icon: "03",
      title: "Outreach, drafted for your approval",
      desc: "When you need to reach out, the assistant drafts it and stops. You edit or approve. It does not send a campaign while you are away from the desk.",
    },
  ];

  const setupNotes = [
    { icon: "01", title: "Accounts, Grok first", desc: "We set up Grok, then Claude and Gemini if a job needs them, with access that matches your team." },
    { icon: "02", title: "The devices you have", desc: "We look at the phones, tablets, and computers you already use and tell you what is enough for the work." },
    { icon: "03", title: "Your workflow, watched", desc: "We watch how the job gets done today, on site or on a call, and mark the step a bot should take." },
    { icon: "04", title: "Instructions for your shop", desc: "Prompts and notes written for your business, starting with Grok." },
    { icon: "05", title: "A safe trial", desc: "You try the bot in a practice space first. Break a draft there, before a customer ever sees it." },
    { icon: "06", title: "The files stay with you", desc: "You get the documentation and the version history. You own what we build, and you can take it with you." },
  ];

  const processSteps = [
    { num: "01", title: "Discovery", desc: "Free audit, or a 30-minute call. We listen first — missed email, quiet estimates, and the jobs sitting on your plate." },
    { num: "02", title: "Proposal", desc: "Clear, plain-language proposal within 48 hours. No jargon, no mystery. You'll know exactly what you're getting." },
    { num: "03", title: "Assessment", desc: "Deep dive into your workflows. We find where an assistant on Grok Bots saves the most time." },
    { num: "04", title: "Build", desc: "Build the bots and connect them to the tools you already use. The files are yours from day one." },
    { num: "05", title: "Test & Train", desc: "Practice space first, live work second. Hands-on training for you and your team until everyone's confident." },
    { num: "06", title: "Launch & Support", desc: "Go live. Full documentation handoff. You own everything. We're here when you need us." },
  ];

  const grokBotProducts = [
    {
      title: "Grok Bots setup",
      line: "The full setup for a small shop that wants assistants running the week, on Grok Bots.",
      bullets: [
        "Each assistant has one job",
        "A person on your team owns that job",
        "Written steps for the work that keeps sitting",
        "Connects to the tools you already use",
        "Your team can run it without us",
      ],
      primary: true,
    },
    {
      title: "Grok Bots for Enterprise setup",
      line: "The same setup when you have more seats and more than one owner — not the first pitch for a single-shop cold call.",
      bullets: [
        "More than one owner, across teams",
        "The same jobs, shared across the company",
        "Connects to a larger set of tools",
        "Built for multi-seat teams",
      ],
      primary: false,
    },
  ];

  const coordinationCards = [
    { num: "01", title: "Roles", desc: "Each specialist agent has a clear job — intake, CRM, follow-up — so the team knows who owns the next step. No mystery wiring.", tags: ["Specialist Roles", "Clear Ownership"] },
    { num: "02", title: "Handoffs", desc: "When one agent hits a task outside its scope, it passes that work to the specialist that owns it — across the tools you already use.", tags: ["Task Routing", "Tool Handoffs"] },
    { num: "03", title: "Coordination", desc: "Agents share context and status as work moves. Your workflow runs end-to-end without a human shepherding each step.", tags: ["Shared Context", "Real-Time Sync"] },
  ];

  const coordinationFlow = [
    { name: "INTAKE AGENT", sub: "Lead capture" },
    { name: "COORDINATOR", sub: "Keeps the team in step", highlight: true },
    { name: "CRM AGENT", sub: "Data sync" },
    { name: "FOLLOW-UP AGENT", sub: "Email & SMS" },
  ];

  const aeoCards = [
    { num: "01", title: "Structured Content", desc: "We restructure your website so AI engines can extract and cite it — FAQ schema, answer blocks, entity markup, and concise formatting.", note: "Schema + Content Audit" },
    { num: "02", title: "AI Citation Strategy", desc: "Optimize for the way Grok, Gemini, and Perplexity pull answers. We target the prompts your customers actually type.", note: "Prompt-Matched Optimization" },
    { num: "03", title: "Monitoring & Iteration", desc: "Track your brand's AI citation rate across platforms. Monthly reports showing where you appear, where you don't, and what we're doing about it.", note: "Monthly AEO Reports" },
  ];

  const aeoStats = [
    { value: "25%", label: "Of search shifting to AI by 2026" },
    { value: "60%", label: "Of Google searches end zero-click" },
    { value: "800M+", label: "People asking AI for help" },
  ];

  const industries = ["Salons & Spas", "Restaurants", "Boutiques", "Custom Furniture", "Home Decor", "Fitness Studios", "Dental / Medical", "Cleaning Services", "Real Estate", "Legal Practices", "Consulting Firms", "Retail Shops"];

  const submitLabel = formStatus === "sending"
    ? "TRANSMITTING..."
    : formStatus === "success"
      ? "RECEIVED — WE'LL BE IN TOUCH"
      : formStatus === "error"
        ? "SOMETHING WENT WRONG — TRY AGAIN"
        : formState.interest === INTEREST_AUDIT
          ? "REQUEST THE FREE AUDIT"
          : "BOOK FREE DISCOVERY CALL";

  return (
    <div style={{ background: BG, color: TEXT, fontFamily: "'Rajdhani', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>

      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: `${BG}ee`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${ACCENT}08`, padding: "12px 0" }}>
        <div className="nav-bar">
          <div style={{ cursor: "pointer" }} onClick={() => scrollTo("home")}><Logo size={20} /></div>
          <button type="button" className="nav-toggle" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? "Close" : "Menu"}
          </button>
          <div className={menuOpen ? "nav-links is-open" : "nav-links"}>
            {sections.map((s) => (
              <button key={s} type="button" className="nav-link" onClick={() => scrollTo(s)}>{s}</button>
            ))}
          </div>
        </div>
      </nav>

      <section id="home" style={{ minHeight: "90vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 20% 50%, ${ACCENT}05 0%, transparent 60%)` }} />
        <div className="hero-orbits" style={{ position: "absolute", top: "10%", right: "5%", width: 400, height: 400, border: `1px solid ${ACCENT}1A`, borderRadius: "50%", animation: "spin 60s linear infinite" }}>
          <div style={{ position: "absolute", top: -4, left: "50%", width: 8, height: 8, borderRadius: "50%", background: ACCENT, transform: "translateX(-50%)" }} />
        </div>
        <div className="hero-orbits" style={{ position: "absolute", top: "calc(10% + 75px)", right: "calc(5% + 75px)", width: 250, height: 250, border: `1px solid ${ACCENT}12`, borderRadius: "50%" }} />
        <div className="wrap" style={{ position: "relative", zIndex: 1, paddingTop: 48, paddingBottom: 48 }}>
          <FadeIn><div className="eyebrow">BASED IN TEXAS. AVAILABLE EVERYWHERE.</div></FadeIn>
          <FadeIn delay={0.15}>
            <h1 className="hero-title">AI ASSISTANTS<br /><span className="hero-accent">FOR ONE JOB EACH</span></h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="hero-lead">Mars Designs sets up, configures, and runs AI assistants built on Grok Bots from xAI. Each one takes one back-office job — your inbox sorted and drafted, dead estimates followed up, or outreach drafted for your approval — and waits until you approve.</p>
          </FadeIn>
          <FadeIn delay={0.45}>
            <div className="cta-row">
              <button type="button" className="cta cta-primary" onClick={() => openContact(INTEREST_AUDIT)}>{FREE_AUDIT_LABEL}</button>
              <button type="button" className="cta cta-secondary" onClick={() => openContact(INTEREST_TALK)}>Talk to us</button>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="about" className="block">
        <div className="wrap">
          <div className="grid-2">
            <FadeIn>
              <div>
                <SectionTitle label="Who we are" title="NOT ANOTHER TECH CONSULTANCY" align="left" />
                <p style={{ fontSize: 16, lineHeight: 1.8, color: TEXT, marginBottom: 20 }}>MARS Designs is a translator — taking the most transformative technology of the decade and making it accessible, practical, and profitable for the businesses that form the backbone of the American economy.</p>
                <p style={{ fontSize: 16, lineHeight: 1.8, color: MUTED, marginBottom: 32 }}>While 68% of U.S. small businesses report using AI, only about 10% have achieved real, production-level integration. That gap — between "I signed up for Grok" and "AI is saving me 60 hours a month" — is where we live.</p>
                <div className="grid-values">
                  {[{ title: "Clarity", desc: "Plain language. No jargon." }, { title: "Ownership", desc: "You own everything we build." }, { title: "Measurable", desc: "Every project tied to ROI." }, { title: "Integrity", desc: "We recommend what works." }].map((v) => (
                    <div key={v.title} style={{ padding: 16, border: `1px solid ${ACCENT}15`, borderLeft: `2px solid ${ACCENT}` }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT, letterSpacing: 2, marginBottom: 4 }}>{v.title}</div>
                      <div style={{ fontSize: 13, color: MUTED }}>{v.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="brand-mark" style={{ width: "100%", maxWidth: 420, margin: "0 auto", aspectRatio: "1", border: `1px solid ${ACCENT}20`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
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
        </div>
      </section>

      <section id="services" className="block block-surface">
        <div className="wrap">
          <SectionTitle label="The jobs" title="ONE JOB AT A TIME" />
          <FadeIn>
            <p style={{ textAlign: "center", fontSize: 16, color: MUTED, lineHeight: 1.7, maxWidth: 640, margin: "-12px auto 36px" }}>AI assistants that each take one back-office job, then wait for your approval. We set them up on Grok Bots.</p>
          </FadeIn>
          <div className="grid-3">
            {jobs.map((s, i) => (
              <FadeIn key={s.title} delay={i * 0.08}>
                <div style={{ padding: 28, background: BG, border: `1px solid ${ACCENT}12`, height: "100%", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(90deg, ${ACCENT}, transparent)` }} />
                  <div style={{ fontSize: 32, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: `${ACCENT}20`, marginBottom: 12 }}>{s.icon}</div>
                  <h3 style={{ fontSize: 22, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, color: "#FFF", margin: "0 0 12px", letterSpacing: 0.2, lineHeight: 1.25 }}>{s.title}</h3>
                  <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.2}>
            <h3 className="section-heading" style={{ textAlign: "center", marginTop: 64, marginBottom: 8, fontSize: 22 }}>HOW IT WORKS</h3>
            <p style={{ textAlign: "center", fontSize: 15, color: MUTED, lineHeight: 1.6, maxWidth: 520, margin: "0 auto" }}>Short explainers: how an inbox assistant sorts, drafts, and waits for your Approve.</p>
            <div className="video-row">
              <DemoVideo
                src="/media/mars-email-grok-bot.mp4"
                poster="/media/mars-email-grok-bot-poster.jpg"
                label="Explainer of an inbox assistant sorting email, drafting replies, and waiting for Approve"
                caption="An inbox assistant sorts the mail, drafts the replies, and waits for your Approve."
              />
              <DemoVideo
                src="/media/mars-grok-bots-promo.mp4"
                poster="/media/mars-grok-bots-promo-poster.jpg"
                label="Explainer of one assistant for each back-office job, held for approval"
                caption="One assistant, one job — inbox, dead estimates, or outreach — drafted, then held for approval."
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="grok-bots" className="block">
        <div className="wrap">
          <SectionTitle label="Setup service" title="GROK BOTS SETUP" />
          <FadeIn>
            <p style={{ textAlign: "center", fontSize: 16, color: MUTED, lineHeight: 1.7, maxWidth: 650, margin: "0 auto 40px" }}>We set up, configure, and run AI assistants on Grok Bots. Each one has a single job, a person who owns it, and a handoff your team can run. You own the setup we build.</p>
          </FadeIn>
          <div className="grid-2-tight">
            {grokBotProducts.map((product, i) => (
              <FadeIn key={product.title} delay={i * 0.08} style={{ height: "100%" }}>
                <div style={{ padding: 28, background: product.primary ? SURFACE : BG, border: `1px solid ${product.primary ? ACCENT + "30" : ACCENT + "12"}`, height: "100%", position: "relative", overflow: "hidden", boxSizing: "border-box" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: product.primary ? `linear-gradient(90deg, ${ACCENT}, transparent)` : `linear-gradient(90deg, ${ACCENT}40, transparent)` }} />
                  <h3 style={{ fontSize: 16, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: "#FFF", margin: "0 0 12px", letterSpacing: 1 }}>{product.title}</h3>
                  <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, margin: "0 0 16px" }}>{product.line}</p>
                  {product.bullets.map((bullet) => (
                    <div key={bullet} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, fontSize: 13, color: TEXT }}>
                      <span style={{ color: ACCENT, fontSize: 10, marginTop: 3 }}>&#9656;</span><span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.2}>
            <div style={{ marginTop: 20, padding: 20, border: `1px dashed ${ACCENT}15` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, letterSpacing: 1, marginBottom: 6 }}>Claude Teams setup</div>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, margin: 0 }}>Already using Claude? We can stand up the same one-job assistants on Claude Max or Teams. We still start with Grok.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.25}>
            <div style={{ marginTop: 24, padding: 28, border: `1px solid ${ACCENT}15`, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: ACCENT, letterSpacing: 4, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Agentic AI Academy</div>
              <p style={{ fontSize: 16, color: TEXT, lineHeight: 1.7, margin: "0 0 8px" }}>Open enrollment. Core plus Grok, Claude, and Gemini tracks.</p>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, margin: "0 0 24px" }}>Academy trains people; they run assistants set up on Grok Bots.</p>
              <div className="cta-row center-row">
                <a className="cta cta-primary" href="https://agenticacademy.marsdesigns.io/signup?next=/tracks&sku=academy_full">Buy Full ($597)</a>
                <a className="cta cta-secondary" href="https://agenticacademy.marsdesigns.io/signup?next=/tracks&sku=academy_core">Start Core ($397)</a>
                <a className="cta cta-secondary" href="https://agenticacademy.marsdesigns.io/sample">Stage 01 Teaser</a>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="cta-row center-row" style={{ marginTop: 28 }}>
              <button type="button" className="cta cta-primary" onClick={() => openContact(INTEREST_AUDIT)}>{FREE_AUDIT_LABEL}</button>
              <button type="button" className="cta cta-secondary" onClick={() => openContact(INTEREST_TALK)}>Talk to us</button>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="block block-surface">
        <div className="wrap">
          <SectionTitle label="Behind the bots" title="HOW WE SET IT UP" />
          <FadeIn>
            <p style={{ textAlign: "center", fontSize: 16, color: MUTED, lineHeight: 1.7, maxWidth: 640, margin: "-12px auto 36px" }}>The practical work under the three jobs. Plain setup, then the bot. You keep what we make.</p>
          </FadeIn>
          <div className="grid-3">
            {setupNotes.map((s, i) => (
              <FadeIn key={s.title} delay={i * 0.08}>
                <div style={{ padding: 28, background: BG, border: `1px solid ${ACCENT}12`, height: "100%", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(90deg, ${ACCENT}66, transparent)` }} />
                  <div style={{ fontSize: 32, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: `${ACCENT}20`, marginBottom: 12 }}>{s.icon}</div>
                  <h3 style={{ fontSize: 20, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, color: "#FFF", margin: "0 0 12px", letterSpacing: 0.2, lineHeight: 1.3 }}>{s.title}</h3>
                  <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <SectionTitle label="Multi-Agent Systems" title="AGENT TEAMS THAT COORDINATE" />
          <FadeIn>
            <p style={{ textAlign: "center", fontSize: 14, color: "#999", lineHeight: 1.7, maxWidth: 650, margin: "0 auto 16px" }}>Once the fleet is up, specialist bots hand off and coordinate across your tools.</p>
            <p style={{ textAlign: "center", fontSize: 16, color: MUTED, lineHeight: 1.7, maxWidth: 650, margin: "0 auto 40px" }}>One agent is powerful. A team of specialist agents that hand off and coordinate across your tools? That's where the real transformation happens. We design agent teams so intake, follow-up, and your customer list stay in step — without you shepherding every handoff.</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div style={{ background: SURFACE, border: `1px solid ${ACCENT}08`, padding: "32px 24px", marginBottom: 32, textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                {coordinationFlow.map((a, i) => (
                  <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ padding: "12px 20px", border: `1px solid ${a.highlight ? ACCENT : ACCENT + "30"}`, background: a.highlight ? SURFACE2 : BG, minWidth: 120 }}>
                      <div style={{ fontSize: 10, color: ACCENT, letterSpacing: 2, fontWeight: 700, marginBottom: 4 }}>{a.name}</div>
                      <div style={{ fontSize: 11, color: MUTED }}>{a.sub}</div>
                    </div>
                    {i < coordinationFlow.length - 1 && <div style={{ color: `${ACCENT}50`, fontSize: 18 }}>⟷</div>}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, fontSize: 11, color: DIM, letterSpacing: 2 }}>SPECIALIST AGENTS HAND OFF AND COORDINATE — WITHOUT HUMAN SHEPHERDING</div>
            </div>
          </FadeIn>
          <div className="grid-3" style={{ marginBottom: 32 }}>
            {coordinationCards.map((c, i) => (
              <FadeIn key={c.title} delay={i * 0.08}>
                <div style={{ padding: 28, background: SURFACE, border: `1px solid ${ACCENT}12`, position: "relative", overflow: "hidden", height: "100%" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(90deg, ${ACCENT}, transparent)` }} />
                  <div style={{ fontSize: 32, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: `${ACCENT}20`, marginBottom: 12 }}>{c.num}</div>
                  <h3 style={{ fontSize: 16, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: "#FFF", margin: "0 0 12px", letterSpacing: 1 }}>{c.title}</h3>
                  <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, margin: "0 0 14px" }}>{c.desc}</p>
                  {c.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <div style={{ textAlign: "center", padding: 20, border: `1px dashed ${ACCENT}15` }}>
              <p style={{ fontSize: 14, color: "#999", lineHeight: 1.7, margin: 0 }}>We connect agents to your tools — including Anthropic's MCP when it fits — so specialist agents can <span style={{ color: ACCENT, fontWeight: 700 }}>hand off and coordinate across your stack</span>.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="block block-surface">
        <div className="wrap">
          <SectionTitle label="Visibility" title="ANSWER ENGINE OPTIMIZATION" />
          <FadeIn><p style={{ textAlign: "center", fontSize: 16, color: MUTED, lineHeight: 1.7, maxWidth: 650, margin: "0 auto 40px" }}>SEO gets you ranked. AEO gets you <em style={{ color: TEXT, fontStyle: "normal" }}>cited</em>. When customers ask Grok, Gemini, or Perplexity for recommendations, your business needs to be the answer — not just a link.</p></FadeIn>
          <div className="grid-3" style={{ marginBottom: 32 }}>
            {aeoCards.map((c, i) => (
              <FadeIn key={c.title} delay={i * 0.08}>
                <div style={{ padding: 28, background: BG, border: `1px solid ${ACCENT}12`, position: "relative", overflow: "hidden", height: "100%" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(90deg, ${ACCENT}, transparent)` }} />
                  <div style={{ fontSize: 32, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: `${ACCENT}20`, marginBottom: 12 }}>{c.num}</div>
                  <h3 style={{ fontSize: 16, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: "#FFF", margin: "0 0 12px", letterSpacing: 1 }}>{c.title}</h3>
                  <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, margin: "0 0 14px" }}>{c.desc}</p>
                  <div style={{ fontSize: 12, color: ACCENT, letterSpacing: 2, fontWeight: 700 }}>{c.note}</div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.2}>
            <div className="grid-3" style={{ marginBottom: 24 }}>
              {aeoStats.map((s) => (
                <div key={s.label} style={{ textAlign: "center", padding: 20, border: `1px solid ${ACCENT}12` }}>
                  <div style={{ fontSize: 32, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: "#FFF", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: MUTED, letterSpacing: 2, marginTop: 6, textTransform: "uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div style={{ textAlign: "center", padding: 20, border: `1px dashed ${ACCENT}15` }}>
              <p style={{ fontSize: 14, color: "#999", lineHeight: 1.7, margin: 0 }}>Traditional SEO gets you ranked on page 1. AEO gets you <span style={{ color: ACCENT, fontWeight: 700 }}>cited as the answer</span> when people ask AI for help. If your competitors optimize for AI search and you don't, you become invisible in the channel that's growing fastest.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="investment" className="block">
        <div className="narrow center">
          <SectionTitle label="Next step" title="INVESTMENT" />
          <FadeIn>
            <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7, margin: "0 0 28px" }}>Start with a free missed-email and dead-estimate audit. We look at messages that never got a reply and estimates that went quiet, and we write back what we see. A build, if you want one, is scoped after that — Launchpad for the setup, then ongoing help, fit to the shop.</p>
            <div className="cta-row center-row">
              <button type="button" className="cta cta-primary" onClick={() => openContact(INTEREST_AUDIT)}>{FREE_AUDIT_LABEL}</button>
              <button type="button" className="cta cta-secondary" onClick={() => openContact(INTEREST_TALK)}>Talk to us</button>
            </div>
            <div style={{ marginTop: 28 }}>
              <div style={{ fontSize: 11, color: MUTED, letterSpacing: 3, marginBottom: 4 }}>EMAIL</div>
              <a href="mailto:discovery@marsdesigns.io" style={{ fontSize: 14, color: ACCENT }}>discovery@marsdesigns.io</a>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="process" className="block block-surface">
        <div className="wrap">
          <SectionTitle label="The steps" title="OUR PROCESS" />
          <div className="grid-3">
            {processSteps.map((s, i) => (
              <FadeIn key={s.num} delay={i * 0.08}>
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

      <section className="block">
        <div className="wrap">
          <SectionTitle label="Who we serve" title="INDUSTRIES" />
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
            {industries.map((ind, i) => (
              <FadeIn key={ind} delay={i * 0.04}>
                <div style={{ padding: "10px 24px", border: `1px solid ${ACCENT}15`, fontSize: 13, color: TEXT, letterSpacing: 2 }}>{ind}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="block block-surface">
        <div className="narrow">
          <SectionTitle label="Questions owners ask" title="FAQ" />
          <div className="faq-list">
            {faqs.map((faq) => (
              <article key={faq.question} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
          <div className="cta-row center-row stack-top">
            <button type="button" className="cta cta-primary" onClick={() => openContact(INTEREST_AUDIT)}>{FREE_AUDIT_LABEL}</button>
            <button type="button" className="cta cta-secondary" onClick={() => openContact(INTEREST_TALK)}>Talk to us</button>
          </div>
        </div>
      </section>

      <section id="contact" className="block">
        <div className="narrow center">
          <SectionTitle label="Let's talk" title="START HERE" />
          <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7, marginBottom: 32 }}>Request the free missed-email and dead-estimate audit. Book a free call if you would rather talk first. This form goes to discovery@marsdesigns.io. We read it and reply.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input className="field" placeholder="Your name" aria-label="Your name" value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} />
              <input className="field" placeholder="Email address" aria-label="Email address" value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} />
            </div>
            <input className="field" placeholder="Business name" aria-label="Business name" value={formState.business} onChange={(e) => setFormState({ ...formState, business: e.target.value })} style={{ marginBottom: 16 }} />
            <label className="field-label" htmlFor="interest">What do you want?</label>
            <select
              id="interest"
              className="field"
              value={formState.interest}
              onChange={(e) => setFormState({ ...formState, interest: e.target.value })}
              style={{ marginBottom: 12 }}
            >
              <option value="">Select one</option>
              <option value={INTEREST_AUDIT}>Free audit</option>
              <option value={INTEREST_TALK}>Talk to us</option>
            </select>
            {formState.interest === INTEREST_AUDIT && (
              <p className="form-note">Free audit is selected. Tell us how missed email and unanswered estimates show up in your shop. This request goes to discovery@marsdesigns.io.</p>
            )}
            {formState.interest === INTEREST_TALK && (
              <p className="form-note">Talk to us is selected. Tell us a little about the shop and we will set a short call.</p>
            )}
            <textarea className="field" placeholder="Tell us about your business and what you're hoping an assistant can help with..." rows={4} aria-label="Message" value={formState.message} onChange={(e) => setFormState({ ...formState, message: e.target.value })} style={{ resize: "vertical", marginBottom: 16 }} />
            {formError && <div style={{ color: "#cc3333", fontSize: 14, marginBottom: 12 }}>{formError}</div>}
            <button type="submit" className="cta cta-primary" disabled={formStatus === "sending"} style={{ width: "100%", letterSpacing: 2 }}>
              {submitLabel}
            </button>
            {formStatus === "success" && <div style={{ marginTop: 16, padding: 14, border: `1px solid ${ACCENT}40`, color: ACCENT, fontWeight: 600, letterSpacing: 1 }}>Received — we'll be in touch within 24 hours.</div>}
            <p style={{ fontSize: 11, color: DIM, lineHeight: 1.6, marginTop: 12 }}>By submitting this form, you agree to our <a href="/privacy" style={{ color: MUTED, textDecoration: "underline" }}>Privacy Policy</a> and consent to receive communications from MARS Designs at the email provided. You may unsubscribe at any time.</p>
          </form>
          <div className="contact-meta">
            <div>
              <div style={{ fontSize: 11, color: MUTED, letterSpacing: 3, marginBottom: 4 }}>EMAIL</div>
              <a href="mailto:discovery@marsdesigns.io" style={{ fontSize: 14, color: ACCENT }}>discovery@marsdesigns.io</a>
            </div>
            <div>
              <div style={{ fontSize: 11, color: MUTED, letterSpacing: 3, marginBottom: 4 }}>LOCATION</div>
              <div style={{ fontSize: 14, color: TEXT }}>Based in Texas. Available everywhere.</div>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ padding: "40px 24px", borderTop: `1px solid ${ACCENT}10` }}>
        <div className="footer-bar">
          <Logo size={14} />
          <div style={{ fontSize: 11, color: DIM, letterSpacing: 2 }}>&copy; 2026 MARS Designs LLC &nbsp;|&nbsp; <a href="/privacy" style={{ color: "#555" }}>Privacy Policy</a></div>
          <div style={{ fontSize: 11, color: DIM, letterSpacing: 2 }}>AI that works for your business.</div>
        </div>
      </footer>

    </div>
  );
}
