import type { Metadata } from "next";
import { AboutIntro } from "@/components/about/AboutIntro";
import { AboutVisionValues } from "@/components/about/AboutVisionValues";
import { AboutHistory } from "@/components/about/AboutHistory";
import { AboutWritersGrid } from "@/components/about/AboutWritersGrid";
import { AboutStats } from "@/components/about/AboutStats";
import { AboutContact } from "@/components/about/AboutContact";

export const metadata: Metadata = {
  title: "About",
  description:
    "Porcelain Publishing's mission, history, editorial board, and how to reach us.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <div className="bg-porcelain pt-16 sm:pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl text-ink sm:text-5xl">About Porcelain Publishing</h1>
        </div>
      </div>
      <AboutIntro />
      <AboutVisionValues />
      <AboutHistory />
      <AboutStats />
      <AboutWritersGrid />
      <AboutContact />
    </>
  );
}
