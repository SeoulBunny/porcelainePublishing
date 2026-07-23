"use client";

// The Kiln-ash drift field (design-tokens.json devices.heroBackdrop). Adapted
// from the user's interactive starfield hero (ec8fe496): recolored from
// blue/white on bg-zinc-950 to secondary/accent on the porcelain ground,
// particle count dropped 300 -> 140 and interaction radius 140 -> 120 to keep
// it restrained rather than showy. Contained to the hero viewport only (no
// scroll-scrub) via a plain requestAnimationFrame canvas loop -- this is raw
// physics simulation, not a GSAP tween, so it stays outside lib/motion/gsap.
// Entrance: flecks fade in from 0 over ~900ms staggered outward from center,
// then play one full-opacity settling pulse, matching the device spec's
// perceptibility_anchor so the motion reads as present before any pointer
// input. Reduced motion renders a single static settled frame: no physics,
// no twinkle, no entrance.

import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 140;
const INTERACTION_RADIUS = 120;
const REST_RGB: [number, number, number] = [26, 32, 44]; // --color-ink (darker than slate for contrast against porcelain)
const ACTIVE_RGB: [number, number, number] = [139, 154, 142]; // --color-sage

interface Fleck {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  phase: number;
  entranceDelay: number;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpRgb(a: [number, number, number], b: [number, number, number], t: number) {
  return `rgb(${Math.round(lerp(a[0], b[0], t))}, ${Math.round(lerp(a[1], b[1], t))}, ${Math.round(lerp(a[2], b[2], t))})`;
}

export function KilnAshField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let flecks: Fleck[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let influence = 0;
    let raf = 0;
    let visible = true;
    let start = performance.now();
    const ir2 = INTERACTION_RADIUS * INTERACTION_RADIUS;

    function seed(w: number, h: number): Fleck[] {
      const cx = w / 2;
      const cy = h / 2;
      const maxDist = Math.hypot(cx, cy) || 1;
      return Array.from({ length: PARTICLE_COUNT }, () => {
        const ox = Math.random() * w;
        const oy = Math.random() * h;
        const dist = Math.hypot(ox - cx, oy - cy);
        return {
          ox,
          oy,
          x: ox,
          y: oy,
          vx: 0,
          vy: 0,
          r: 1.3 + Math.random() * 2,
          alpha: 0.45 + Math.random() * 0.45,
          phase: Math.random() * Math.PI * 2,
          entranceDelay: (dist / maxDist) * 0.55,
        };
      });
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      width = canvas!.offsetWidth;
      height = canvas!.offsetHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      flecks = seed(width, height);
    }

    function drawStatic() {
      ctx!.clearRect(0, 0, width, height);
      for (const f of flecks) {
        ctx!.beginPath();
        ctx!.fillStyle = lerpRgb(REST_RGB, REST_RGB, 0);
        ctx!.globalAlpha = f.alpha;
        ctx!.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
    }

    function onMove(cx: number, cy: number) {
      const r = canvas!.getBoundingClientRect();
      mouse.x = cx - r.left;
      mouse.y = cy - r.top;
      mouse.active = true;
    }
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onLeave = () => {
      mouse.active = false;
    };

    function draw(now: number) {
      if (!visible || document.hidden) {
        raf = 0;
        return;
      }
      const elapsed = (now - start) / 1000;
      ctx!.clearRect(0, 0, width, height);

      const active = mouse.active;
      influence = active ? Math.min(1, influence + 0.06) : Math.max(0, influence - 0.03);

      // One-time settling pulse: a brief brightness bump once the staggered
      // entrance has mostly resolved, so the device reads as present even
      // before any pointer input reaches it.
      const pulse =
        elapsed > 0.85 && elapsed < 1.3
          ? 0.3 * Math.max(0, Math.sin(((elapsed - 0.85) / 0.45) * Math.PI))
          : 0;

      for (const f of flecks) {
        const dx = f.x - mouse.x;
        const dy = f.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        let t = 0;
        if (influence > 0.01 && d2 < ir2) {
          const d = Math.sqrt(d2);
          t = (1 - d / INTERACTION_RADIUS) ** 2 * influence;
          if (d > 0.1) {
            f.vx += (dx / d) * 1.1 * t;
            f.vy += (dy / d) * 1.1 * t;
          }
        }
        f.vx += (f.ox - f.x) * 0.05;
        f.vy += (f.oy - f.y) * 0.05;
        f.vx *= 0.86;
        f.vy *= 0.86;
        f.x += f.vx;
        f.y += f.vy;

        const entranceP = Math.min(1, Math.max(0, (elapsed - f.entranceDelay) / 0.45));
        const entranceEase = entranceP * (2 - entranceP);
        const twinkle = Math.sin(elapsed * 1.1 + f.phase) * 0.5 + 0.5;
        const baseA = f.alpha * (0.6 + twinkle * 0.4);
        const a = Math.min(1, (baseA + t * (1 - baseA)) * entranceEase + pulse * entranceEase);
        const color = lerpRgb(REST_RGB, ACTIVE_RGB, t);

        ctx!.beginPath();
        ctx!.fillStyle = color;
        ctx!.globalAlpha = a;
        if (t > 0.35) {
          ctx!.shadowBlur = 5 + t * 8;
          ctx!.shadowColor = color;
        } else {
          ctx!.shadowBlur = 0;
        }
        ctx!.arc(f.x, f.y, f.r + t * 0.6, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
      ctx!.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;
        if (visible && !document.hidden && !raf && !reduceMotion) {
          start = performance.now();
          raf = requestAnimationFrame(draw);
        }
      },
      { threshold: 0.01 },
    );
    io.observe(canvas);

    const onVisibilityChange = () => {
      if (!document.hidden && visible && !raf && !reduceMotion) {
        start = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) drawStatic();
    });
    ro.observe(canvas);
    resize();

    if (reduceMotion) {
      drawStatic();
    } else {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("mouseleave", onLeave);
      window.addEventListener("touchend", onLeave);
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchend", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
      style={{ pointerEvents: "none" }}
    />
  );
}
