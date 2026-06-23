import Link from "next/link";

// ── Layout container ──────────────────────────────────────────────────────
export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto max-w-[1240px] px-[clamp(1.25rem,4vw,2.5rem)] ${className}`}
    >
      {children}
    </div>
  );
}

// ── Section header (eyebrow + serif title + optional intro) ───────────────
export function SectionHeader({
  eyebrow,
  title,
  intro,
  action,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6 border-b border-hairline pb-6">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.05] text-ink">
          {title}
        </h2>
        {intro && <p className="mt-4 max-w-prose text-body">{intro}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="eyebrow link-underline whitespace-nowrap text-ink"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}

// ── Meta row (topic • authors • date) ─────────────────────────────────────
export function MetaRow({ items }: { items: (string | undefined)[] }) {
  const shown = items.filter(Boolean) as string[];
  return (
    <p className="eyebrow flex flex-wrap items-center gap-x-2 gap-y-1">
      {shown.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden className="text-hairline">·</span>}
          {item}
        </span>
      ))}
    </p>
  );
}

// ── Generative cover art (deterministic — same seed → same cover) ─────────
// Restrained, on-brand placeholder covers: pale tint + a subtle accent motif.
// Pure + stable (no Math.random / Date) so SSR and client always agree, and a
// given item shows an identical cover on the home page and its detail page.
const COVER_ACCENTS = [
  "#36506b", // cobalt
  "#6b7d6e", // celadon
  "#8a6f5c", // clay
  "#5b5f6b", // slate
  "#6b5b66", // plum
];
const COVER_MOTIFS = [
  "rules",
  "grid",
  "dots",
  "hatch",
  "arcs",
  "wave",
] as const;
type CoverMotif = (typeof COVER_MOTIFS)[number];

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function coverArt(seed: string): { accent: string; motif: CoverMotif } {
  const h = hashSeed(seed);
  return {
    accent: COVER_ACCENTS[h % COVER_ACCENTS.length],
    motif: COVER_MOTIFS[(h >>> 8) % COVER_MOTIFS.length],
  };
}

function CoverMotifSvg({ id, motif, color }: { id: string; motif: CoverMotif; color: string }) {
  // Each motif tiles via an SVG <pattern>; drawn in the accent color at low opacity.
  const def = (() => {
    switch (motif) {
      case "rules":
        return (
          <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="14" stroke={color} strokeWidth="1" />
          </pattern>
        );
      case "grid":
        return (
          <pattern id={id} width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M22 0H0V22" fill="none" stroke={color} strokeWidth="1" />
          </pattern>
        );
      case "dots":
        return (
          <pattern id={id} width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.4" fill={color} />
          </pattern>
        );
      case "hatch":
        return (
          <pattern
            id={id}
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="16" stroke={color} strokeWidth="1" />
          </pattern>
        );
      case "arcs":
        return (
          <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="40" r="10" fill="none" stroke={color} strokeWidth="1" />
            <circle cx="20" cy="40" r="18" fill="none" stroke={color} strokeWidth="1" />
            <circle cx="20" cy="40" r="26" fill="none" stroke={color} strokeWidth="1" />
          </pattern>
        );
      case "wave":
        return (
          <pattern id={id} width="36" height="18" patternUnits="userSpaceOnUse">
            <path
              d="M0 14 Q 9 4 18 14 T 36 14"
              fill="none"
              stroke={color}
              strokeWidth="1"
            />
          </pattern>
        );
    }
  })();

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
    >
      <defs>{def}</defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

// ── Generative cover plate (color + pattern + type, on brand) ─────────────
export function CoverPlate({
  title,
  kicker,
  tint,
  byline,
  seed,
  imprint = "Porcelaine",
  ratio = "aspect-[3/4]",
}: {
  title: string;
  kicker?: string;
  tint: string;
  byline?: string;
  /** stable string → deterministic pattern + accent; defaults to title */
  seed?: string;
  imprint?: string;
  ratio?: string;
}) {
  const { accent, motif } = coverArt(seed ?? title);
  // Unique-but-deterministic pattern id so multiple covers can share a page.
  const patternId = `cover-${motif}-${hashSeed(`${seed ?? title}|${motif}`).toString(36)}`;

  return (
    <div
      className={`relative ${ratio} w-full overflow-hidden border border-hairline transition-transform duration-[var(--dur)] ease-[var(--ease-porcelain)] group-hover:scale-[1.02]`}
      style={{ backgroundColor: tint }}
    >
      <CoverMotifSvg id={patternId} motif={motif} color={accent} />

      {/* inset printed-cover frame */}
      <div aria-hidden className="pointer-events-none absolute inset-3 border border-ink/10" />

      <div className="absolute inset-0 flex flex-col justify-between p-6">
        <div className="flex items-baseline justify-between gap-3">
          <span
            className="eyebrow text-muted"
            style={{ color: accent }}
          >
            {imprint}
          </span>
          {kicker && <span className="eyebrow text-muted">{kicker}</span>}
        </div>
        <div>
          <span className="font-serif text-[clamp(1.5rem,2.2vw,2.1rem)] leading-[1.08] text-ink">
            {title}
          </span>
          {byline && (
            <span className="mt-3 block text-xs leading-snug text-muted">— {byline}</span>
          )}
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 bottom-6 h-px bg-ink/15"
      />
    </div>
  );
}

// ── Tag / topic pill (restrained, hairline) ───────────────────────────────
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="eyebrow inline-block border border-hairline px-3 py-1 text-muted">
      {children}
    </span>
  );
}

// ── Breadcrumbs ───────────────────────────────────────────────────────────
export function Breadcrumbs({
  trail,
}: {
  trail: { href?: string; label: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="eyebrow mb-8 flex flex-wrap gap-2">
      {trail.map((node, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden className="text-hairline">/</span>}
          {node.href ? (
            <Link href={node.href} className="text-muted hover:text-ink link-underline">
              {node.label}
            </Link>
          ) : (
            <span className="text-ink">{node.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// ── Ink CTA / outline link button ─────────────────────────────────────────
export function InkButton({
  href,
  children,
  variant = "outline",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "outline" | "solid";
}) {
  const base =
    "eyebrow inline-flex items-center justify-center px-6 py-3 transition-colors duration-[var(--dur)]";
  const styles =
    variant === "solid"
      ? "bg-ink text-porcelain hover:bg-body"
      : "border border-ink text-ink hover:bg-ink hover:text-porcelain";
  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}

// ── Page header band ──────────────────────────────────────────────────────
export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <Container className="pt-20 pb-12 md:pt-28">
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h1 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] text-ink">
        {title}
      </h1>
      {intro && (
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-body">{intro}</p>
      )}
    </Container>
  );
}
