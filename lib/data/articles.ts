import type { Article, ArticleBlock } from "./types";

// Dummy long-form body. Real article prose will come from the DB / submission
// pipeline; this gives the reader a realistic typeset page to render.
function body(title: string, lead: string): ArticleBlock[] {
  return [
    { type: "p", text: lead },
    {
      type: "p",
      text: `This study situates "${title}" within a broader debate that has, until recently, proceeded largely by assertion. We begin by reconstructing the standard account, then identify the assumption on which it silently depends.`,
    },
    { type: "h2", text: "Method" },
    {
      type: "p",
      text: "Our approach is deliberately conservative. Rather than introduce new machinery, we re-read the existing evidence under a single, explicit criterion, and ask what survives. The result is less a refutation than a clarification: the familiar conclusion holds, but for reasons quite different from those usually given.",
    },
    {
      type: "quote",
      text: "What looks like disagreement is often only a difference in what each party has chosen to hold fixed.",
    },
    { type: "h2", text: "Findings" },
    {
      type: "p",
      text: "Three consequences follow. First, the boundary cases that troubled earlier treatments dissolve once the criterion is stated. Second, two results previously thought independent turn out to be the same result described twice. Third — and this is the substantive contribution — a class of objects long treated as marginal moves to the centre of the account.",
    },
    {
      type: "p",
      text: "We close by noting the limits of the argument and the questions it leaves open, which we take to be the more interesting ones.",
    },
  ];
}

