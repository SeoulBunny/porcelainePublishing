import type { Metadata } from "next";
import { Container, InkButton, PageHeader } from "@/app/components/ui";

export const metadata: Metadata = {
  title: "Collaborations",
  description: "Institutions and presses Porcelaine Publishing works with.",
};

export default function CollaborationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Partners"
        title="Collaborations"
        intro="Porcelaine works with universities, libraries, and independent presses around the world."
      />
      <Container className="pb-24">
        <div className="border-t border-hairline pt-16 text-center">
          <p className="mx-auto max-w-xl font-serif text-[clamp(1.5rem,3vw,2.25rem)] leading-snug text-ink">
            Our partners will be listed here soon.
          </p>
          <p className="mx-auto mt-5 max-w-md text-body">
            We are preparing this page. If your institution or press would like to
            collaborate with Porcelaine, we would be glad to hear from you.
          </p>
          <div className="mt-10 flex justify-center">
            <InkButton href="/contact">Get in touch</InkButton>
          </div>
        </div>
      </Container>
    </>
  );
}
