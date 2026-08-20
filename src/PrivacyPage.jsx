const ACCENT = "#E8491C";
const BG = "#0A0A0A";
const TEXT = "#E0E0E0";
const MUTED = "#777777";
const DIM = "#444444";

const sections = [
  {
    p: 'MARS Designs LLC ("we," "us," or "our") is a Texas-based AI consultancy. We are committed to protecting your privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit marsdesigns.io (the "Site"), submit our contact form, email us, or otherwise communicate with us about our services.',
  },
  {
    t: "1. WHO WE ARE",
    p: "MARS Designs LLC provides AI account setup, custom AI skills, AI agents, multi-agent systems, and answer engine optimization. We are based in Texas and work with clients remotely. Privacy questions and requests: discovery@marsdesigns.io.",
  },
  {
    t: "2. INFORMATION WE COLLECT",
    p: "Through our website contact form we collect the information you choose to send: name, email address, business name, and message. If you email discovery@marsdesigns.io, we collect the contents of that correspondence, including any contact details you include. We may also automatically collect technical data such as IP address, browser type, operating system, pages viewed, and approximate location derived from IP, via server logs or cookies.",
  },
  {
    t: "3. HOW WE USE YOUR INFORMATION",
    p: "We use this information to respond to discovery-call requests and service inquiries; provide and improve our consulting services; send transactional messages related to a request you made; send marketing communications only with your consent; maintain security and prevent abuse; and comply with law.",
  },
  {
    t: "4. COMMUNICATIONS & CONSENT",
  },
  {
    sub: "Email",
    p: "By submitting the contact form or emailing us, you consent to transactional emails about your inquiry. You may opt in to marketing emails. Unsubscribe at any time via the link in any marketing email or by contacting discovery@marsdesigns.io.",
  },
  {
    sub: "SMS / Text Messages",
    p: "We do not collect a phone number on the public website form. If you later provide a phone number and opt in, you consent to SMS/text messages including project updates, reminders, and promotional offers. Message frequency varies. Message and data rates may apply. Opt out by replying STOP. Reply HELP for assistance. SMS consent is not a condition of purchase. We comply with the TCPA.",
  },
  {
    sub: "Telephone & Voice AI",
    p: "By providing a phone number, you consent to calls which may include automated dialing systems, pre-recorded messages, and AI-assisted voice technology. Revoke consent by informing us during a call, emailing discovery@marsdesigns.io, or following opt-out instructions. We comply with the TCPA and TSR.",
  },
  {
    sub: "AI-Assisted Communications",
    p: "MARS Designs may use AI tools for email drafting, chatbot responses, voice interactions, and content personalization. When AI is used in real-time interactions, we disclose this at the start.",
  },
  {
    t: "5. SHARING YOUR INFORMATION",
    p: "We do not sell, rent, or trade your personal information. We may share information with service providers who help us operate the Site and receive form submissions (for example hosting and the spreadsheet integration that stores contact-form entries), under confidentiality obligations; when required by law; in a business transfer; or with your explicit consent.",
  },
  {
    t: "6. DATA SECURITY",
    p: "We implement commercially reasonable safeguards. No method of transmission or storage is 100% secure.",
  },
  {
    t: "7. DATA RETENTION",
    p: "We retain inquiry and client information as long as needed to respond to you, provide services, comply with law, resolve disputes, and enforce agreements. You may request deletion as described below.",
  },
  {
    t: "8. YOUR RIGHTS",
    p: "You may request access to, correction of, or deletion of personal information we hold; opt out of marketing; request a copy of your data; or withdraw consent. Email discovery@marsdesigns.io. We aim to respond within 30 days.",
  },
  {
    t: "9. TEXAS RESIDENTS",
    p: "MARS Designs LLC is based in Texas. We honor privacy requests from Texas residents, including access, correction, and deletion of personal information collected through our Site, contact form, or email. The Texas Data Privacy and Security Act (TDPSA) applies to certain businesses that meet statutory thresholds. Even if those thresholds do not apply to us, you may contact discovery@marsdesigns.io to exercise the rights described in this policy. We do not sell personal information.",
  },
  {
    t: "10. COOKIES",
    p: "Our Site may use cookies or similar technologies for basic analytics and site operation. You can control cookies through your browser settings.",
  },
  {
    t: "11. CHILDREN'S PRIVACY",
    p: "Our services are not directed to children under 18. We do not knowingly collect personal information from children.",
  },
  {
    t: "12. CALIFORNIA RESIDENTS (CCPA/CPRA)",
    p: "If you are a California resident, you may have additional rights to know, delete, and opt out of sale or sharing of personal information. We do not sell or share personal information as those terms are defined by the CCPA/CPRA. Contact discovery@marsdesigns.io.",
  },
  {
    t: "13. CAN-SPAM COMPLIANCE",
    p: "Marketing emails include a valid physical or business contact method, a clear unsubscribe mechanism, and honest subject lines. Opt-outs are honored within 10 business days.",
  },
  {
    t: "14. CHANGES",
    p: "We may update this policy. The revised version will be posted on this page with an updated date.",
  },
  {
    t: "15. CONTACT US",
    p: "MARS Designs LLC — Email: discovery@marsdesigns.io — Based in Texas. Available everywhere. Website: https://marsdesigns.io",
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ background: BG, color: TEXT, fontFamily: "'Rajdhani', sans-serif", minHeight: "100vh" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "80px 24px 60px" }}>
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: MUTED,
            marginBottom: 36,
          }}
        >
          ← Back to Site
        </a>
        <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: 2, marginBottom: 6 }}>
          PRIVACY POLICY
        </h1>
        <p style={{ fontSize: 12, color: MUTED, letterSpacing: 2, marginBottom: 36 }}>Last Updated: August 20, 2026</p>
        {sections.map((s, i) => (
          <div key={i}>
            {s.t && (
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: 1, marginTop: 36, marginBottom: 10 }}>
                {s.t}
              </h2>
            )}
            {s.sub && (
              <h3 style={{ fontSize: 15, fontWeight: 700, color: ACCENT, letterSpacing: 2, marginTop: 20, marginBottom: 6 }}>
                {s.sub}
              </h3>
            )}
            {s.p && <p style={{ color: "#999", lineHeight: 1.8, marginBottom: 12, fontSize: 14 }}>{s.p}</p>}
          </div>
        ))}
        <hr style={{ border: "none", borderTop: `1px solid ${ACCENT}15`, margin: "28px 0" }} />
        <p style={{ fontSize: 11, color: DIM }}>
          This policy covers marsdesigns.io, the public contact form, and MARS Designs communications at discovery@marsdesigns.io.
        </p>
      </div>
    </div>
  );
}
