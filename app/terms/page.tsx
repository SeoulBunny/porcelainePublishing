import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of Porcelain Publishing.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  // renders data-section="terms-toc" and data-section="terms-content" via LegalPage's props
  return (
    <LegalPage
      tocSectionId="terms-toc"
      contentSectionId="terms-content"
      title="Terms of Service"
      intro="These terms govern your access to and use of Porcelain Publishing. Please read them before creating an account."
      lastUpdated="July 1, 2026"
      contactEmail="legal@porcelainpublishing.example.com"
      sections={[
        {
          id: "introduction",
          label: "Introduction",
          body: (
            <p>
              These Terms of Service (&quot;Terms&quot;) form an agreement between you and
              Porcelain Publishing governing your use of the site, including browsing, account
              creation, and reading access. Creating an account or continuing to use the site
              means you accept these Terms.
            </p>
          ),
        },
        {
          id: "definitions",
          label: "Definitions",
          body: (
            <p>
              &quot;Content&quot; means journals, books, articles, chapters, and related metadata
              published on the platform. &quot;Account&quot; means a registered user profile.
              &quot;Contributor&quot; means an editor, writer, or reviewer credited on the
              platform.
            </p>
          ),
        },
        {
          id: "user-responsibilities",
          label: "User responsibilities",
          body: (
            <p>
              You are responsible for keeping your account credentials confidential and for all
              activity under your account. You agree to provide accurate registration information
              and to notify us promptly of any unauthorized use of your account.
            </p>
          ),
        },
        {
          id: "ip-rights",
          label: "Intellectual property rights",
          body: (
            <p>
              All content on Porcelain Publishing, including journal articles, book chapters, and
              site design, is protected by copyright and remains the property of its respective
              authors and Porcelain Publishing. You may read and share links to content, but you
              may not reproduce, redistribute, or create derivative works without permission.
            </p>
          ),
        },
        {
          id: "access-limitations",
          label: "Read-only access limitations",
          body: (
            <p>
              An account grants read access to published content for personal, non-commercial
              research and reading. Automated scraping, bulk downloading, or reselling access is
              not permitted and may result in account suspension.
            </p>
          ),
        },
        {
          id: "disclaimers",
          label: "Disclaimers",
          body: (
            <p>
              Content is provided &quot;as is.&quot; While our editorial process is rigorous, we
              do not guarantee that any published research is free of error, and Porcelain
              Publishing is not liable for decisions made in reliance on published content.
            </p>
          ),
        },
        {
          id: "changes-to-terms",
          label: "Changes to these terms",
          body: (
            <p>
              We may update these Terms from time to time. Material changes will be noted on this
              page with an updated &quot;last updated&quot; date. Continued use of the site after
              a change constitutes acceptance of the revised Terms.
            </p>
          ),
        },
        {
          id: "governing-law",
          label: "Governing law",
          body: (
            <p>
              These Terms are governed by the laws of the Republic of Korea, without regard to its
              conflict-of-law provisions. Any dispute arising from these Terms will be resolved in
              the courts of Seoul.
            </p>
          ),
        },
      ]}
    />
  );
}
