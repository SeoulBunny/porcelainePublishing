import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Ethos } from "@/components/home/Ethos";
import { JournalsShowcase } from "@/components/home/JournalsShowcase";
import { BooksShowcase } from "@/components/home/BooksShowcase";
import { CtaSection } from "@/components/home/CtaSection";
import { Newsletter } from "@/components/home/Newsletter";

export const metadata: Metadata = {
  title: "Gallery-quality academic publishing",
  description:
    "Discover peer-reviewed journals and scholarly books presented with the care of a maker examining a finished piece, not a database entry.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Ethos />
      <JournalsShowcase />
      <BooksShowcase />
      <CtaSection />
      <Newsletter />
    </>
  );
}
