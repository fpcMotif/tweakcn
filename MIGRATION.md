# Migration from Next.js to SvelteKit

This branch (`feature/sveltekit-migration`) contains the SvelteKit version of the project, migrated from Next.js + React to SvelteKit + Svelte.

## Key Changes

### Framework Migration
- **Next.js** → **SvelteKit**
- **React** → **Svelte 5**
- **shadcn/ui (React)** → **shadcn-svelte**

### Dependencies Replaced

#### UI Libraries
- `@radix-ui/react-*` → `bits-ui` (Svelte primitives)
- `lucide-react` → `lucide-svelte`
- `cmdk` → `cmdk-sv`
- `sonner` → `svelte-sonner`
- `vaul` → `vaul-svelte`
- `embla-carousel-react` → `embla-carousel-svelte`

#### State Management
- `zustand` → `svelte-persisted-store` (for persistent state)
- React hooks → Svelte stores and runes ($state, $derived, $effect)

#### Forms
- `react-hook-form` + `@hookform/resolvers` → `sveltekit-superforms` + `formsnap`

#### Drag & Drop
- `@dnd-kit/*` → `svelte-dnd-action`

#### Theming
- `next-themes` → `mode-watcher`

#### Routing
- Next.js App Router → SvelteKit file-based routing

## Project Structure

```
src/
├── routes/              # SvelteKit pages (file-based routing)
│   ├── +layout.svelte  # Root layout
│   └── +page.svelte    # Home page
├── lib/                 # Shared library code
│   ├── components/      # Reusable components
│   │   └── ui/         # shadcn-svelte components
│   └── utils.ts        # Utility functions
├── app.css             # Global styles & Tailwind
├── app.html            # HTML shell
└── app.d.ts            # TypeScript declarations
```

## Getting Started

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Run development server:**
   ```bash
   bun run dev
   ```

3. **Add shadcn-svelte components:**
   ```bash
   npx shadcn-svelte@latest add button
   npx shadcn-svelte@latest add card
   # etc.
   ```

4. **Build for production:**
   ```bash
   bun run build
   bun run preview
   ```

## Configuration Files

- `svelte.config.js` - SvelteKit configuration
- `vite.config.ts` - Vite configuration
- `components.json` - shadcn-svelte configuration
- `tailwind.config.js` - Tailwind CSS v4 configuration
- `tsconfig.json` - TypeScript configuration

## Next Steps for Migration

Since this is a showcase site for shadcn components, you'll need to:

1. **Migrate existing React components to Svelte:**
   - Convert `.tsx` files to `.svelte` files
   - Replace React hooks with Svelte runes/stores
   - Update component props to Svelte syntax

2. **Recreate pages:**
   - Move `app/` directory contents to `src/routes/`
   - Convert React Server Components to SvelteKit load functions
   - Update data fetching patterns

3. **Update shadcn components:**
   - Use `shadcn-svelte` CLI to add components
   - Customize components in `src/lib/components/ui/`

4. **Migrate state management:**
   - Replace Zustand stores with Svelte stores
   - Update Context API usage to Svelte context

5. **Update styling:**
   - Ensure Tailwind classes work the same
   - Test theme switching with mode-watcher

## Resources

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Svelte 5 Documentation](https://svelte-5-preview.vercel.app/docs)
- [shadcn-svelte Documentation](https://www.shadcn-svelte.com/)
- [bits-ui (Headless components)](https://www.bits-ui.com/)
