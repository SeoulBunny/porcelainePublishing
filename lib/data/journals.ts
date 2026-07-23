import type { Journal } from "@/lib/types";

export const journals: Journal[] = [
  {
    id: "j-comparative-linguistics",
    slug: "quarterly-comparative-linguistics",
    title: "Quarterly Journal of Comparative Linguistics",
    issn: "2691-4108",
    frequency: "Quarterly",
    description:
      "Peer-reviewed research on syntax, semantics, and language contact across East and Southeast Asian language families, with an emphasis on fieldwork-derived data.",
    coverSeed: "journal-quarterly-comparative-linguistics",
    topics: ["Syntax", "Language contact", "Sociolinguistics", "Fieldwork methods"],
    editorIds: ["hana-seo", "linh-pham"],
    issues: [
      {
        volume: 12,
        number: 3,
        publishedAt: "2026-06-01",
        articles: [
          {
            id: "a-linguistics-1",
            title: "Tone sandhi variation across three generations of Jeju speakers",
            authorIds: ["hana-seo"],
            abstract:
              "A longitudinal acoustic study tracking tone sandhi drift in Jeju dialect speakers born between 1945 and 2005, arguing for contact-induced leveling rather than internal simplification.",
            publishedAt: "2026-06-01",
            doi: "10.5872/qjcl.2026.12.3.01",
          },
          {
            id: "a-linguistics-2",
            title: "Classifier ellipsis in spoken Cantonese-Mandarin code-switching",
            authorIds: ["linh-pham"],
            abstract:
              "Corpus evidence from Guangzhou bilinguals showing classifier omission patterns that diverge from monolingual production, with implications for bilingual grammar architecture.",
            publishedAt: "2026-06-01",
            doi: "10.5872/qjcl.2026.12.3.02",
          },
          {
            id: "a-linguistics-3",
            title: "Documenting numeral classifiers in endangered Formosan languages",
            authorIds: ["hana-seo", "linh-pham"],
            abstract:
              "Fieldwork among the last fluent speakers of two Formosan languages records classifier systems at risk of loss within a generation.",
            publishedAt: "2026-03-01",
            doi: "10.5872/qjcl.2026.12.2.04",
          },
        ],
      },
    ],
  },
  {
    id: "j-ceramic-materials",
    slug: "annals-of-ceramic-materials",
    title: "Annals of Ceramic Materials Science",
    issn: "2778-0341",
    frequency: "Bimonthly",
    description:
      "Research spanning kiln thermodynamics, glaze chemistry, and historical firing technique reconstruction, bridging materials engineering and archaeometry.",
    coverSeed: "journal-annals-of-ceramic-materials",
    topics: ["Glaze chemistry", "Kiln thermodynamics", "Archaeometry", "Firing technique"],
    editorIds: ["wei-zhang", "mireille-tanaka"],
    issues: [
      {
        volume: 8,
        number: 1,
        publishedAt: "2026-05-15",
        articles: [
          {
            id: "a-ceramics-1",
            title: "Reconstructing Goryeo celadon firing curves from kiln-wall residue",
            authorIds: ["wei-zhang"],
            abstract:
              "Thermal analysis of excavated kiln walls near Gangjin reconstructs firing atmosphere and peak temperature with tighter error bounds than prior estimates.",
            publishedAt: "2026-05-15",
            doi: "10.5872/acms.2026.8.1.01",
          },
          {
            id: "a-ceramics-2",
            title: "Iron-reduction glaze chemistry in Song and Joseon-era wares compared",
            authorIds: ["mireille-tanaka", "wei-zhang"],
            abstract:
              "Comparative XRF analysis of celadon and buncheong glazes identifies distinct iron-reduction pathways despite shared technical ancestry.",
            publishedAt: "2026-05-15",
            doi: "10.5872/acms.2026.8.1.02",
          },
        ],
      },
    ],
  },
  {
    id: "j-cognitive-science",
    slug: "journal-of-applied-cognitive-science",
    title: "Journal of Applied Cognitive Science",
    issn: "2810-2256",
    frequency: "Quarterly",
    description:
      "Experimental and cross-cultural research on memory, attention, and decision-making, prioritizing replication and pre-registered study designs.",
    coverSeed: "journal-journal-of-applied-cognitive-science",
    topics: ["Memory", "Cross-cultural cognition", "Decision-making", "Replication"],
    editorIds: ["priya-nandakumar"],
    issues: [
      {
        volume: 5,
        number: 2,
        publishedAt: "2026-04-10",
        articles: [
          {
            id: "a-cognitive-1",
            title: "Autobiographical memory density differs by narrative culture, not age",
            authorIds: ["priya-nandakumar"],
            abstract:
              "A pre-registered comparison across four cultural cohorts finds narrative tradition, not chronological age, predicts autobiographical memory density.",
            publishedAt: "2026-04-10",
            doi: "10.5872/jacs.2026.5.2.01",
          },
          {
            id: "a-cognitive-2",
            title: "Replicating the delay-discounting effect in bilingual decision tasks",
            authorIds: ["priya-nandakumar", "arjun-mehta"],
            abstract:
              "A direct replication with an added bilingual condition finds the classic delay-discounting effect attenuates when tasks are presented in a second language.",
            publishedAt: "2026-04-10",
            doi: "10.5872/jacs.2026.5.2.02",
          },
        ],
      },
    ],
  },
  {
    id: "j-environmental-policy",
    slug: "coastal-and-environmental-policy-review",
    title: "Coastal and Environmental Policy Review",
    issn: "2933-7710",
    frequency: "Triannual",
    description:
      "Policy-facing research on coastal resource governance, climate adaptation, and regulatory frameworks across Pacific and West African economies.",
    coverSeed: "journal-coastal-and-environmental-policy-review",
    topics: ["Coastal governance", "Climate adaptation", "Fisheries policy", "Regulation"],
    editorIds: ["daniel-okafor", "arjun-mehta"],
    issues: [
      {
        volume: 9,
        number: 1,
        publishedAt: "2026-02-20",
        articles: [
          {
            id: "a-environment-1",
            title: "Artisanal fishing rights under overlapping coastal jurisdictions",
            authorIds: ["daniel-okafor"],
            abstract:
              "A comparative legal analysis of artisanal fishing rights disputes in Ghana and the Philippines proposes a shared arbitration framework.",
            publishedAt: "2026-02-20",
            doi: "10.5872/cepr.2026.9.1.01",
          },
        ],
      },
    ],
  },
  {
    id: "j-development-economics",
    slug: "journal-of-regional-development-economics",
    title: "Journal of Regional Development Economics",
    issn: "2705-9012",
    frequency: "Quarterly",
    description:
      "Empirical research on trade corridors, informal labor markets, and regional growth policy, with a data-transparency requirement for all submissions.",
    coverSeed: "journal-journal-of-regional-development-economics",
    topics: ["Trade corridors", "Informal labor", "Regional growth", "Data transparency"],
    editorIds: ["arjun-mehta"],
    issues: [
      {
        volume: 14,
        number: 4,
        publishedAt: "2026-01-12",
        articles: [
          {
            id: "a-economics-1",
            title: "Informal labor absorption along the Mekong logistics corridor",
            authorIds: ["arjun-mehta"],
            abstract:
              "Panel data from three border crossings shows informal labor absorbing over 40% of new logistics-sector demand, with wage effects varying by nationality.",
            publishedAt: "2026-01-12",
            doi: "10.5872/jrde.2026.14.4.01",
          },
        ],
      },
    ],
  },
  {
    id: "j-education-sociology",
    slug: "journal-of-education-and-social-mobility",
    title: "Journal of Education and Social Mobility",
    issn: "2846-5523",
    frequency: "Biannual",
    description:
      "Sociological research on higher-education access, credential inflation, and mobility outcomes across Southeast and East Asian systems.",
    coverSeed: "journal-journal-of-education-and-social-mobility",
    topics: ["Higher-ed access", "Credential inflation", "Mobility outcomes"],
    editorIds: ["linh-pham", "soo-min-kang"],
    issues: [
      {
        volume: 6,
        number: 1,
        publishedAt: "2025-11-05",
        articles: [
          {
            id: "a-education-1",
            title: "Credential inflation and first-generation university entry in Vietnam",
            authorIds: ["linh-pham"],
            abstract:
              "Cohort data spanning fifteen years shows credential requirements rising faster than first-generation entrants can close the gap, despite expanded access programs.",
            publishedAt: "2025-11-05",
            doi: "10.5872/jesm.2025.6.1.01",
          },
        ],
      },
    ],
  },
];

export function getJournal(slug: string): Journal | undefined {
  return journals.find((j) => j.slug === slug);
}

export function latestJournals(count: number): Journal[] {
  return [...journals]
    .sort((a, b) => {
      const aDate = a.issues[0]?.publishedAt ?? "";
      const bDate = b.issues[0]?.publishedAt ?? "";
      return bDate.localeCompare(aDate);
    })
    .slice(0, count);
}
