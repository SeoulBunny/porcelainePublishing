import type { Metadata } from "next";
import { Container, PageHeader } from "@/app/components/ui";
import { EmailCaptureForm } from "@/app/components/email-capture-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Porcelaine Publishing, and request access to the full catalogue.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact"
        intro="For editorial enquiries, rights, and access to the full catalogue."
      />
      <Container className="pb-24">
        <div className="grid gap-16 border-t border-hairline pt-12 md:grid-cols-2">
          <div>
            <h2 className="eyebrow mb-4">Request access</h2>
            <p className="mb-8 max-w-md text-body">
              Leave your details to view the full catalogue and receive occasional
              notes on new editions. We send seldom, and never share your address.
            </p>
            <EmailCaptureForm />
          </div>

          <div className="space-y-10">
            <div>
              <h2 className="eyebrow mb-3">Editorial office</h2>
              <p className="text-body">
                Porcelaine Publishing
                <br />
                Jongno-gu, Seoul
                <br />
                Republic of Korea
              </p>
            </div>
            <div>
              <h2 className="eyebrow mb-3">Email</h2>
              <p className="text-body">
                <a href="mailto:editorial@porcelaine.example" className="link-underline">
                  editorial@porcelaine.example
                </a>
              </p>
            </div>
            <div>
              <h2 className="eyebrow mb-3">For contributors</h2>
              <p className="max-w-md text-body">
                Writers and editors can sign in to the contributor area to submit
                and review work.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
