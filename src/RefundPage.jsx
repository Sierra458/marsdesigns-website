const BG = "#0A0A0A";
const TEXT = "#E0E0E0";
const MUTED = "#777777";

const body = {
  color: "#999",
  lineHeight: 1.8,
  marginBottom: 12,
  fontSize: 14,
};

const strong = { color: TEXT, fontWeight: 700 };

function Heading({ children }) {
  return (
    <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: 1, marginTop: 36, marginBottom: 10 }}>
      {children}
    </h2>
  );
}

function BulletList({ items }) {
  return (
    <ul style={{ color: "#999", lineHeight: 1.8, margin: "0 0 12px 18px", padding: 0, fontSize: 14 }}>
      {items.map((item) => (
        <li key={item} style={{ marginBottom: 6 }}>{item}</li>
      ))}
    </ul>
  );
}

export default function RefundPage() {
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
          Refund Policy
        </h1>
        <p style={{ fontSize: 12, color: MUTED, letterSpacing: 2, marginBottom: 36 }}>Last updated: [date of publishing]</p>
        <p style={body}>We want you to feel good about buying an Agentic AI Academy course. If it isn't right for you, here's how refunds work.</p>

        <Heading>30 days to ask</Heading>
        <p style={body}>You can ask for a refund within <strong style={strong}>30 days of your purchase date</strong>. After 30 days, purchases can't be refunded.</p>

        <Heading>You get back what you haven't used</Heading>
        <p style={body}>Refunds are based on how much of the course you've finished. We refund your purchase price times the share of stages you haven't passed yet.</p>
        <p style={body}><strong style={strong}>Example:</strong> a course has 12 stages and you've passed 3. You get back 9/12 of what you paid, which is 75%.</p>
        <p style={body}>If you haven't passed any stages, you get a full refund.</p>

        <Heading>Bundles</Heading>
        <p style={body}>If you bought a bundle, we count every stage in that bundle. That includes Core when it was part of your order. Your refund is the bundle price times the share of those stages you haven't passed.</p>

        <Heading>Courses with a certificate</Heading>
        <p style={body}>Once you've finished a course and earned its certificate, that course can't be refunded.</p>
        <p style={body}>If the course was part of a bundle, its stages count as used, and the rest of the bundle can still be refunded under the rule above.</p>

        <Heading>What happens after a refund</Heading>
        <p style={body}>When we process a refund:</p>
        <BulletList items={[
          "Your access to the refunded course or bundle ends.",
          "Badges and certificates for that course are removed, and their public verify pages stop working.",
        ]} />

        <Heading>How to ask</Heading>
        <p style={body}>Email <strong style={strong}>discovery@marsdesigns.io</strong> within 30 days of purchase. Please include:</p>
        <BulletList items={[
          "your name",
          "the email on your Academy account",
          "your purchase date and what you bought",
        ]} />
        <p style={body}>Never send card numbers. We reply within 24 hours, 9 a.m. to 7 p.m. Central Time. Once a refund is approved, it goes back to your original payment method. Your bank decides how long it takes to show up.</p>

        <Heading>Questions</Heading>
        <p style={body}>Email discovery@marsdesigns.io.</p>
      </div>
    </div>
  );
}
