import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Porcelain Publishing collects, uses, and protects your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  // renders data-section="privacy-toc" and data-section="privacy-content" via LegalPage's props
  return (
    <LegalPage
      tocSectionId="privacy-toc"
      contentSectionId="privacy-content"
      title="Privacy Policy"
      intro="This policy explains what information Porcelain Publishing collects when you use the site, how we use it, and the choices available to you."
      lastUpdated="July 1, 2026"
      contactEmail="privacy@porcelainpublishing.example.com"
      sections={[
        {
          id: "introduction",
          label: "Introduction",
          body: (
            <>
              <p>
                Porcelain Publishing (&quot;we,&quot; &quot;us&quot;) operates a platform for
                discovering peer-reviewed journals and scholarly books. This policy applies to
                everyone who visits the site or creates an account, regardless of location.
              </p>
              <p>
                By using Porcelain Publishing, you agree to the collection and use of information
                as described here. If you do not agree, please do not use the site.
              </p>
            </>
          ),
        },
        {
          id: "information-collected",
          label: "Information we collect",
          body: (
            <>
              <p>We collect two categories of information:</p>
              <p>
                <strong className="text-ink">Account information.</strong> When you create an
                account, we collect your name, email address, and a hashed version of your
                password. We never store passwords in plain text.
              </p>
              <p>
                <strong className="text-ink">Usage information.</strong> With your consent, we
                collect minimal analytics data: page views and interaction events (such as which
                journals or books you view). We do not track you across other websites.
              </p>
            </>
          ),
        },
        {
          id: "how-information-is-used",
          label: "How we use your information",
          body: (
            <p>
              Account information authenticates your sessions and lets you save journals and
              books to your shelf. Usage information helps us understand which content is useful
              so we can prioritize future publishing. We do not sell your data, and we do not
              share it with third parties for their own marketing purposes.
            </p>
          ),
        },
        {
          id: "data-security",
          label: "Data security",
          body: (
            <p>
              We use industry-standard encryption in transit and at rest, and we limit internal
              access to account data to the small editorial and engineering team that operates
              the platform. No method of transmission or storage is perfectly secure, but we work
              to protect your information to a standard consistent with its sensitivity.
            </p>
          ),
        },
        {
          id: "user-rights",
          label: "Your rights",
          body: (
            <>
              <p>
                If you are located in the European Economic Area, the United Kingdom, or a
                jurisdiction with similar protections, you have the right to access, correct, or
                delete your personal data, and to object to or restrict certain processing.
              </p>
              <p>
                To exercise any of these rights, including a full account and data deletion
                request, email us at the address below. We respond to verified requests within 30
                days.
              </p>
            </>
          ),
        },
        {
          id: "cookie-policy",
          label: "Cookie policy",
          body: (
            <>
              <p>
                We use essential cookies to keep you signed in and to remember your cookie
                preference. With your consent, we also use a small number of analytics cookies to
                understand aggregate site usage.
              </p>
              <p>
                You can accept all cookies, restrict to essential-only, or dismiss the consent
                banner (which defaults to essential-only) the first time you visit. You can change
                this choice at any time by clearing your browser&apos;s local storage for this site.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
