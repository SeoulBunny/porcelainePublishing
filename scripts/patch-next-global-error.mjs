#!/usr/bin/env node
/**
 * Patch Next.js 16.x framework bug: vercel/next.js#93024
 *
 * isPageStatic() in next/dist/build/utils.js hardcodes the synthetic
 * /_global-error route with `appConfig: {}`. Because `{}.revalidate !== 0`
 * is true, build/index.js adds /_global-error to staticPaths and attempts to
 * prerender it. The prerender crashes with:
 *   TypeError: Cannot read properties of null (reading 'useContext')
 * because no root layout initializes the vendored React SSR context for this
 * synthetic route.
 *
 * Fix: set `appConfig: { revalidate: 0 }` so the `appConfig.revalidate !== 0`
 * guard in build/index.js skips staticPaths for /_global-error. The route is
 * never prerendered and continues to function as a runtime error boundary.
 *
 * This script is idempotent and runs as a postinstall hook (see package.json).
 * It is a workaround for an upstream framework defect, not app code — when a
 * fixed Next.js is released, this script becomes a no-op and can be removed.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const file = join(process.cwd(), 'node_modules', 'next', 'dist', 'build', 'utils.js');

if (!existsSync(file)) {
  // next isn't installed yet (e.g. fresh install before deps resolve) — nothing to patch.
  process.exit(0);
}

const src = readFileSync(file, 'utf8');

// The exact buggy return for the _global-error early-return. Match liberally
// on the appConfig line within the UNDERSCORE_GLOBAL_ERROR_ROUTE block.
const buggy = `            isNextImageImported: false,
            appConfig: {}
        };
    }`;

const fixed = `            isNextImageImported: false,
            // [patch-next-global-error] revalidate:0 prevents build/index.js
            // from adding /_global-error to staticPaths (vercel/next.js#93024).
            appConfig: { revalidate: 0 }
        };
    }`;

if (src.includes('appConfig: { revalidate: 0 }')) {
  // Already patched (or upstream fixed it this way). Nothing to do.
  process.exit(0);
}

if (!src.includes(buggy)) {
  // The file doesn't match the expected buggy shape. Either Next restructured
  // the code or already shipped a fix. Warn but don't fail the install.
  console.warn(
    '[patch-next-global-error] expected pattern not found in ' +
      file +
      ' — skipping (Next.js may already be fixed or restructured).'
  );
  process.exit(0);
}

writeFileSync(file, src.replace(buggy, fixed), 'utf8');
console.log('[patch-next-global-error] patched node_modules/next/dist/build/utils.js (vercel/next.js#93024)');
