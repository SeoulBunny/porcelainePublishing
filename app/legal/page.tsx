import type { Metadata } from "next";
import { Container, PageHeader } from "@/app/components/ui";

export const metadata: Metadata = {
  title: "Privacy & Rights",
  description:
    "Privacy policy, data handling, copyright, and licensing for Porcelaine Publishing.",
};

const sections = [
  {
    id: "privacy",
    heading: "Privacy",
    body: [
      "Porcelaine Publishing collects the minimum personal data needed to operate the catalogue and to keep readers and contributors informed. When you request access or subscribe, we store your name and email address. When you contribute work, we additionally store the account and submission data needed to manage editorial review.",
      "We do not sell personal data. We do not share it with third parties except where strictly required to deliver a service you have requested (for example, an email-delivery provider) or where required by law.",
    ],
  },
  {
    id: "data",
    heading: "What we store, and why",
    list: [
      "Contact details (name, email) — to provide access and send occasional editorial notes.",
      "Account data (for contributors) — to authenticate writers, editors, and administrators.",
      "Submission and review data — to manage peer review and publication.",
      "Aggregate, non-identifying usage statistics — to understand how the catalogue is used.",
    ],
  },
  {
    id: "your-rights",
    heading: "Your rights",
    body: [
      "You may request access to the personal data we hold about you, ask us to correct it, or ask us to delete it. You may unsubscribe from editorial notes at any time using the link in any message, or by writing to the editorial office.",
      "Requests are handled in line with the Personal Information Protection Act (PIPA) of the Republic of Korea and, where applicable, the EU General Data Protection Regulation (GDPR).",
    ],
  },
  {
    id: "copyright",
    heading: "Copyright & licensing",
    body: [
      "Unless otherwise stated, copyright in each article and book remains with its author(s). Porcelaine Publishing holds a licence to publish and distribute the work.",
      "Where an article is published under an open licence (for example, Creative Commons CC BY 4.0), the applicable licence is stated on the article itself. Reuse beyond the terms of that licence requires the permission of the copyright holder.",
    ],
  },
  {
    id: "cookies",
    heading: "Cookies",
    body: [
      "This site uses only the cookies necessary for it to function and, where you consent, anonymous analytics. We do not use advertising or cross-site tracking cookies.",
    ],
  },
  {
    id: "contact",
    heading: "Contact",
    body: [
      "Questions about privacy, data, or rights may be sent to the editorial office at rights@porcelaine.example, or by post to Porcelaine Publishing, Jongno-gu, Seoul, Republic of Korea.",
    ],
  },
];

export default function LegalPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy & Rights"
        title="Privacy & Rights"
        intro="How we handle personal data, and how copyright and licensing work across the catalogue."
      />
      <Container className="pb-24">
        <div className="grid gap-12 border-t border-hairline pt-12 md:grid-cols-[220px_1fr] md:gap-16">
          {/* contents */}
          <nav aria-label="On this page" className="md:sticky md:top-28 md:self-start">
            <h2 className="eyebrow mb-4">Contents</h2>
            <ul className="space-y-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-sm text-muted hover:text-ink link-underline"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
            <p className="eyebrow mt-8">Last updated June 2026</p>
          </nav>

          <div className="max-w-[66ch] space-y-14">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="font-serif text-2xl text-ink">{s.heading}</h2>
                {s.body?.map((p, i) => (
                  <p key={i} className="mt-4 leading-relaxed text-body">
                    {p}
                  </p>
                ))}
                {s.list && (
                  <ul className="mt-4 space-y-2">
                    {s.list.map((item, i) => (
                      <li
                        key={i}
                        className="border-l border-hairline pl-4 leading-relaxed text-body"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
