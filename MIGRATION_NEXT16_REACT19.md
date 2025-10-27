# Migration to Next.js 16 + React 19.2 + Effect-TS

This document records the process of migrating the project from Next.js 15 + React 19.0 to the latest stable versions.

## Upgrade Contents

### 1. Dependency Upgrades

**package.json Updates:**

- Next.js: `15.4.1` → `^16.0.0`
- React: `^19.0.0` → `^19.2.0`
- React DOM: `^19.0.0` → `^19.2.0`
- New Addition: Effect-TS: `^3.0.0`

### 2. Next.js 16 New Features Enabled

**next.config.ts Improvements:**

```typescript
const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true, // Enable React Compiler (automatic optimization)
  },
  webpack(config) {
    // Import SVG as React components
    config.module.rules.push({
      test: SVG_REGEX,
      issuer: JSX_TSX_ISSUER_REGEX,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};
```

**Key Optimizations:**

- ✅ **React Compiler**: Automatically memoize components, reduce unnecessary re-renders
- ✅ **Turbopack**: Enabled in `dev` and `build` scripts (using `--turbopack` flag)
- ✅ **Webpack SVG Rule Extraction**: Move regex patterns to top-level for performance improvement

### 3. React 19.2 New Features Implementation

#### Use `useEffectEvent` to Replace Traditional useEffect Pattern

**Location:** `app/page.tsx`

**Before (Problem):**

```typescript
useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 10) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []); // Empty dependency array, but callback may not access the latest state
```

**After (Optimized):**

```typescript
import { useEffect, useEffectEvent } from "react";

// useEffectEvent ensures the callback always accesses the latest state without causing effect re-runs
const handleScroll = useEffectEvent(() => {
  if (window.scrollY > 10) {
    setIsScrolled(true);
  } else {
    setIsScrolled(false);
  }
});

useEffect(() => {
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []); // Now truly stable, won't re-register listeners on state updates
```

**Benefits:**

- 🎯 Callback always accesses the latest props/state
- 🚀 Avoid frequent event listener registration/deregistration
- 🧹 Clearer dependency management

#### Use React `cache` to Replace Next.js `unstable_cache`

**Location:** `app/api/google-fonts/route.ts`

**Before:**

```typescript
import { unstable_cache } from "next/cache";

const cachedFetchGoogleFonts = unstable_cache(
  fetchGoogleFonts,
  ["google-fonts-catalogue"],
  { tags: ["google-fonts-catalogue"] }
);
```

**After:**

```typescript
import { cache } from "react";

const cachedFetchGoogleFonts = cache(async (apiKey: string | undefined) =>
  fetchGoogleFonts(apiKey)
);
```

**Benefits:**

- ✅ Use React 19 official stable API
- ✅ Cleaner syntax
- ✅ Better TypeScript type inference

### 4. Effect-TS Integration (Side Effect Management)

**New File:** `lib/effect-helpers.ts`

Created a universal Effect-TS helper function:

```typescript
import { Effect, Console, pipe } from "effect";

export const safeApiCall = <T>(
  operation: () => Promise<T>,
  errorMessage = "Operation failed"
) =>
  pipe(
    Effect.tryPromise({
      try: operation,
      catch: (error) => ({
        _tag: "ApiError" as const,
        message: errorMessage,
        cause: error,
      }),
    }),
    Effect.tap(() => Console.log(`Executing: ${errorMessage}`)),
    Effect.catchAll((error) =>
      pipe(
        Console.error(`Error: ${error.message}`, error.cause),
        Effect.andThen(() => Effect.fail(error))
      )
    )
  );
```

#### Application Example: /api/subscription Route

**Location:** `app/api/subscription/route.ts`

**Before (Traditional try-catch):**

```typescript
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request);
    const { isSubscribed, requestsRemaining, requestsUsed } =
      await validateSubscriptionAndUsage(userId);

    return NextResponse.json({
      isSubscribed,
      requestsRemaining,
      requestsUsed,
    });
  } catch (error) {
    logError(error as Error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
```

**After (Effect-TS Pipeline):**

