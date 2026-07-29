# AGENTS.md

## Cursor Cloud specific instructions

This repo is an interactive "Build Your Own LLM" course: a **Next.js 16 (Turbopack) + Fumadocs** MDX site. Lessons live in `content/docs/`; the browser TypeScript playgrounds/diagrams are in `components/`.

### Package manager
- Use **pnpm** (there is a `pnpm-lock.yaml`). The README/CONTRIBUTING mention Bun, but Bun is not installed here and is only needed for the optional CLI lesson runners.
- Dependencies are installed by the startup update script (`pnpm install`). `postinstall` runs `fumadocs-mdx` automatically to generate `.source/`.
- On install, pnpm reports "Ignored build scripts: esbuild, sharp". This is expected and safe: the in-browser playground uses `esbuild-wasm` (no native build), and Next dev runs without `sharp`. Do not run the interactive `pnpm approve-builds`.

### Common commands (see `package.json` scripts)
- Dev server: `pnpm dev` → http://localhost:3000 (Turbopack).
- Lint: `pnpm lint` (oxlint). Types: `pnpm types:check` (runs `fumadocs-mdx && next typegen && tsc --noEmit`).
- Production build: `pnpm build`.

### Non-obvious notes
- The optional in-app AI chat (`app/api/chat/route.ts`) needs `OPENROUTER_API_KEY` (and optional `OPENROUTER_MODEL`). Everything else — lessons and the interactive code playgrounds — works with no secrets.
- CLI lesson runners (`pnpm part-01` … `part-09`) execute `bun code/part-XX/index.ts` and therefore require Bun, which is not installed by default. The primary dev workflow is the Next app, not these runners.
- The playground compiles/runs TypeScript in the browser via `esbuild-wasm`; a bad snippet surfaces a compile error box inline (this is normal behavior, not a dev-server failure).
