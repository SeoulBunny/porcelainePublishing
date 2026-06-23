/** Grayscale initials plate in place of a portrait — keeps the catalogue
 *  type-led and consistent with the porcelain direction. */
export function Monogram({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");
  return (
    <div
      className={`flex aspect-square w-full items-center justify-center border border-hairline bg-surface ${className}`}
      aria-hidden
    >
      <span className="font-serif text-[clamp(2rem,4vw,3rem)] text-muted">
        {initials}
      </span>
    </div>
  );
}
