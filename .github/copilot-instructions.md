# Project Guidelines

## Code Style

- Use TypeScript + Astro component patterns already used in `src/components/*.astro`.
- In Astro components, define and export a `Props` type, then destructure from `Astro.props`.
- Keep imports organized and formatting consistent with Prettier config (`.prettierrc`: tabs, width 4, print width 120, Astro + organize-imports plugins).
- Prefer explicit, strict typing; this repo uses `astro/tsconfigs/strict` via `tsconfig.json`.

## Architecture

- This package is an Astro SEO component library.
- Public API surface is the package entry point `index.ts`, which re-exports components from `src/components/`.
- `src/components/Head.astro` is the composition component that wires individual SEO components together.
- Keep component responsibilities focused: each leaf component should represent one SEO concern (meta/link behavior).

## Build and Test

- Install dependencies: `pnpm install`
- Validate changes: `pnpm check` (runs format check + `astro check`)
- Formatting only: `pnpm format:check` and `pnpm format:fix`
- CI runs `pnpm format:check` and `pnpm astro check` on Node 24 + pnpm 10 (see `.github/workflows/ci.yml`).
- There is no dedicated test runner in this repository; treat type-check + formatting as the required quality gate.
- Use branch names in the format `issue-number-type/brief-description` (example: `42-feat/seo-title-component`).
- Use Conventional Commit types: `feat`, `fix`, `docs`, `refactor`, `deps`, `test`.

## Conventions

- When adding a new component, export it from `index.ts` so it is part of the public API and also add it to `Head.astro`.
- In `index.ts`, keep import/export organization consistent with existing style.
- In composed props (see `Head.astro`), prefer `ComponentProps<typeof Component>` to keep types aligned across components.
- Use discriminated unions for mutually exclusive props when relevant (see `src/components/Facebook.astro`).
