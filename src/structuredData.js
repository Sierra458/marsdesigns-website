export const SITE_URL = "https://marsdesigns.io";
export const CONTACT_EMAIL = "discovery@marsdesigns.io";
export const BUSINESS_NAME = "MARS Designs";
export const LEGAL_NAME = "MARS Designs LLC";

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
      "@id": `${SITE_URL}/#organization`,
      name: BUSINESS_NAME,
      legalName: LEGAL_NAME,
      url: SITE_URL,
      email: CONTACT_EMAIL,
      description:
        "MARS Designs is a Texas AI consultancy that sets up AI accounts, custom skills, AI agents, multi-agent A2A systems, and answer engine optimization for small businesses. Contact us for a quote.",
      foundingDate: "2026",
      areaServed: {
        "@type": "Country",
        name: "United States",
      },
      address: {
        "@type": "PostalAddress",
        addressRegion: "TX",
        addressCountry: "US",
      },
      knowsAbout: [
        "Answer engine optimization",
        "AI agents",
        "Agent-to-agent architecture",
        "Custom AI skills",
        "Grok",
        "Claude",
        "Gemini",
      ],
      makesOffer: [
        {
          "@type": "Offer",
          name: "Launchpad",
          description:
            "One-time AI setup: account configuration, hardware assessment, custom AI skills, training, GitHub repository, sandbox testing, and post-launch support. Contact us for a quote after a short discovery call.",
          url: `${SITE_URL}/#investment`,
        },
        {
          "@type": "Offer",
          name: "Retainer",
          description:
            "Ongoing optimization, AEO monitoring, prompt and agent updates, GitHub maintenance, and priority support. Contact us for a quote.",
          url: `${SITE_URL}/#investment`,
        },
        {
          "@type": "Offer",
          name: "Custom AI skills",
          description: "Purpose-built Claude or OpenClaw skills with specialized prompts, tools, and knowledge bases. Contact us for a quote.",
          url: `${SITE_URL}/#services`,
        },
        {
          "@type": "Offer",
          name: "AI agents",
          description:
            "Custom AI agents, multi-system agents, multi-agent A2A systems, and answer engine optimization. Contact us for a quote.",
          url: `${SITE_URL}/#investment`,
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: BUSINESS_NAME,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What does MARS Designs do?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "MARS Designs is a Texas AI consultancy that helps small businesses adopt practical AI: account setup, custom skills, AI agents, agent-to-agent architecture, and answer engine optimization (AEO).",
          },
        },
        {
          "@type": "Question",
          name: "Where is MARS Designs based?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "MARS Designs is based in Texas and available everywhere.",
          },
        },
        {
          "@type": "Question",
          name: "How do I get a quote?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Contact us for a quote. We scope Launchpad and ongoing work to the shop after a short discovery call. Email discovery@marsdesigns.io or use the form at https://marsdesigns.io/#contact.",
          },
        },
        {
          "@type": "Question",
          name: "How do I contact MARS Designs?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Email discovery@marsdesigns.io or use the discovery form at https://marsdesigns.io/#contact to book a free 30-minute call.",
          },
        },
      ],
    },
  ],
};

export function structuredDataJson() {
  return JSON.stringify(structuredData);
}
