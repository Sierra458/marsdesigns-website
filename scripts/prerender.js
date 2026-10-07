import { build } from "vite";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { faqs, structuredDataJson } from "../src/structuredData.js";

const root = path.resolve(process.cwd());
const distDir = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const pages = [
  {
    url: "/",
    file: "index.html",
    title: "MARS Designs — AI That Works For Your Business",
    description:
      "AI assistants for small businesses. One job each: inbox sorted and drafted, dead estimates followed up, or outreach drafted for approval. Nothing sends until you approve. The product is Grok Bots. Free missed-email and dead-estimate audit. Based in Texas.",
    canonical: "https://marsdesigns.io/",
  },
  {
    url: "/privacy",
    file: path.join("privacy", "index.html"),
    title: "Privacy Policy — MARS Designs",
    description:
      "Privacy Policy for MARS Designs LLC, a Texas AI consultancy. How we collect, use, and protect information from our website, contact form, and discovery@marsdesigns.io.",
    canonical: "https://marsdesigns.io/privacy",
  },
  {
    url: "/privacy-policy",
    file: path.join("privacy-policy", "index.html"),
    title: "Privacy Policy — MARS Designs",
    description:
      "Privacy Policy for MARS Designs LLC, a Texas AI consultancy. How we collect, use, and protect information from our website, contact form, and discovery@marsdesigns.io.",
    canonical: "https://marsdesigns.io/privacy",
  },
];

await build({
  root,
  configFile: path.join(root, "vite.config.js"),
  build: {
    ssr: path.join(root, "src/entry-server.jsx"),
    outDir: ssrDir,
    emptyOutDir: true,
    sourcemap: false,
  },
});

const ssrEntry = path.join(ssrDir, "entry-server.js");
if (!fs.existsSync(ssrEntry)) {
  throw new Error(`SSR bundle missing at ${ssrEntry}`);
}

const { render } = await import(pathToFileURL(ssrEntry).href);
const template = fs.readFileSync(path.join(distDir, "index.html"), "utf8");

function applyMeta(html, page) {
  let next = html;
  next = next.replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`);
  next = next.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${page.description.replaceAll('"', "&quot;")}" />`
  );
  if (next.includes('rel="canonical"')) {
    next = next.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${page.canonical}" />`);
  } else {
    next = next.replace("</head>", `    <link rel="canonical" href="${page.canonical}" />\n  </head>`);
  }
  if (!next.includes("application/ld+json")) {
    const jsonLd = `    <script type="application/ld+json">${structuredDataJson()}</script>\n`;
    next = next.replace("</head>", `${jsonLd}  </head>`);
  }
  return next;
}

function injectApp(html, appHtml) {
  if (html.includes("<!--app-html-->")) {
    return html.replace("<!--app-html-->", appHtml);
  }
  return html.replace(/<div id="root"><\/div>/, `<div id="root">${appHtml}</div>`);
}

for (const page of pages) {
  const appHtml = render(page.url);
  if (!appHtml || appHtml.length < 200) {
    throw new Error(`Prerender produced empty HTML for ${page.url}`);
  }
  const html = applyMeta(injectApp(template, appHtml), page);
  const outFile = path.join(distDir, page.file);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html);
  if (page.url !== "/") {
    const flat = path.join(distDir, `${page.url.replace(/^\//, "")}.html`);
    fs.writeFileSync(flat, html);
  }
  console.log(`prerendered ${page.url} -> ${path.relative(root, outFile)} (${html.length} bytes)`);
}

fs.rmSync(ssrDir, { recursive: true, force: true });

