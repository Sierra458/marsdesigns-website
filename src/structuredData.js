export const SITE_URL = "https://marsdesigns.io";
export const CONTACT_EMAIL = "discovery@marsdesigns.io";
export const BUSINESS_NAME = "MARS Designs";
export const LEGAL_NAME = "MARS Designs LLC";

export const FREE_AUDIT_LABEL = "Get a free missed-email & dead-estimate audit";
export const INTEREST_AUDIT = "Free audit";
export const INTEREST_TALK = "Talk to us";

export const faqs = [
  {
    question: "What is an AI assistant from Mars Designs?",
    answer:
      "An AI assistant from Mars Designs takes one back-office job: your inbox sorted and drafted, dead estimates followed up, or outreach drafted for your approval. It prepares the work and waits for you. Mars Designs sets it up, configures it, and runs it on Grok Bots from xAI.",
  },
  {
    question: "What jobs can it take off my plate?",
    answer:
      "We start with three jobs owners already recognize. One assistant sorts your inbox and drafts replies. One follows up on estimates that never got an answer. One drafts outreach and holds it until you approve.",
  },
  {
    question: "Does it send anything without me?",
    answer:
      "No. An assistant can sort and draft, then it waits. Email and other messages stay put until you approve them. You can edit a draft or skip it.",
  },
  {
    question: "Do I need to be technical?",
    answer:
      "No. You do not need to write code, manage a server, or learn new jargon. We set the assistant up around the way the work already gets done, then show you how to review and approve. If you can read a message and tap Approve, you can run it.",
  },
  {
    question: "How does the free audit work?",
    answer:
      "The free missed-email and dead-estimate audit looks at what is slipping: messages that never got a reply, and estimates that went quiet. You tell us how those come in today, using the form on this page or discovery@marsdesigns.io. We write back what we see and where an assistant on Grok Bots could take a job. The audit is free, and asking for it does not commit you to a build.",
  },
  {
    question: "Who owns what you build?",
    answer:
      "You do. The instructions and the setup we put together for your business belong to you. Grok Bots is the xAI platform, and we hand over the notes your team needs to keep the assistants running. You are not left inside a system only we can access.",
  },
  {
    question: "What tools do you use?",
    answer:
      "Grok comes first. The assistants run on Grok Bots from xAI, and when a job needs another model we use Claude, then Gemini. We connect them to the email and business tools you already use, and we tell you which tool does which job before anything goes live.",
  },
  {
    question: "How do we get started?",
    answer:
      "Start with the free missed-email and dead-estimate audit. Use the form on this page — Free audit is one of the choices — or email discovery@marsdesigns.io. We read what you send and reply with what we find. If you would rather talk first, choose Talk to us and we will set a short call.",
  },
];

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
        "MARS Designs sets up, configures, and runs AI assistants for small businesses, built on Grok Bots from xAI. Each one takes a back-office job — inbox sorted and drafted, dead estimates followed up, or outreach drafted for approval — and nothing sends until the owner approves. Based in Texas. Start with a free missed-email and dead-estimate audit.",
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
        "Grok Bots",
        "Grok",
        "Claude",
        "Gemini",
        "Answer engine optimization",
        "Agent teams that coordinate",
      ],
      makesOffer: [
        {
          "@type": "Offer",
          name: "Free missed-email and dead-estimate audit",
          description:
            "A free look at messages that never got a reply and estimates that went quiet. We write back what we see and where an assistant on Grok Bots could take a job. Asking for the audit does not commit you to a build.",
          url: `${SITE_URL}/#contact`,
        },
        {
          "@type": "Offer",
          name: "Grok Bots setup",
          description:
            "We set up, configure, and run AI assistants on Grok Bots from xAI for a small shop. Each assistant does one job, a person on your team owns it, and nothing sends until you approve. You own the setup we build.",
          url: `${SITE_URL}/#grok-bots`,
        },
        {
          "@type": "Offer",
          name: "Grok Bots for Enterprise setup",
          description:
            "The same setup when you have more seats and more than one owner, on Grok Bots from xAI. Built for multi-seat teams. You own the setup we build.",
          url: `${SITE_URL}/#grok-bots`,
        },
        {
          "@type": "Offer",
          name: "Launchpad",
          description:
            "One-time setup of the assistants you choose on Grok Bots from xAI, including accounts, a safe trial, training, and the files. You own the setup we build. Scoped after a free audit or a short call.",
          url: `${SITE_URL}/#investment`,
        },
        {
          "@type": "Offer",
          name: "Ongoing help",
          description:
            "Updates, answer-engine checks, and priority support after a build. Scoped to the shop after a free audit or a short call.",
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
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

export function structuredDataJson() {
  return JSON.stringify(structuredData);
}
