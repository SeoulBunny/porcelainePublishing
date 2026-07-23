// Shared content types for the mock academic catalog. Porcelain Publishing has
// no backend (brief.md §7: "Backend plans: none planned") — every record here
// is realistic placeholder content standing in for a future CMS/API layer.

export interface Writer {
  id: string;
  name: string;
  role: string;
  discipline: string;
  bio: string;
  avatarSeed: string;
  social: {
    site?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface Article {
  id: string;
  title: string;
  authorIds: string[];
  abstract: string;
  publishedAt: string; // ISO date
  doi: string;
}

export interface Issue {
  volume: number;
  number: number;
  publishedAt: string;
  articles: Article[];
}

export interface Journal {
  id: string;
  slug: string;
  title: string;
  issn: string;
  frequency: string;
  description: string;
  coverSeed: string;
  topics: string[];
  editorIds: string[];
  issues: Issue[];
  popularity: number;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  preview: string;
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  authorIds: string[];
  isbn: string;
  year: number;
  pages: number;
  language: string;
  publisher: string;
  description: string;
  coverSeed: string;
  subjectTags: string[];
  chapters: Chapter[];
  popularity: number;
}
