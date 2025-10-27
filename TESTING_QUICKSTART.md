# Testing Quick Start Guide

## Installation

The testing dependencies are already in `package.json`. Install them with:

```bash
npm install
```

## Running Tests

### Run all tests (single run)
```bash
npm test
```

### Run tests in watch mode (auto-rerun on changes)
```bash
npm run test:watch
```

### Run tests with interactive UI
```bash
npm run test:ui
```

## What's Being Tested

### ✅ AI Usage Tracking (10 tests)
- Recording AI usage with token counts
- Getting usage statistics for different timeframes (1d, 7d, 30d)
- Authentication requirements

### ✅ Theme Management (12 tests)
- Creating themes with validation
- Enforcing 10-theme limit for free users
- Allowing unlimited themes for Pro users
- Updating themes with ownership checks

### ✅ Subscription Validation (8 tests)
- Free tier: 25 AI request limit
- Pro tier: unlimited requests
- Subscription status validation
- Usage tracking

**Total: 30 test cases**

## Test Output Example

```
✓ convex/test/aiUsage.test.ts (10)
  ✓ aiUsage (10)
    ✓ recordAIUsage (3)
      ✓ correctly records AI usage for a user
      ✓ handles optional token counts
      ✓ requires authentication
    ✓ getMyUsageStats (7)
      ✓ returns correct usage statistics for 1d timeframe
      ✓ returns correct usage statistics for 7d timeframe
      ✓ returns correct usage statistics for 30d timeframe
      ✓ returns zero requests for user with no usage
      ✓ requires authentication

Test Files  3 passed (3)
Tests       30 passed (30)
Duration    2.14s
```

## Troubleshooting

### Tests fail with "Cannot find module"
Make sure you've installed dependencies:
```bash
npm install
```

### Tests fail with schema errors
Regenerate Convex types:
```bash
npx convex dev
```

### Environment variable issues
The test setup automatically configures required environment variables. If you see related errors, check `convex/test/setup.ts`.

## Next Steps

- Read the full documentation: [convex/test/README.md](./convex/test/README.md)
- View implementation details: [TEST_IMPLEMENTATION_SUMMARY.md](./TEST_IMPLEMENTATION_SUMMARY.md)
- Learn about the project: [WARP.md](./WARP.md)

## Adding Your Own Tests

1. Create a new file in `convex/test/` with `.test.ts` extension
2. Import the necessary utilities:
   ```typescript
   import { convexTest } from "convex-test";
   import { describe, it, expect, beforeEach } from "vitest";
   import { api } from "../_generated/api";
   import schema from "../schema";
   ```
3. Write your tests following the patterns in existing test files
4. Run `npm test` to verify

## CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm test
```

## Questions?

See the detailed documentation:
- [convex/test/README.md](./convex/test/README.md) - Comprehensive testing guide
- [Vitest Docs](https://vitest.dev/) - Testing framework documentation
- [convex-test](https://github.com/get-convex/convex-test) - Convex testing library
