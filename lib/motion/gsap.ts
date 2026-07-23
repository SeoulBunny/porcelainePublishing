"use client";

// Single registration point for GSAP plugins used across the site. Imported
// (not re-imported per component) so ScrollTrigger/useGSAP register exactly
// once. gsap-core / gsap-react / gsap-scrolltrigger skill routing per
// frontend/CLAUDE.md — no pins/scrubs in this manifest, so gsap-plugins and
// gsap-performance are not pulled in.

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };
