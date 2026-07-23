"use client";

import { useEffect, useState } from "react";

// Shared by journals-grid / books-grid pagination. Page size is rows-visible
// times the grid's actual column count at each breakpoint (grid-cols-2 / 3 / 4
// matching the sm/lg Tailwind breakpoints used by the grid className), not a
// flat item count -- so "page 2" only ever appears once there's truly more
// than a screen's worth of rows to page through.
const TIERS = [
  { minWidth: 1024, cols: 4, rows: 5 }, // lg: large screens
  { minWidth: 640, cols: 3, rows: 6 }, // sm: medium screens
  { minWidth: 0, cols: 2, rows: 7 }, // base: small screens
];

function currentPageSize() {
  const width = typeof window === "undefined" ? 0 : window.innerWidth;
  const tier = TIERS.find((t) => width >= t.minWidth) ?? TIERS[TIERS.length - 1];
  return tier.cols * tier.rows;
}

export function useResponsivePageSize() {
  const [pageSize, setPageSize] = useState(() => TIERS[TIERS.length - 1].cols * TIERS[TIERS.length - 1].rows);

  useEffect(() => {
    function update() {
      setPageSize(currentPageSize());
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return pageSize;
}