export const articles: Article[] = [
  // Ceramic Histories vol 12 issue 2
  {
    id: "a-1",
    slug: "porcelain-routes-of-the-southern-sea",
    editionId: "e-ceramic-12-2",
    title: "Porcelain Routes of the Southern Sea",
    abstract:
      "A reconstruction of the maritime networks that carried glazed wares from southern kilns to the markets of the Indian Ocean, and what their cargo manifests reveal about taste.",
    authorIds: ["p-han"],
    keywords: ["ceramics", "trade", "maritime history", "early modern"],
    doi: "10.48999/cer.2026.0122.01",
    publishedOn: "2026-05-18",
    body: body(
      "Porcelain Routes of the Southern Sea",
      "The blue-and-white bowl in a Lisbon inventory and the shard in a Kilwa midden belong to one story, told from opposite ends.",
    ),
  },
  {
    id: "a-2",
    slug: "the-economy-of-the-kiln",
    editionId: "e-ceramic-12-2",
    title: "The Economy of the Kiln",
    abstract:
      "Firing was the most expensive and most dangerous moment in ceramic production. This paper treats the kiln as an economic institution in its own right.",
    authorIds: ["p-han", "p-novak"],
    keywords: ["ceramics", "economic history", "technology"],
    doi: "10.48999/cer.2026.0122.02",
    publishedOn: "2026-05-18",
    body: body(
      "The Economy of the Kiln",
      "A kiln is fired perhaps a dozen times a year; each firing is a wager on weather, fuel, and skill.",
    ),
  },
  // Ceramic Histories vol 12 issue 1
  {
    id: "a-3",
    slug: "glaze-chemistry-and-attribution",
    editionId: "e-ceramic-12-1",
    title: "Glaze Chemistry and the Problem of Attribution",
    abstract:
      "Non-destructive analysis offers tantalising precision, but precision is not the same as provenance. We argue for a disciplined scepticism.",
    authorIds: ["p-novak"],
    keywords: ["ceramics", "materials analysis", "attribution"],
    doi: "10.48999/cer.2026.0121.01",
    publishedOn: "2026-02-10",
    body: body(
      "Glaze Chemistry and the Problem of Attribution",
      "An elemental fingerprint tells you where the clay was not from far more reliably than where it was from.",
    ),
  },
  // Aesthetics Review vol 9 issue 1
  {
    id: "a-4",
    slug: "the-ethics-of-attention",
    editionId: "e-aesthetics-09-1",
    title: "The Ethics of Attention",
    abstract:
      "To attend is already to value. This essay argues that aesthetic attention carries a moral structure usually reserved for action.",
    authorIds: ["p-moreau"],
    keywords: ["aesthetics", "ethics", "phenomenology", "attention"],
    doi: "10.48999/aes.2026.0901.01",
    publishedOn: "2026-06-02",
    body: body(
      "The Ethics of Attention",
      "We are responsible not only for what we do but for what we let ourselves see.",
    ),
  },
  {
    id: "a-5",
    slug: "beauty-without-judgement",
    editionId: "e-aesthetics-09-1",
    title: "Beauty Without Judgement",
    abstract:
      "Can there be an experience of beauty that makes no claim on anyone else? A reconsideration of the Kantian demand for universality.",
    authorIds: ["p-moreau", "p-haddad"],
    keywords: ["aesthetics", "Kant", "judgement"],
    doi: "10.48999/aes.2026.0901.02",
    publishedOn: "2026-06-02",
    body: body(
      "Beauty Without Judgement",
      "The peculiar thing about calling something beautiful is that we seem to speak for others without asking them.",
    ),
  },
  // Aesthetics Review vol 8 issue 2
  {
    id: "a-6",
    slug: "form-and-feeling",
    editionId: "e-aesthetics-08-2",
    title: "Form and Feeling",
    abstract:
      "A phenomenological account of how formal structure in art becomes felt quality, without collapsing one into the other.",
    authorIds: ["p-moreau"],
    keywords: ["aesthetics", "phenomenology", "form"],
    doi: "10.48999/aes.2025.0802.01",
    publishedOn: "2025-11-20",
    body: body(
      "Form and Feeling",
      "We feel a melody as rising long before we could say what, exactly, has risen.",
    ),
  },
  // Formal Linguistics vol 7 issue 1
  {
    id: "a-7",
    slug: "semantics-of-the-classical-line",
    editionId: "e-linguistics-07-1",
    title: "A Formal Semantics of the Classical Line",
    abstract:
      "We propose a compositional semantics for the fixed metrical line of classical Japanese verse, treating caesura as a scope-bearing operator.",
    authorIds: ["p-tanaka"],
    keywords: ["semantics", "metre", "Japanese", "formal linguistics"],
    doi: "10.48999/lin.2026.0701.01",
    publishedOn: "2026-04-12",
    body: body(
      "A Formal Semantics of the Classical Line",
      "The pause in the middle of a line is not silence; it is a piece of grammar.",
    ),
  },
  {
    id: "a-8",
    slug: "agreement-without-features",
    editionId: "e-linguistics-07-1",
    title: "Agreement Without Features",
    abstract:
      "A minimalist treatment of agreement phenomena that dispenses with uninterpretable features in favour of a single locality constraint.",
    authorIds: ["p-tanaka", "p-park"],
    keywords: ["syntax", "agreement", "minimalism"],
    doi: "10.48999/lin.2026.0701.02",
    publishedOn: "2026-04-12",
    body: body(
      "Agreement Without Features",
      "Much of the apparatus we carry to explain agreement was built to solve a problem that locality already solves.",
    ),
  },
  // Economic Histories vol 18 issue 1
  {
    id: "a-9",
    slug: "labour-in-motion",
    editionId: "e-economic-18-1",
    title: "Labour in Motion",
    abstract:
      "Drawing on port records, this paper reconstructs seasonal migration flows and challenges the image of the immobile nineteenth-century worker.",
    authorIds: ["p-okonkwo"],
    keywords: ["economic history", "migration", "labour"],
    doi: "10.48999/eco.2026.1801.01",
    publishedOn: "2026-05-30",
    body: body(
      "Labour in Motion",
      "The worker who appears nowhere in the parish register appears, repeatedly, in the harbour ledger.",
    ),
  },
  {
    id: "a-10",
    slug: "wages-and-weather",
    editionId: "e-economic-18-1",
    title: "Wages and Weather",
    abstract:
      "A quantitative study linking harvest shocks to urban wage volatility across three port cities.",
    authorIds: ["p-okonkwo", "p-lindqvist"],
    keywords: ["economic history", "climate", "wages"],
    doi: "10.48999/eco.2026.1801.02",
    publishedOn: "2026-05-30",
    body: body(
      "Wages and Weather",
      "A bad harvest two hundred miles inland could be read, weeks later, in the price of bread at the docks.",
    ),
  },
  // Economic Histories vol 17 issue 2
  {
    id: "a-11",
    slug: "ports-and-ledgers",
    editionId: "e-economic-17-2",
    title: "Ports and Ledgers",
    abstract:
      "Double-entry bookkeeping as infrastructure: how accounting practice made long-distance Atlantic trade legible and therefore possible.",
    authorIds: ["p-okonkwo"],
    keywords: ["accounting", "Atlantic trade", "economic history"],
    doi: "10.48999/eco.2025.1702.01",
    publishedOn: "2025-12-08",
    body: body(
      "Ports and Ledgers",
      "Before a cargo could be financed it had to be written down in a form a stranger could trust.",
    ),
  },
  // Climate Record vol 5 issue 1
  {
    id: "a-12",
    slug: "memory-in-the-ice",
    editionId: "e-climate-05-1",
    title: "Memory in the Ice",
    abstract:
      "A high-resolution reconstruction of the last millennium of regional temperature from a Scandinavian ice core, with attention to volcanic signals.",
    authorIds: ["p-lindqvist"],
    keywords: ["palaeoclimate", "ice cores", "glaciology"],
    doi: "10.48999/cli.2026.0501.01",
    publishedOn: "2026-03-22",
    body: body(
      "Memory in the Ice",
      "Each layer of ice is a year, and each year keeps, in its bubbles, a sample of the air it fell through.",
    ),
  },
  // History of Science vol 10 issue 1
  {
    id: "a-13",
    slug: "instruments-of-vision",
    editionId: "e-history-science-10-1",
    title: "Instruments of Vision",
    abstract:
      "The early telescope was as much an institution as an instrument. This paper follows the lens from workshop to academy.",
    authorIds: ["p-rossi"],
    keywords: ["history of science", "astronomy", "instruments"],
    doi: "10.48999/his.2026.1001.01",
    publishedOn: "2026-04-28",
    body: body(
      "Instruments of Vision",
      "A new instrument does not simply reveal new things; it argues for a new kind of person entitled to look.",
    ),
  },
  // Machine Learning Letters vol 6 issue 2
  {
    id: "a-14",
    slug: "learning-for-discovery",
    editionId: "e-ml-06-2",
    title: "Learning for Discovery",
    abstract:
      "We present a sample-efficient active-learning loop for guiding experimental search in materials chemistry, with an honest accounting of its failures.",
    authorIds: ["p-park"],
    keywords: ["machine learning", "active learning", "materials"],
    doi: "10.48999/mll.2026.0602.01",
    publishedOn: "2026-06-09",
    body: body(
      "Learning for Discovery",
      "The hard part of search is not finding the next candidate but knowing when to stop trusting the model.",
    ),
  },
  {
    id: "a-15",
    slug: "calibration-under-shift",
    editionId: "e-ml-06-2",
    title: "Calibration Under Distribution Shift",
    abstract:
      "A short empirical study of how confidence calibration degrades when the test distribution drifts, and a simple correction.",
    authorIds: ["p-park", "p-tanaka"],
    keywords: ["machine learning", "calibration", "robustness"],
    doi: "10.48999/mll.2026.0602.02",
    publishedOn: "2026-06-09",
    body: body(
      "Calibration Under Distribution Shift",
      "A model that is well calibrated on the data it was trained on is making a promise it cannot keep.",
    ),
  },
  // Machine Learning Letters vol 6 issue 1
  {
    id: "a-16",
    slug: "notes-on-non-convex-descent",
    editionId: "e-ml-06-1",
    title: "Notes on Non-Convex Descent",
    abstract:
      "Three small observations on the behaviour of gradient methods near saddle points, with worked counter-examples.",
    authorIds: ["p-park"],
    keywords: ["optimisation", "non-convex", "gradient descent"],
    doi: "10.48999/mll.2026.0601.01",
    publishedOn: "2026-01-30",
    body: body(
      "Notes on Non-Convex Descent",
      "The saddle point is the place where intuition trained on convex problems quietly betrays you.",
    ),
  },
  // Comparative Literature vol 19 issue 1
  {
    id: "a-17",
    slug: "the-translated-self",
    editionId: "e-complit-19-1",
    title: "The Translated Self",
    abstract:
      "On bilingual poets who write the same poem twice. What survives translation, the essay argues, is not meaning but a particular kind of loss.",
    authorIds: ["p-haddad"],
    keywords: ["comparative literature", "translation", "poetics"],
    doi: "10.48999/cml.2026.1901.01",
    publishedOn: "2026-05-04",
    body: body(
      "The Translated Self",
      "The poet who translates herself is the only translator who is allowed to lie.",
    ),
  },
  // Urban Ecologies vol 4 issue 1
  {
    id: "a-18",
    slug: "resilient-commons",
    editionId: "e-urban-04-1",
    title: "Resilient Commons",
    abstract:
      "A comparative study of three urban green commons, asking what makes shared ecological space durable under social pressure.",
    authorIds: ["p-nakamura"],
    keywords: ["urban ecology", "commons", "resilience"],
    doi: "10.48999/urb.2026.0401.01",
    publishedOn: "2026-03-15",
    body: body(
      "Resilient Commons",
      "A park survives not because it is protected but because enough people quietly decide it is theirs.",
    ),
  },
  // Music & Society vol 11 issue 1
  {
    id: "a-19",
    slug: "the-conservatory-question",
    editionId: "e-music-11-1",
    title: "The Conservatory Question",
    abstract:
      "The modern conservatory promises to democratise musical excellence while reproducing the hierarchies it claims to dissolve.",
    authorIds: ["p-silva"],
    keywords: ["musicology", "institutions", "sociology of music"],
    doi: "10.48999/mus.2026.1101.01",
    publishedOn: "2026-02-26",
    body: body(
      "The Conservatory Question",
      "We tell students that talent will out, then spend four years teaching them exactly whom to imitate.",
    ),
  },
  // Pure Mathematics vol 21 issue 1
  {
    id: "a-20",
    slug: "lattices-and-modular-forms",
    editionId: "e-math-21-1",
    title: "Lattices and Modular Forms",
    abstract:
      "We establish a new bound relating the minima of certain integral lattices to coefficients of associated modular forms.",
    authorIds: ["p-kim"],
    keywords: ["number theory", "lattices", "modular forms"],
    doi: "10.48999/mat.2026.2101.01",
    publishedOn: "2026-04-01",
    body: body(
      "Lattices and Modular Forms",
      "The bound we prove is not tight, but it is the first to be uniform, and uniformity is what the application needs.",
    ),
  },
];