const homepage = fs.readFileSync(path.join(distDir, "index.html"), "utf8");
const required = [
  "MARS Designs",
  "INVESTMENT",
  "Get a free missed-email &amp; dead-estimate audit",
  "Launchpad for the setup",
  "Based in Texas",
  "discovery@marsdesigns.io",
  "application/ld+json",
  "FAQPage",
  "Book a free call",
  "Talk to us",
  "Free audit",
  "Grok",
  "Claude",
  "Gemini",
  "AGENT TEAMS THAT COORDINATE",
  "specialist agents that hand off and coordinate",
  "GROK BOTS",
  "Grok Bots for Enterprise",
  "Claude Teams setup",
  "agenticacademy.marsdesigns.io",
  "Open enrollment. Core plus Grok, Claude, and Gemini tracks.",
  "Academy trains people; Grok Bots is what they run.",
  "Buy Full ($597)",
  "Start Core ($397)",
  "Stage 01 Teaser",
  // renderToString escapes "&" as "&amp;" inside href attributes.
  "https://agenticacademy.marsdesigns.io/signup?next=/tracks&amp;sku=academy_full",
  "https://agenticacademy.marsdesigns.io/signup?next=/tracks&amp;sku=academy_core",
  "https://agenticacademy.marsdesigns.io/sample",
  "Once the fleet is up, specialist bots hand off and coordinate across your tools.",
  "Your inbox, sorted and drafted",
  "Dead estimates, followed up",
  "Outreach, drafted for your approval",
  "playsinline",
  'preload="metadata"',
  "/media/mars-email-grok-bot.mp4",
  "/media/mars-grok-bots-promo.mp4",
  "/media/mars-email-grok-bot-poster.jpg",
  "/media/mars-grok-bots-promo-poster.jpg",
  "Grok comes first.",
  "HOW IT WORKS",
  "Short explainers: how an inbox assistant sorts, drafts, and waits for your Approve.",
  "What is an AI assistant from Mars Designs?",
  "We call that assistant a Grok Bot, and it is built on Grok.",
  "AI ASSISTANTS",
];
const forbidden = [
  "$2,500",
  "2500.00",
  "$2K-$8K",
  "90% below market",
  "SouthernHR",
  "$4,000",
  "$1,500",
  "$150",
  "$2,000",
  "$5K",
  "$10,000",
  "$500",
  "priceCurrency",
  "\"price\"",
  "USD",
  "ChatGPT",
  "OpenAI",
  "A2A",
  "Google A2A",
  "Agent Cards",
  "Linux Foundation",
  "Average time saved",
  "Return on investment",
  "Admin task reduction",
  "61hrs",
  "AI AGENT DEVELOPMENT",
  "waitlist",
  "Waitlist",
  "invite-only",
  "invite only",
  "Invite-only",
  "Contact us for a quote",
  "Hardware Config",
  "GitHub Repository",
  "rooms",
  "lanes",
  "SEE IT WORKING",
  "What is a Grok Bot?",
];
const missing = required.filter((needle) => !homepage.includes(needle));
for (const faq of faqs) {
  const questionHits = homepage.split(faq.question).length - 1;
  const answerHits = homepage.split(faq.answer).length - 1;
  if (questionHits < 2 || answerHits < 2) {
    throw new Error(`FAQ "${faq.question}" must appear in the visible page and FAQPage JSON-LD (question ${questionHits}, answer ${answerHits})`);
  }
}
if (missing.length) {
  throw new Error(`Homepage HTML is missing crawler text: ${missing.join(", ")}`);
}
const leaked = forbidden.filter((needle) => homepage.includes(needle));
if (leaked.length) {
  throw new Error(`Homepage HTML still contains retired pricing copy: ${leaked.join(", ")}`);
}
const allowedAcademyPrices = ["$597", "$397"];
let homepageWithoutAcademyPrices = homepage;
for (const price of allowedAcademyPrices) {
  const hits = homepage.split(price).length - 1;
  if (hits !== 1) {
    throw new Error(`Homepage HTML must contain ${price} exactly once (found ${hits})`);
  }
  homepageWithoutAcademyPrices = homepageWithoutAcademyPrices.replaceAll(price, "");
}
if (homepageWithoutAcademyPrices.includes("$")) {
  throw new Error("Homepage HTML still contains a non-Academy dollar sign");
}

for (const file of [
  "robots.txt",
  "sitemap.xml",
  path.join("privacy", "index.html"),
  path.join("media", "mars-email-grok-bot.mp4"),
  path.join("media", "mars-grok-bots-promo.mp4"),
  path.join("media", "mars-email-grok-bot-poster.jpg"),
  path.join("media", "mars-grok-bots-promo-poster.jpg"),
]) {
  if (!fs.existsSync(path.join(distDir, file))) {
    throw new Error(`Build output missing ${file}`);
  }
}

const privacy = fs.readFileSync(path.join(distDir, "privacy", "index.html"), "utf8");
if (!privacy.includes("PRIVACY POLICY") || !privacy.includes("Texas")) {
  throw new Error("Privacy page HTML is missing policy copy");
}

console.log("prerender verification passed");
