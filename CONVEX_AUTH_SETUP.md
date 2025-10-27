# Convex Auth Setup Instructions

## Overview

Authentication is now handled entirely by Convex Auth. No SvelteKit environment variables are needed for OAuth credentials.

## Required Convex Environment Variables

Set these in your Convex deployment (both dev and prod):

```bash
# For development
npx convex env set dev AUTH_SECRET "your-random-secret-32-chars-or-more"
npx convex env set dev GOOGLE_CLIENT_ID "your-google-client-id"
npx convex env set dev GOOGLE_CLIENT_SECRET "your-google-client-secret"
npx convex env set dev GITHUB_CLIENT_ID "your-github-client-id"
npx convex env set dev GITHUB_CLIENT_SECRET "your-github-client-secret"

# For production
npx convex env set prod AUTH_SECRET "your-random-secret-32-chars-or-more"
npx convex env set prod GOOGLE_CLIENT_ID "your-google-client-id"
npx convex env set prod GOOGLE_CLIENT_SECRET "your-google-client-secret"
npx convex env set prod GITHUB_CLIENT_ID "your-github-client-id"
npx convex env set prod GITHUB_CLIENT_SECRET "your-github-client-secret"
```

## Generate AUTH_SECRET

```bash
# Generate a secure random secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## OAuth Provider Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-deployment.convex.cloud/api/auth/callback/google`

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `https://your-deployment.convex.cloud/api/auth/callback/github`

## Usage in Svelte Components

```svelte
<script lang="ts">
  import { signIn, signOut, isAuthenticated, isLoading } from '$lib/convex-auth';
  import { onMount } from 'svelte';

  onMount(async () => {
    await initAuth();
  });

  async function handleGoogleSignIn() {
    await signIn('google');
  }

  async function handleSignOut() {
    await signOut();
  }
</script>

{#if $isLoading}
  <p>Loading...</p>
{:else if $isAuthenticated}
  <button on:click={handleSignOut}>Sign Out</button>
{:else}
  <button on:click={handleGoogleSignIn}>Sign in with Google</button>
{/if}
```

## Files Modified

- `src/hooks.server.ts` - Removed SvelteKit Auth
- `src/lib/convex-client.ts` - Added Convex Auth token handler
- `src/lib/convex-auth.ts` - Created auth helpers for Svelte
- `convex/auth.ts` - Already configured with Google and GitHub providers
- `convex/http.ts` - Already mounting auth HTTP routes

## Verification

1. Start your development server: `bun run dev`
2. Start Convex: `npx convex dev`
3. Check that auth routes are available at: `https://your-deployment.convex.cloud/api/auth`
4. Test sign-in flow in your application

## Notes

- Tokens are stored in localStorage with key pattern: `convexAuth:{deployment-url}:token`
- Auth state persists across page refreshes
- No SvelteKit environment variables needed for auth (only `PUBLIC_CONVEX_URL` for client connection)
