// AI-generated covers for books and journals, stored locally for efficiency.
// Bump COVER_VERSION whenever public/covers/*.png is regenerated -- the
// filenames don't change, so without a cache-busting query param both the
// browser and Next's image optimizer (.next/cache/images) keep serving the
// previous bytes indefinitely for the same URL.
const COVER_VERSION = "2";

export function coverImage(seed: string, width = 480, height = 720): string {
  return `/covers/${seed}.png?v=${COVER_VERSION}`;
}

export function portraitImage(seed: string, size = 320): string {
  return `https://picsum.photos/seed/${seed}/${size}/${size}`;
}

export function editorialImage(seed: string, width = 1100, height = 1400): string {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}
