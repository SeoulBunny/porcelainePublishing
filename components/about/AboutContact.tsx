// about-contact — Ledger Rail device, last of the page's 6
// sections. Support block: a contact-methods list (email, single South
// Korea location line, social icon row) closing the sequence with the same
// shell used throughout.

import { FaFacebook, FaLinkedin, FaWeixin, FaXTwitter } from "react-icons/fa6";
import { LedgerRail } from "@/components/shared/LedgerRail";

const SOCIALS = [
  { href: "https://x.com/porcelainpress", label: "Porcelain Publishing on X", Icon: FaXTwitter },
  { href: "https://linkedin.com/company/porcelainpress", label: "Porcelain Publishing on LinkedIn", Icon: FaLinkedin },
  { href: "https://facebook.com/porcelainpress", label: "Porcelain Publishing on Facebook", Icon: FaFacebook },
  { href: "https://weixin.qq.com/porcelainpress", label: "Porcelain Publishing on WeChat", Icon: FaWeixin },
];

export function AboutContact() {
  return (
    // renders data-section="about-contact" via LedgerRail's id prop
    <LedgerRail id="about-contact" heading="Get in touch">
      <div className="space-y-4">
        <a
          href="mailto:editorial@porcelainpublishing.example.com"
          className="kiln-hover relative inline-block w-fit text-sm text-ink hover:text-slate"
        >
          editorial@porcelainpublishing.example.com
          <span aria-hidden className="kiln-underline absolute inset-x-0 -bottom-0.5 block h-px" />
        </a>
        <p className="text-sm text-slate">Seoul, South Korea</p>
        <div className="flex items-center gap-4 pt-2">
          {SOCIALS.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              className="text-slate transition-colors hover:text-ink"
            >
              <Icon className="h-5 w-5" aria-hidden />
            </a>
          ))}
        </div>
      </div>
    </LedgerRail>
  );
}
