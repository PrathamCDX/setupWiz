<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — dev server (port 3000)
- `npm run build` — production build (includes type checking)
- `npm run lint` — ESLint
- No test runner or test scripts are configured

## Project facts

- **Next.js 16.3.1** App Router (`app/` directory), React 19.2.8, TypeScript 5
- **Tailwind CSS v4** via `@tailwindcss/postcss` — uses `@import "tailwindcss"` and `@theme inline` blocks, not the v3 `tailwind.config.js` or `@tailwind` directives
- Path alias: `@/*` → repo root
- Entry layout (`app/layout.tsx`) uses `LayoutProps<"/">` — this is a Next.js 16 type, not the older `{ children: React.ReactNode }` pattern
- Components live in `components/` (currently just `components/SignUp.tsx`)

## Gotchas

- When adding new pages or API routes, follow the App Router conventions in `node_modules/next/dist/docs/01-app/` — this is v16, not v14/v15
- ESLint config uses the flat config format (`eslint.config.mjs`) with `eslint-config-next` presets — do not convert to `.eslintrc`
- `next-env.d.ts` is auto-generated and gitignored; do not edit manually
