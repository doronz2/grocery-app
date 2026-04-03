# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # Type-check (tsc -b) then bundle (vite build) → outputs to dist/
npm run lint       # Run ESLint
npm run preview    # Build then serve locally via Wrangler (Cloudflare Pages emulation)
npm run deploy     # Build then deploy to Cloudflare Pages
npm run cf-typegen # Regenerate Cloudflare Worker type definitions (worker-configuration.d.ts)
```

There are no automated tests configured.

## Architecture

React 19 + TypeScript SPA deployed to **Cloudflare Pages** via Wrangler.

- Entry: `index.html` → `src/main.tsx` → `src/App.tsx`
- No backend; this is a pure frontend SPA
- Cloudflare Pages compatibility is wired in via `wrangler.jsonc` (output dir: `./dist`, node compat flag enabled)
- TypeScript is in strict mode; `tsconfig.app.json` governs source, `tsconfig.node.json` governs Vite config

The app is currently at a scaffold stage — `src/App.tsx` is the only component and all grocery features are yet to be built.