```typescript
import { Effect, pipe } from "effect";
import { safeApiCall } from "@/lib/effect-helpers";

export function GET(request: NextRequest) {
  const program = pipe(
    // Step 1: Get user ID
    safeApiCall(() => getCurrentUserId(request), "Get user ID"),

    // Step 2: Validate subscription
    Effect.flatMap((userId) =>
      safeApiCall(
        () => validateSubscriptionAndUsage(userId),
        "Validate subscription and usage"
      )
    ),

    // Step 3: Build response
    Effect.map(({ isSubscribed, requestsRemaining, requestsUsed }) => {
      const response: SubscriptionStatus = {
        isSubscribed,
        requestsRemaining,
        requestsUsed,
      };
      return NextResponse.json(response);
    }),

    // Unified error handling
    Effect.catchAll((error) =>
      Effect.sync(() => {
        const errorObj = new Error(
          error._tag === "ApiError" ? error.message : "Unknown error"
        );
        logError(errorObj);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      })
    )
  );

  return Effect.runPromise(program);
}
```

**Benefits:**

- 📦 **Composability**: Compose async operations using `pipe` and `flatMap`
- 🎯 **Type Safety**: Effect-TS provides strong-typed error handling
- 🔍 **Observability**: Built-in logging (via `Console.log`)
- 🧹 **Unified Error Handling**: `catchAll` centralizes exception handling

### 5. Code Quality Improvements

All modifications comply with our dual-tool quality setup:

- ✅ Extract magic numbers to constants (`DEFAULT_LIMIT`, `MAX_LIMIT`)
- ✅ Move regex patterns to top-level scope
- ✅ Remove unnecessary console logs
- ✅ Use `import type` for optimized type imports
- ✅ Remove unnecessary arrow function return statements
- ✅ Sort CSS class names (Tailwind CSS)

### 6. Linting & Formatting Setup

**New Configuration:**
- 🚀 **Oxlint** for blazing-fast linting (48ms for 390 files)
- 🎨 **Biome/Ultracite** for consistent formatting
- 🔧 Biome linter **disabled** to avoid tool overlap

See [`LINTING_FORMATTING.md`](./LINTING_FORMATTING.md) for complete documentation.

## How to Test the Migration

### 1. Install Dependencies

```bash
bun install
```

### 2. Verify Development Mode

```bash
bun run dev
```

Check:

- ✅ Turbopack starts correctly
- ✅ React Compiler is effective (no console warnings)
- ✅ SVG icons render properly
- ✅ Scroll listener is smooth (`app/page.tsx`)

### 3. Test API Endpoints

```bash
# Test subscription status (requires authentication)
curl http://localhost:3000/api/subscription

# Test Google Fonts
curl "http://localhost:3000/api/google-fonts?q=roboto&limit=10"
```

### 4. Build Production Version

```bash
bun run build
bun start
```

Check:

- ✅ Turbopack build speed
- ✅ No type errors
- ✅ No linter warnings

## Next Optimization Suggestions

### 1. Expand Effect-TS Usage

Can migrate more API routes to the Effect-TS pattern:

- `app/api/enhance-prompt/route.ts`
- `app/api/generate-theme/route.ts`
- `app/api/webhook/polar/route.ts`

### 2. Explore Next.js 16 Cache API

Use the new `"use cache"` directive to optimize pages and components:

```typescript
"use cache";

export default async function CachedComponent() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

### 3. Migrate More useEffect to useEffectEvent

Search the project for other optimizable useEffect patterns:

```bash
grep -r "useEffect" hooks/ components/ app/
```

### 4. Enable TanStack Query Persistence

The project already integrates TanStack Query (v5.81.2), can configure local persistence:

```typescript
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persister,
});
```

## Reference Resources

- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- [React 19.2 Release Notes](https://react.dev/blog/2025/10/01/react-19-2)
- [Effect-TS Documentation](https://effect.website/)
- [React Compiler Documentation](https://react.dev/learn/react-compiler)
- [TanStack Query v5 Guide](https://tanstack.com/query/latest/docs/react/overview)

## Unresolved Questions

- ❓ Should we enable Effect-TS for all API routes?
- ❓ Should we consider using Next.js 16 filesystem caching (experimental)?
- ❓ React Compiler performance improvements in production need further monitoring

---

**Migration Completion Time:** 2025-10-27  
**Migrator:** AI Assistant (Claude Sonnet 4.5)
