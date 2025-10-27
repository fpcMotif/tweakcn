# Convex Backend Migration Guide

This document describes the migration from Drizzle + Neon PostgreSQL + Better Auth to Convex (reactive backend-as-a-service) with Convex Auth.

## What Changed

### Backend Stack

- **Before**: Drizzle ORM + Neon PostgreSQL + Better Auth
- **After**: Convex (includes database + auth + real-time sync)

### Authentication

- **Before**: Better Auth with session-based authentication
- **After**: Convex Auth with JWT-based authentication (Google & GitHub OAuth)
- **Impact**: Users will need to re-authenticate after migration

### Database Schema

All tables have been migrated to Convex:

- `users` - Managed by Convex Auth
- `themes` - User-created themes
- `aiUsage` - AI request tracking
- `subscriptions` - Polar subscription data

### API Structure

- **Before**: Next.js server actions + API routes
- **After**: Convex queries, mutations, and HTTP endpoints
- **Benefits**: Real-time sync, automatic caching, optimistic updates

## Setup Instructions

### 1. Environment Variables

The following are already set in `.env.local`:

```bash
CONVEX_DEPLOYMENT=dev:scintillating-clam-713
NEXT_PUBLIC_CONVEX_URL=https://scintillating-clam-713.convex.cloud
```

### 2. Set Convex Secrets

Run these commands to set environment variables in Convex:

```bash
# OAuth providers (get from Google/GitHub developer consoles)
bunx convex env set GOOGLE_CLIENT_ID your_google_client_id
bunx convex env set GOOGLE_CLIENT_SECRET your_google_client_secret
bunx convex env set GITHUB_CLIENT_ID your_github_client_id
bunx convex env set GITHUB_CLIENT_SECRET your_github_client_secret

# Auth secret (generate a random string)
bunx convex env set AUTH_SECRET $(openssl rand -base64 32)

# Polar webhook secret
bunx convex env set POLAR_WEBHOOK_SECRET your_polar_webhook_secret

# TweakCN Pro product ID
bunx convex env set NEXT_PUBLIC_TWEAKCN_PRO_PRODUCT_ID your_product_id
```

### 3. Update Polar Webhook URL

In your Polar dashboard, update the webhook URL to:

```
https://scintillating-clam-713.convex.cloud/webhook/polar
```

### 4. Start Development

```bash
# Terminal 1: Start Convex dev server
bunx convex dev

# Terminal 2: Start Next.js
bun run dev
```

## Migration Status

### ✅ Completed

- [x] Convex schema with all tables and indexes
- [x] Convex Auth with Google & GitHub OAuth
- [x] Theme CRUD operations (queries & mutations)
- [x] AI usage tracking (queries & mutations)
- [x] Subscription validation (queries)
- [x] Polar webhook handler (HTTP endpoint)
- [x] Frontend Convex provider setup
- [x] Removed obsolete files (Drizzle, Better Auth, old actions)

### 🚧 In Progress / TODO

- [ ] Update all components to use Convex hooks (`useQuery`, `useMutation`)
- [ ] Update auth dialog to use Convex Auth OAuth flow
- [ ] Test OAuth sign-in flow (Google & GitHub)
- [ ] Test theme CRUD operations
- [ ] Test AI usage tracking
- [ ] Test subscription limits and validation
- [ ] Test Polar webhook subscription updates
- [ ] Production deployment

## Code Examples

### Using Convex Queries (React Components)

```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function ThemesList() {
  // Query themes
  const themes = useQuery(api.themes.getThemes);

  // Create theme mutation
  const createTheme = useMutation(api.themes.createTheme);

  const handleCreate = async () => {
    await createTheme({
      name: "My Theme",
      styles: { /* theme data */ }
    });
  };

  return (
    <div>
      {themes?.map(theme => (
        <div key={theme._id}>{theme.name}</div>
      ))}
      <button onClick={handleCreate}>Create Theme</button>
    </div>
  );
}
```

### Authentication

```typescript
import { useAuthActions } from "@convex-dev/auth/react";

function AuthButton() {
  const { signIn, signOut } = useAuthActions();

  return (
    <>
      <button onClick={() => signIn("google")}>
        Sign in with Google
      </button>
      <button onClick={() => signIn("github")}>
        Sign in with GitHub
      </button>
      <button onClick={() => signOut()}>
        Sign Out
      </button>
    </>
  );
}
```

### Server-Side API Routes (Calling Convex)

```typescript
import { api } from "@/convex/_generated/api";
import { convexClient } from "@/lib/convex-server";

export async function GET() {
  const result = await convexClient.query(
    api.subscriptions.validateSubscriptionAndUsage,
    {}
  );

  return Response.json(result);
}
```

## Breaking Changes

### 1. Authentication

- Users must re-authenticate using Google or GitHub OAuth
- Session-based auth is replaced with JWT tokens
- Auth state is managed by Convex Auth

### 2. Database Access

- Direct database queries are no longer possible
- All data access must go through Convex queries/mutations
- Real-time subscriptions replace polling

### 3. Server Actions

- `actions/themes.ts` → Use `api.themes.*` mutations
- `actions/ai-usage.ts` → Use `api.aiUsage.*` mutations
- Server actions still available for Polar API calls

## Troubleshooting

### "Unauthorized" errors

- Ensure user is signed in via Convex Auth
- Check that JWT token is being passed to Convex functions

### Data not updating in real-time

- Convex queries automatically re-run when data changes
- Make sure you're using `useQuery` hook (not `fetch`)

### Webhook not receiving events

- Verify webhook URL is correct in Polar dashboard
- Check Convex function logs in dashboard
- Ensure `POLAR_WEBHOOK_SECRET` is set correctly

## Resources

- [Convex Documentation](https://docs.convex.dev/)
- [Convex Auth Documentation](https://labs.convex.dev/auth)
- [Convex Dashboard](https://dashboard.convex.dev/d/scintillating-clam-713)
- [Migration Plan](./convex-backend-migration.plan.md)

## Rollback Plan

If you need to rollback to the previous implementation:

```bash
# Switch back to main branch
git checkout main

# Reinstall old dependencies
bun install

# Restore old environment variables (from backup)
```

Note: Any data created during Convex testing will be lost on rollback.
