import type { Writer } from "@/lib/types";

export const writers: Writer[] = [
  {
    id: "hana-seo",
    name: "Hana Seo",
    role: "Editor-in-Chief",
    discipline: "Comparative Linguistics",
    bio: "Hana leads Porcelain's editorial board from Seoul, with two decades reviewing East Asian sociolinguistics scholarship before founding the press in 2014.",
    avatarSeed: "porcelain-writer-hana-seo",
    social: { site: "https://example.com/hana-seo", twitter: "https://x.com/hanaseo" },
  },
  {
    id: "wei-zhang",
    name: "Wei Zhang",
    role: "Senior Editor, Materials Science",
    discipline: "Ceramic & Materials Engineering",
    bio: "Wei's own doctoral work on kiln thermodynamics shaped the press's material-culture publishing line; he now edits its physical sciences catalog.",
    avatarSeed: "porcelain-writer-wei-zhang",
    social: { linkedin: "https://linkedin.com/in/weizhang" },
  },
  {
    id: "priya-nandakumar",
    name: "Priya Nandakumar",
    role: "Associate Editor, Cognitive Science",
    discipline: "Cognitive & Behavioral Science",
    bio: "Priya's research on cross-cultural memory formation anchors her editorial focus on cognitive science and experimental psychology submissions.",
    avatarSeed: "porcelain-writer-priya-nandakumar",
    social: { site: "https://example.com/priya-nandakumar" },
  },
  {
    id: "daniel-okafor",
    name: "Daniel Okafor",
    role: "Contributing Scholar",
    discipline: "Environmental Policy",
    bio: "Daniel writes on coastal resource governance across West Africa and East Asia, contributing regularly to the press's policy journals.",
    avatarSeed: "porcelain-writer-daniel-okafor",
    social: { twitter: "https://x.com/danielokafor" },
  },
  {
    id: "mireille-tanaka",
    name: "Mireille Tanaka",
    role: "Senior Editor, Art History",
    discipline: "Art History & Material Culture",
    bio: "Mireille's editorial line traces decorative and applied arts across trade routes, with a particular focus on porcelain and lacquerware provenance.",
    avatarSeed: "porcelain-writer-mireille-tanaka",
    social: { site: "https://example.com/mireille-tanaka" },
  },
  {
    id: "arjun-mehta",
    name: "Arjun Mehta",
    role: "Associate Editor, Economics",
    discipline: "Development Economics",
    bio: "Arjun's fieldwork on regional trade corridors informs his editorial oversight of Porcelain's economics and public policy submissions.",
    avatarSeed: "porcelain-writer-arjun-mehta",
    social: { linkedin: "https://linkedin.com/in/arjunmehta" },
  },
  {
    id: "linh-pham",
    name: "Linh Pham",
    role: "Contributing Scholar",
    discipline: "Sociology of Education",
    bio: "Linh studies higher-education access across Southeast Asia and reviews submissions to the press's education and social-policy line.",
    avatarSeed: "porcelain-writer-linh-pham",
    social: { site: "https://example.com/linh-pham" },
  },
  {
    id: "soo-min-kang",
    name: "Soo-min Kang",
    role: "Senior Editor, History",
    discipline: "Modern East Asian History",
    bio: "Soo-min's editorial work spans twentieth-century diplomatic and economic history, with particular attention to archival methodology.",
    avatarSeed: "porcelain-writer-soo-min-kang",
    social: { twitter: "https://x.com/soominkang" },
  },
];

export function getWriter(id: string): Writer | undefined {
  return writers.find((w) => w.id === id);
}
