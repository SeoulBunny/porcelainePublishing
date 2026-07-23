// Adapted from the user's minimal centered footer (ec6625dc): same centered
// wordmark / link row / social row / copyright shape, rebuilt without the
// MynaUI package dependencies. This is one of the two zones permitted a
// non-porcelain-white fill (design-tokens.json named_rules "Depth confined to
// two zones") — secondary/slate fill with porcelain-tinted text, so the page
// closes with a designed handoff rather than fading out flat.

import Link from "next/link";
import { FaFacebook, FaLinkedin, FaWeixin, FaXTwitter } from "react-icons/fa6";
import { VesselMark } from "@/components/shared/VesselMark";

const QUICK_LINKS = [
  { href: "/about", label: "About" },
  { href: "/journals", label: "Journals" },
  { href: "/books", label: "Books" },
  { href: "/auth/signup", label: "Sign up" },
  { href: "/auth/login", label: "Log in" },
  { href: "/admin", label: "Admin" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of service" },
];

const SOCIALS = [
  { href: "https://x.com/porcelainpress", label: "Porcelain Publishing on X", Icon: FaXTwitter },
  { href: "https://linkedin.com/company/porcelainpress", label: "Porcelain Publishing on LinkedIn", Icon: FaLinkedin },
  { href: "https://facebook.com/porcelainpress", label: "Porcelain Publishing on Facebook", Icon: FaFacebook },
  { href: "https://weixin.qq.com/porcelainpress", label: "Porcelain Publishing on WeChat", Icon: FaWeixin },
];

export function Footer() {
  return (
    <footer data-section="global-footer" className="bg-slate text-porcelain-soft">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <Link href="/" className="flex items-center gap-2 text-porcelain-soft">
            <VesselMark className="h-7 w-7 text-porcelain-soft/80" />
            <span className="font-heading text-lg tracking-[-0.01em]">Porcelain Publishing</span>
          </Link>

          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="kiln-hover relative text-porcelain-soft/75 hover:text-porcelain-soft"
              >
                {link.label}
                <span className="kiln-underline absolute inset-x-0 -bottom-0.5 block h-px" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="text-porcelain-soft/60 opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100"
              >
                <Icon className="h-5 w-5" aria-hidden />
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-1 text-xs text-porcelain-soft/80">
            <p>Seoul, South Korea</p>
            <p>&copy; {new Date().getFullYear()} Porcelain Publishing. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
