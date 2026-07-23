import type { Metadata, Viewport } from "next";
import { Fira_Code, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import { CookieConsent } from "@/components/shared/CookieConsent";
import { MockAuthProvider } from "@/lib/auth/mock-auth";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://porcelainpublishing.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Porcelain Publishing",
    template: "%s | Porcelain Publishing",
  },
  description:
    "Porcelain Publishing is a gallery-quality platform for discovering peer-reviewed journals and scholarly books across the humanities and sciences.",
  openGraph: {
    siteName: "Porcelain Publishing",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#fefdfb",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Porcelain Publishing",
  url: SITE_URL,
  description:
    "Porcelain Publishing is a gallery-quality platform for discovering peer-reviewed journals and scholarly books.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable} ${firaCode.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-porcelain text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <noscript>
          <style>{`[data-reveal-item] { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-sage focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-sage-ink"
        >
          Skip to content
        </a>
        <MockAuthProvider>
          <Nav />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </MockAuthProvider>
      </body>
    </html>
  );
}
