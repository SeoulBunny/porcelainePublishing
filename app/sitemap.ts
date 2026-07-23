import type { MetadataRoute } from "next";
import { journals } from "@/lib/data/journals";
import { books } from "@/lib/data/books";

const SITE_URL = "https://porcelainpublishing.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/journals`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/books`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/auth/signup`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/auth/login`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const journalRoutes: MetadataRoute.Sitemap = journals.map((j) => ({
    url: `${SITE_URL}/journals/${j.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const bookRoutes: MetadataRoute.Sitemap = books.map((b) => ({
    url: `${SITE_URL}/books/${b.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...journalRoutes, ...bookRoutes];
}
