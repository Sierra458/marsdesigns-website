import { build } from "vite";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { structuredDataJson } from "../src/structuredData.js";

const root = path.resolve(process.cwd());
const distDir = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const pages = [
  {
    url: "/",
    file: "index.html",
    title: "MARS Designs — AI That Works For Your Business",
    description:
      "MARS Designs is a Texas AI consultancy. Launchpad is $4,000 one-time, retainer $1,500/month, extra skills $150, and agents from $2,000 after Launchpad. Contact discovery@marsdesigns.io.",
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
  "$4,000",
  "$1,500/month",
  "$1,500/mo",
  "$1,500 per month",
  "1500.00",
  "$150",
  "$2,000",
  "Based in Texas",
  "discovery@marsdesigns.io",
  "application/ld+json",
];
const forbidden = ["$2,500", "2500.00", "$2K-$8K", "90% below market", "SouthernHR"];
const missing = required.filter((needle) => !homepage.includes(needle));
if (missing.length) {
  throw new Error(`Homepage HTML is missing crawler text: ${missing.join(", ")}`);
}
const leaked = forbidden.filter((needle) => homepage.includes(needle));
if (leaked.length) {
  throw new Error(`Homepage HTML still contains retired pricing copy: ${leaked.join(", ")}`);
}

for (const file of ["robots.txt", "sitemap.xml", path.join("privacy", "index.html")]) {
  if (!fs.existsSync(path.join(distDir, file))) {
    throw new Error(`Build output missing ${file}`);
  }
}

const privacy = fs.readFileSync(path.join(distDir, "privacy", "index.html"), "utf8");
if (!privacy.includes("PRIVACY POLICY") || !privacy.includes("Texas")) {
  throw new Error("Privacy page HTML is missing policy copy");
}

console.log("prerender verification passed");
