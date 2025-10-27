# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

tweakcn.com is a visual theme editor for Tailwind CSS and shadcn/ui components. It enables users to customize component themes with real-time previews and export configurations.

## Development Commands

### Setup

```bash
bun install                    # Install dependencies
cp .env.example .env.local     # Set up environment variables
bunx drizzle-kit push           # Apply database schema to Neon PostgreSQL
```

### Development

```bash
bun run dev                    # Start dev server with Turbopack at http://localhost:3000
```

### Build & Registry

```bash
bun run build                  # Build for production (runs prebuild → build → postbuild)
bun run prebuild               # Generate theme registry files (runs before build)
bun run postbuild              # Minify live-preview.js (runs after build)
bun run generate-theme-registry # Generate registry JSON files in public/r/themes/
```

### Code Quality

```bash
bun run lint                   # Run ESLint (also runs in pre-commit hook)
bunx prettier --write .         # Format all files with Prettier
```

### Database

```bash
bunx drizzle-kit push           # Push schema changes to database
bunx drizzle-kit studio         # Open Drizzle Studio to browse database
```

## High-Level Architecture

### State Management (Zustand)

The application uses Zustand for client-side state with IndexedDB persistence:

- **editor-store.ts**: Core theme editing state with undo/redo history (max 30 entries, 500ms debounce)
  - `themeState`: Current theme configuration (styles, preset, HSL adjustments)
  - `themeCheckpoint`: Saved state for comparison and restoration
  - History management tracks changes except `currentMode` toggles
- **theme-preset-store.ts**: Manages preset library (built-in + user-saved themes)
- **ai-chat-store.ts** / **ai-local-draft-store.ts**: AI-powered theme generation state
- **auth-store.ts**: User authentication session state
- **preferences-store.ts**: User preferences and settings

All stores use `idb-storage.ts` for IndexedDB persistence via Zustand middleware.

### Theme System

**Theme configuration** follows shadcn/ui conventions with OKLCH color space:

- **config/theme.ts**: Default theme values and common styles between light/dark modes
  - Uses OKLCH color format (e.g., `oklch(0.985 0 0)`)
  - Common styles like fonts, radius, shadows shared across modes
- **types/theme.ts**: Zod schemas for theme validation
  - 30+ color variables (background, foreground, primary, secondary, etc.)
  - Font families, radius, shadows, spacing, letter-spacing
  - Separate schemas for light/dark modes

**Theme presets** are stored in:

- `utils/theme-presets.ts`: Built-in preset definitions
- `public/r/themes/*.json`: Generated registry files (created during build)
- Database: User-saved themes in `theme` table

### Data Flow

1. **User edits theme** → `editor-store` updates → Components re-render
2. **Apply preset** → Fetch from `theme-preset-store` → Update `editor-store`
3. **Save theme** → Server action → Database → Update `theme-preset-store`
4. **AI generation** → API route → Stream response → Update stores

### Authentication & Authorization

Uses **better-auth** with Drizzle adapter:

- OAuth providers: GitHub, Google
- Database schema: `user`, `session`, `account`, `verification` tables
- Middleware protects routes: `/editor/theme/:id`, `/dashboard`, `/settings/*`
- Default redirect: `/editor/theme` for authenticated users

### Database Schema (Drizzle ORM + Neon PostgreSQL)

Key tables in `db/schema.ts`:

- **user** / **session** / **account** / **verification**: Authentication
- **theme**: User-saved themes (id, userId, name, styles JSON, timestamps)
- **aiUsage**: AI request tracking per user/model/day
- **subscription**: Polar.sh subscription data

### API Routes

- **POST /api/generate-theme**: AI theme generation (Google Gemini)
- **POST /api/enhance-prompt**: Enhance user prompts for better AI results
- **GET /api/google-fonts**: Fetch Google Fonts list
- **POST /api/subscription**: Polar.sh webhook handler

### Component Organization

- **components/editor/**: Theme editor UI (control panel, preview, color picker, AI chat)
- **components/examples/**: Demo components for theme preview
- **components/home/**: Landing page components
- **components/ui/**: Base shadcn/ui components

### Build Process

1. **prebuild**: Generate theme registry JSON files from presets
2. **build**: Next.js build with Turbopack
3. **postbuild**: Minify live-preview.js for performance

### Scripts

- **scripts/generate-theme-registry.ts**: Creates individual theme JSON files
- **scripts/generate-registry.ts**: Creates master registry.json for shadcn CLI

## Code Style & Conventions

### TypeScript

- Strict mode enabled
- Path alias `@/*` maps to project root
- Unused vars must be prefixed with `_`

### Formatting

- Prettier with Tailwind plugin
- 2-space indentation, 100 char line width
- Double quotes, trailing commas (ES5)
- LF line endings

### Pre-commit Hook

Husky runs `bun run lint` before every commit to ensure code quality.

## Environment Variables

Required variables in `.env.local`:

- **DATABASE_URL**: Neon PostgreSQL connection string
- **BETTER_AUTH_SECRET**: Encryption key for auth tokens
- **GITHUB_CLIENT_ID** / **GITHUB_CLIENT_SECRET**: GitHub OAuth
- **GOOGLE_CLIENT_ID** / **GOOGLE_CLIENT_SECRET**: Google OAuth
- **GOOGLE_API_KEY**: For Gemini AI and Google Fonts API
- **GROQ_API_KEY**: Alternative AI provider

## Key Patterns

### Theme State Updates

Always use `setThemeState()` from editor-store to ensure proper history tracking. Direct state mutations bypass undo/redo functionality.

### Color Format

All colors use OKLCH format. Use utilities in `utils/` to convert between formats if needed.

### Server Actions

Located in `actions/` directory. Use with React Server Components for data mutations.

### API Rate Limiting

Uses `@upstash/ratelimit` with Vercel KV for API endpoint protection.
