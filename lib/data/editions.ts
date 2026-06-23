import type { Edition } from "./types";

// Several journals carry multiple editions (volumes/issues) to exercise the
// Journal → Edition → Article hierarchy.
export const editions: Edition[] = [
  // Ceramic Histories — 2 editions
  {
    id: "e-ceramic-12-2",
    journalId: "j-ceramic",
    slug: "vol-12-issue-2",
    volume: 12,
    issue: 2,
    title: "Kilns of the Southern Sea",
    summary:
      "Trade, technology, and taste in the porcelain economies of the early modern maritime world.",
    publishedOn: "2026-05-18",
  },
  {
    id: "e-ceramic-12-1",
    journalId: "j-ceramic",
    slug: "vol-12-issue-1",
    volume: 12,
    issue: 1,
    title: "Glaze & Provenance",
    summary:
      "Material analysis and the problem of attribution in museum ceramic collections.",
    publishedOn: "2026-02-10",
  },
  // Aesthetics Review — 2 editions
  {
    id: "e-aesthetics-09-1",
    journalId: "j-aesthetics",
    slug: "vol-9-issue-1",
    volume: 9,
    issue: 1,
    title: "The Ethics of Attention",
    summary: "On looking, care, and the moral weight of what we choose to notice.",
    publishedOn: "2026-06-02",
  },
  {
    id: "e-aesthetics-08-2",
    journalId: "j-aesthetics",
    slug: "vol-8-issue-2",
    volume: 8,
    issue: 2,
    title: "Form and Feeling",
    summary: "Phenomenological approaches to aesthetic experience.",
    publishedOn: "2025-11-20",
  },
  // Formal Linguistics — 1
  {
    id: "e-linguistics-07-1",
    journalId: "j-linguistics",
    slug: "vol-7-issue-1",
    volume: 7,
    issue: 1,
    title: "Semantics of the Classical Line",
    summary: "Formal models for the meaning of historical verse.",
    publishedOn: "2026-04-12",
  },
  // Economic Histories — 2
  {
    id: "e-economic-18-1",
    journalId: "j-economic",
    slug: "vol-18-issue-1",
    volume: 18,
    issue: 1,
    title: "Labour in Motion",
    summary: "Migration and work in the long nineteenth century.",
    publishedOn: "2026-05-30",
  },
  {
    id: "e-economic-17-2",
    journalId: "j-economic",
    slug: "vol-17-issue-2",
    volume: 17,
    issue: 2,
    title: "Ports & Ledgers",
    summary: "Accounting practice and the infrastructure of Atlantic trade.",
    publishedOn: "2025-12-08",
  },
  // Climate Record — 1
  {
    id: "e-climate-05-1",
    journalId: "j-climate",
    slug: "vol-5-issue-1",
    volume: 5,
    issue: 1,
    title: "Memory in the Ice",
    summary: "What Scandinavian ice cores tell us about the last millennium.",
    publishedOn: "2026-03-22",
  },
  // History of Science — 1
  {
    id: "e-history-science-10-1",
    journalId: "j-history-science",
    slug: "vol-10-issue-1",
    volume: 10,
    issue: 1,
    title: "Instruments of Vision",
    summary: "The telescope, the institution, and early modern astronomy.",
    publishedOn: "2026-04-28",
  },
  // Machine Learning Letters — 2
  {
    id: "e-ml-06-2",
    journalId: "j-ml",
    slug: "vol-6-issue-2",
    volume: 6,
    issue: 2,
    title: "Learning for Discovery",
    summary: "Statistical learning in the materials sciences.",
    publishedOn: "2026-06-09",
  },
  {
    id: "e-ml-06-1",
    journalId: "j-ml",
    slug: "vol-6-issue-1",
    volume: 6,
    issue: 1,
    title: "Optimisation Notes",
    summary: "Short reports on convex and non-convex methods.",
    publishedOn: "2026-01-30",
  },
  // Comparative Literature — 1
  {
    id: "e-complit-19-1",
    journalId: "j-complit",
    slug: "vol-19-issue-1",
    volume: 19,
    issue: 1,
    title: "The Translated Self",
    summary: "Poetics of translation across Arabic and French.",
    publishedOn: "2026-05-04",
  },
  // Urban Ecologies — 1
  {
    id: "e-urban-04-1",
    journalId: "j-urban",
    slug: "vol-4-issue-1",
    volume: 4,
    issue: 1,
    title: "Resilient Commons",
    summary: "Designing public space for ecological and social resilience.",
    publishedOn: "2026-03-15",
  },
  // Music & Society — 1
  {
    id: "e-music-11-1",
    journalId: "j-music",
    slug: "vol-11-issue-1",
    volume: 11,
    issue: 1,
    title: "The Conservatory Question",
    summary: "Institutions, training, and the economy of performance.",
    publishedOn: "2026-02-26",
  },
  // Pure Mathematics — 1
  {
    id: "e-math-21-1",
    journalId: "j-math",
    slug: "vol-21-issue-1",
    volume: 21,
    issue: 1,
    title: "Notes in Number Theory",
    summary: "New results on primes, lattices, and modular forms.",
    publishedOn: "2026-04-01",
  },
];
