// Shared static page header for journals-header / books-header: heading +
// one short intro paragraph, no eyebrow (this page's one-per-three ration is
// spent, if at all, elsewhere on the page).

export function PageHeader({
  sectionId,
  title,
  intro,
}: {
  sectionId: string;
  title: string;
  intro: string;
}) {
  return (
    <section data-section={sectionId} className="bg-porcelain pb-4 pt-16 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl text-ink sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate">{intro}</p>
      </div>
    </section>
  );
}
