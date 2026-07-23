// The brand mark: a single-line abstract porcelain vessel silhouette. Used at
// three scales across the site (nav wordmark, footer, and the "unglazed
// vessel" empty state) so the maker's-mark motif reads as one system rather
// than a separate invention per surface. Deliberately plain geometry — no
// glaze-crackle texture, no ornamental flourish, per the brief's ban on heavy
// ornamentation.
export function VesselMark({
  className,
  strokeWidth = 1.4,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M13 4h6l0.6 3.2c2.6 1.6 4.4 4.6 4.4 8.1 0 5.6-4.3 10.2-9.6 10.7l-0.4-0.02c-5.4-0.4-9.6-5-9.6-10.68 0-3.5 1.8-6.5 4.4-8.1L13 4Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12.6 7.4h6.8" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}
