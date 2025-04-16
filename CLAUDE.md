# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Test Commands
- Development: `pnpm dev` or `npm run dev`
- Build: `pnpm build` or `npm run build`
- Type check: `pnpm check` or `npm run check`
- Lint/Format: `pnpm lint` or `npm run lint`
- Format fix: `pnpm format` or `npm run format`
- Run all tests: `pnpm test` or `npm run test`
- Run specific e2e test: `npx playwright test e2e/path/to/test.ts`

## Code Style Guidelines
- Use TypeScript with strict type checking
- Format with Prettier (tabs, single quotes, no trailing comma, 100 char width)
- Svelte components use PascalCase naming (.svelte extension)
- SCSS modules for component styling (.module.scss extension)
- Use proper typing for props and return values
- Prefer functional programming patterns
- Use clsx for conditional class names
- Component props should have proper interfaces with JSDoc comments
- Follow consistent export patterns in index.ts files
- Consistent error handling with defensive programming