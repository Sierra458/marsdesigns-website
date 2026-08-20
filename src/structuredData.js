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
        "MARS Designs is a Texas AI consultancy that sets up AI accounts, custom skills, AI agents, multi-agent A2A systems, and answer engine optimization for small businesses.",
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
      ],
      makesOffer: [
        {
          "@type": "Offer",
          name: "Launchpad",
          description:
            "One-time AI setup: account configuration, hardware assessment, 5 custom AI skills, training, GitHub repository, sandbox testing, and 30-day post-launch support.",
          price: "4000.00",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/#pricing`,
        },
        {
          "@type": "Offer",
          name: "Retainer",
          description:
            "Monthly optimization, AEO monitoring, prompt and agent updates, GitHub maintenance, and priority support.",
          price: "2500.00",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "2500.00",
            priceCurrency: "USD",
            unitText: "MONTH",
            billingDuration: "P1M",
          },
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/#pricing`,
        },
        {
          "@type": "Offer",
          name: "Extra custom AI skill",
          description: "Purpose-built Claude or OpenClaw skill with specialized prompts, tools, and knowledge bases.",
          price: "150.00",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/#services`,
        },
        {
          "@type": "AggregateOffer",
          name: "AI agents",
          description:
            "Custom AI agents from $2,000 after Launchpad. Multi-system custom agents $5,000–$15,000. Multi-agent A2A systems $10,000+.",
          lowPrice: "2000.00",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/#pricing`,
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
          name: "How much does Launchpad cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Launchpad is $4,000 one-time and includes AI account setup, hardware assessment, 5 custom AI skills, training, a GitHub repository, sandbox testing, and 30-day post-launch support.",
          },
        },
        {
          "@type": "Question",
          name: "How much is the MARS Designs retainer?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The retainer is $2,500 per month for ongoing optimization, AEO monitoring, prompt and agent updates, GitHub maintenance, and priority support.",
          },
        },
        {
          "@type": "Question",
          name: "How much does an extra AI skill cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Extra custom AI skills are $150 per skill.",
          },
        },
        {
          "@type": "Question",
          name: "How much do AI agents cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "AI agents start at $2,000 after Launchpad. Multi-system custom agents are $5,000–$15,000. Multi-agent A2A systems start at $10,000.",
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
