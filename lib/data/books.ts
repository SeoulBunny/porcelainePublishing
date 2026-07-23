import type { Book } from "@/lib/types";

export const books: Book[] = [
  {
    id: "b-kiln-and-empire",
    slug: "kiln-and-empire",
    title: "Kiln and Empire: Ceramic Trade Networks, 1400-1800",
    authorIds: ["mireille-tanaka"],
    isbn: "978-1-64829-101-4",
    year: 2025,
    pages: 312,
    language: "English",
    publisher: "Porcelain Publishing",
    description:
      "A material-culture history tracing celadon and blue-and-white porcelain trade routes from Goryeo kilns through Ming export networks to European court collections.",
    coverSeed: "book-kiln-and-empire",
    subjectTags: ["Material culture", "Trade history", "East Asian art"],
    popularity: 5210,
    chapters: [
      { id: "c1", number: 1, title: "The Gangjin kilns and the celadon export boom", preview: "Excavation records from the Gangjin kiln complex reveal an export operation far larger than court demand alone could explain." },
      { id: "c2", number: 2, title: "Blue-and-white as diplomatic currency", preview: "Ming-era gift registers show porcelain functioning as a formal instrument of tributary diplomacy across three courts." },
      { id: "c3", number: 3, title: "The Dutch East India Company's porcelain ledgers", preview: "VOC shipping manifests, cross-referenced against auction records, chart the piece-by-piece Europeanization of demand." },
      { id: "c4", number: 4, title: "Imitation kilns and the Delft response", preview: "European tin-glaze workshops raced to imitate a material they could not yet chemically replicate." },
      { id: "c5", number: 5, title: "Provenance disputes in the modern collection market", preview: "Contemporary auction houses still wrestle with attribution gaps this book's archival work partly closes." },
    ],
  },
  {
    id: "b-tone-and-territory",
    slug: "tone-and-territory",
    title: "Tone and Territory: Language Contact in the Yellow Sea Basin",
    authorIds: ["hana-seo", "linh-pham"],
    isbn: "978-1-64829-118-2",
    year: 2024,
    pages: 268,
    language: "English",
    publisher: "Porcelain Publishing",
    description:
      "A comparative linguistic study of tonal drift and grammatical borrowing among coastal communities bridging the Korean peninsula and eastern China.",
    coverSeed: "book-tone-and-territory",
    subjectTags: ["Linguistics", "Language contact", "Fieldwork"],
    popularity: 3005,
    chapters: [
      { id: "c1", number: 1, title: "Mapping the contact zone", preview: "Three centuries of fishing-fleet intermarriage produced a contact zone linguists have only recently begun to map systematically." },
      { id: "c2", number: 2, title: "Tone sandhi as a contact signature", preview: "Sandhi patterns diverge from both parent languages in ways that resist a simple substrate explanation." },
      { id: "c3", number: 3, title: "Grammatical borrowing without lexical borrowing", preview: "Speakers borrow classifier structure while resisting vocabulary borrowing, an asymmetry the book's fieldwork data makes newly visible." },
      { id: "c4", number: 4, title: "A century of missionary transcription records", preview: "Nineteenth-century missionary phonetic transcriptions, digitized here for the first time, extend the study's timeline by eighty years." },
    ],
  },
  {
    id: "b-memory-across-cultures",
    slug: "memory-across-cultures",
    title: "Memory Across Cultures: Narrative Tradition and the Autobiographical Mind",
    authorIds: ["priya-nandakumar"],
    isbn: "978-1-64829-127-4",
    year: 2025,
    pages: 224,
    language: "English",
    publisher: "Porcelain Publishing",
    description:
      "An experimental psychology monograph arguing that narrative tradition, not chronological development, is the primary driver of autobiographical memory structure.",
    coverSeed: "book-memory-across-cultures",
    subjectTags: ["Cognitive science", "Cross-cultural psychology"],
    popularity: 7130,
    chapters: [
      { id: "c1", number: 1, title: "The developmental assumption and its limits", preview: "Standard developmental accounts of autobiographical memory struggle to explain the study's four-cohort comparison." },
      { id: "c2", number: 2, title: "Oral tradition households versus written-record households", preview: "Households organized around oral versus written record-keeping show measurably different memory density by age eight." },
      { id: "c3", number: 3, title: "Re-testing the classic reminiscence bump", preview: "The well-known reminiscence bump shifts by nearly a decade depending on a culture's dominant narrative form." },
    ],
  },
  {
    id: "b-tideline-governance",
    slug: "tideline-governance",
    title: "Tideline Governance: Rights, Reefs, and Regulation",
    authorIds: ["daniel-okafor", "arjun-mehta"],
    isbn: "978-1-64829-133-5",
    year: 2026,
    pages: 296,
    language: "English",
    publisher: "Porcelain Publishing",
    description:
      "A comparative policy study of artisanal fishing rights and reef governance across West African and Southeast Asian coastal economies.",
    coverSeed: "book-tideline-governance",
    subjectTags: ["Environmental policy", "Development economics"],
    popularity: 1980,
    chapters: [
      { id: "c1", number: 1, title: "Overlapping claims, underlapping law", preview: "Colonial-era maritime boundaries left overlapping claims that postcolonial law never fully resolved." },
      { id: "c2", number: 2, title: "The Ghana-Philippines comparison", preview: "Two coastlines, two legal traditions, and one shared arbitration proposal this book develops in full." },
      { id: "c3", number: 3, title: "Reef health as a governance indicator", preview: "Reef biomass data tracks governance quality more reliably than any single legal metric the authors tested." },
      { id: "c4", number: 4, title: "A model arbitration framework", preview: "The book closes with a proposed framework now under review by two regional fisheries commissions." },
    ],
  },
  {
    id: "b-credential-economy",
    slug: "the-credential-economy",
    title: "The Credential Economy: Access and Inflation in Higher Education",
    authorIds: ["linh-pham", "soo-min-kang"],
    isbn: "978-1-64829-140-3",
    year: 2024,
    pages: 254,
    language: "English",
    publisher: "Porcelain Publishing",
    description:
      "A fifteen-year cohort study of credential inflation and first-generation access across Vietnamese and South Korean university systems.",
    coverSeed: "book-the-credential-economy",
    subjectTags: ["Sociology of education", "Social mobility"],
    popularity: 2640,
    chapters: [
      { id: "c1", number: 1, title: "Fifteen years of rising entry requirements", preview: "Entry requirements rose steadily across both systems even as access programs expanded in parallel." },
      { id: "c2", number: 2, title: "First-generation entrants and the widening gap", preview: "First-generation entrants closed the enrollment gap but not the credential-value gap the book documents." },
      { id: "c3", number: 3, title: "What access programs actually change", preview: "A closer look at which access interventions moved outcomes, and which mostly moved enrollment statistics." },
    ],
  },
  {
    id: "b-archival-korea",
    slug: "archival-korea",
    title: "Archival Korea: Diplomatic Method in the Twentieth Century",
    authorIds: ["soo-min-kang"],
    isbn: "978-1-64829-152-6",
    year: 2023,
    pages: 340,
    language: "English",
    publisher: "Porcelain Publishing",
    description:
      "A methodological history of twentieth-century Korean diplomatic archives, examining how record-keeping practice itself shaped later historical interpretation.",
    coverSeed: "book-archival-korea",
    subjectTags: ["History", "Archival methodology"],
    popularity: 4055,
    chapters: [
      { id: "c1", number: 1, title: "The archive as a diplomatic instrument", preview: "Record-keeping practice was never neutral; this chapter traces how filing decisions shaped later diplomatic interpretation." },
      { id: "c2", number: 2, title: "Postwar reconstruction of lost records", preview: "Reconstructed records after wartime losses introduce gaps historians have long underestimated." },
      { id: "c3", number: 3, title: "Digitization and its interpretive risks", preview: "Recent digitization projects solve access problems while introducing new interpretive risks this chapter names directly." },
    ],
  },
];

export function getBook(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}

export function latestBooks(count: number): Book[] {
  return [...books].sort((a, b) => b.year - a.year).slice(0, count);
}
