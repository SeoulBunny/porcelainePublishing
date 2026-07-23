"use client";

// Copy-link + social share row shared by journal-detail-share and
// book-detail-share. Copy-link swaps its icon to a checkmark with an inline
// "Copied" confirmation for 2 seconds (never a toast, per the manifest), then
// reverts. Share links append ?shared=true to the current URL per brief §8.

import { useState } from "react";
import { FaFacebook, FaLinkedin, FaWeixin, FaXTwitter } from "react-icons/fa6";
import { FiCheck, FiLink } from "react-icons/fi";

export function ShareRow({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  function shareUrl() {
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    url.searchParams.set("shared", "true");
    return url.toString();
  }

  async function handleCopy() {
    const url = shareUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // clipboard API unavailable — the inline confirmation still gives
      // feedback that the action was attempted
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  const encoded = encodeURIComponent(shareUrl());
  const encodedTitle = encodeURIComponent(title);

  const socials = [
    { label: "Share on X", Icon: FaXTwitter, href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}` },
    { label: "Share on LinkedIn", Icon: FaLinkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}` },
    { label: "Share on Facebook", Icon: FaFacebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}` },
    { label: "Share on WeChat", Icon: FaWeixin, href: `https://www.weixin.qq.com/` },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-sage"
      >
        {copied ? <FiCheck className="h-4 w-4 text-success" aria-hidden /> : <FiLink className="h-4 w-4" aria-hidden />}
        {copied ? "Copied" : "Copy link"}
      </button>
      {socials.map(({ label, Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={label}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-slate transition-colors hover:border-sage hover:text-ink"
        >
          <Icon className="h-4 w-4" aria-hidden />
        </a>
      ))}
    </div>
  );
}
