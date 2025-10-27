# Tech Stack

## Framework & Core

- Next.js 15.4.1 (App Router with React Server Components)
- React 19
- TypeScript 5 (strict mode enabled)
- Tailwind CSS v4 with CSS variables
- Turbopack for dev and build

## UI & Styling

- shadcn/ui components (New York style)
- Radix UI primitives
- Lucide React icons
- Motion (Framer Motion) for animations
- next-themes for theme switching
- class-variance-authority + clsx + tailwind-merge for styling utilities

## State Management

- Zustand for global state
- TanStack Query (React Query) for server state
- nuqs for URL state management
- idb-keyval for IndexedDB storage

## Database & Auth

- Drizzle ORM with PostgreSQL (Neon)
- better-auth for authentication (GitHub, Google providers)
- Upstash Rate Limiting with Vercel KV

## AI & Content

- Vercel AI SDK
- Google Generative AI (Gemini)
- OpenAI SDK
- Tiptap for rich text editing

## Payments & Analytics

- Polar SDK for subscriptions
- PostHog for analytics

## Code Quality

- Biome (via ultracite presets) for linting and formatting
- Husky + lint-staged for pre-commit hooks
- Conventional Commits for commit messages

## Common Commands

```bash
# Development
npm run dev                      # Start dev server with Turbopack
npm run build                    # Production build with Turbopack
npm start                        # Start production server

# Code Quality
npm run lint                     # Run Next.js linter

# Database
npx drizzle-kit push            # Push schema changes to database
npx drizzle-kit studio          # Open Drizzle Studio

# Scripts
npm run generate-theme-registry  # Generate theme registry files
npm run minify-live-preview      # Minify live preview script
```

## Path Aliases

All imports use `@/` prefix for workspace root:
- `@/components` - UI components
- `@/lib` - Library integrations
- `@/hooks` - Custom React hooks
- `@/utils` - Utility functions
- `@/types` - TypeScript types
- `@/store` - Zustand stores
- `@/actions` - Server actions
- `@/db` - Database schema and queries
