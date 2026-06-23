// Safe date formatting for catalogue dates. publishedOn is a nullable date
// column, so callers used `new Date(value ?? "")` which renders the literal
// string "Invalid Date" to readers when it's null. This returns "" instead, and
// also guards against any unparseable value.

const DEFAULT_OPTS: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };

export function formatDate(
  value: string | null | undefined,
  opts: Intl.DateTimeFormatOptions = DEFAULT_OPTS,
): string {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", opts);
}
