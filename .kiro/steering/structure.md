# Project Structure

## Directory Organization

```
├── actions/              Server Actions for data mutations
├── app/                  Next.js App Router pages and layouts
│   ├── (auth)/          Auth-related routes (login, signup)
│   ├── (legal)/         Legal pages (privacy, terms)
│   ├── ai/              AI-related API routes
│   ├── api/             Public API endpoints
│   ├── dashboard/       User dashboard for saved themes
│   ├── editor/          Main theme editor interface
│   ├── figma/           Figma plugin integration
│   ├── pricing/         Pricing page
│   ├── settings/        User settings
│   ├── success/         Post-checkout success page
│   └── themes/          Theme gallery/registry
├── components/          React components
│   ├── ai-elements/     AI-specific UI components
│   ├── editor/          Theme editor components
│   ├── effects/         Visual effects components
│   ├── examples/        Demo components for theme preview
│   ├── home/            Landing page components
│   ├── icons/           Custom icon components
│   └── ui/              Base shadcn/ui components
├── config/              App configuration and defaults
├── db/                  Database schema (Drizzle ORM)
├── hooks/               Custom React hooks
│   ├── inspector/       Theme inspector hooks
│   └── themes/          Theme-related hooks
├── lib/                 Third-party integrations and helpers
│   ├── ai/              AI provider configurations
│   └── inspector/       Theme inspection utilities
├── public/              Static assets
│   └── r/               Theme registry JSON files
├── scripts/             Build and utility scripts
├── store/               Zustand state stores
├── types/               TypeScript type definitions
└── utils/               General utility functions
    ├── ai/              AI-related utilities
    ├── fonts/           Font handling utilities
    └── registry/        Theme registry utilities
```

## Key Conventions

### File Naming
- React components: PascalCase (e.g., `ThemeEditor.tsx`)
- Utilities/hooks: kebab-case (e.g., `use-theme-inspector.ts`)
- Server actions: kebab-case (e.g., `ai-usage.ts`)
- Types: kebab-case (e.g., `theme.ts`)

### Component Structure
- Server Components by default (Next.js 15 App Router)
- Use `"use client"` directive only when needed (hooks, interactivity)
- Prefer composition over prop drilling
- Co-locate related components when possible

### State Management
- Server state: TanStack Query
- Client state: Zustand stores in `/store`
- URL state: nuqs for shareable state
- Form state: react-hook-form with Zod validation

### Styling
- Tailwind utility classes (prefer utilities over custom CSS)
- CSS variables for theme values (defined in `app/globals.css`)
- Use `cn()` utility for conditional classes
- Component variants via class-variance-authority

### Data Flow
- Server Actions in `/actions` for mutations
- API routes in `/app/api` for external integrations
- Database queries via Drizzle ORM in `/db`
- Type-safe with Zod schemas

### Theme System
- Theme presets stored in `/public/r/*.json`
- Generated via `/scripts/generate-theme-registry.ts`
- Theme styles defined in `/types/theme.ts`
- Applied via CSS variables injection
