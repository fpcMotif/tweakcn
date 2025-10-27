# Linting & Formatting Configuration

This project uses a **best-practice dual-tool setup** for maximum performance and quality:

- 🚀 **Oxlint** for lightning-fast linting (48ms for 390 files!)
- 🎨 **Biome/Ultracite** for consistent formatting

## Philosophy

**Separation of Concerns:**
- **Linting** (Oxlint): Catch bugs, enforce best practices, find issues
- **Formatting** (Biome): Style consistency, auto-fix whitespace, organize imports

This approach gives you:
- ✅ Fastest possible lint checks (Oxlint is written in Rust)
- ✅ Opinionated, zero-config formatting (Ultracite/Biome)
- ✅ Minimal tool overlap and configuration maintenance

## Quick Commands

```bash
# Run lint checks (Oxlint)
bun run lint

# Run Biome lint checks (disabled by default, only used for format-related rules)
bun run lint:biome

# Format code (Biome/Ultracite)
bun run format

# Run both lint + format checks
bun run check
```

## Tool Responsibilities

### Oxlint (Primary Linter)
**Configuration:** `.oxlintrc.json`

Enabled rule sets:
- `typescript` - TypeScript-specific rules
- `react` - React best practices & hooks rules
- `react-perf` - Performance optimization rules
- `jsx-a11y` - Accessibility checks
- `nextjs` - Next.js specific rules
- `unicorn` - Modern JavaScript patterns
- `import` - Import/export validation

**Performance:**
- Written in Rust (part of Oxc project)
- 50-100x faster than ESLint
- Zero configuration needed
- Runs in ~50ms for hundreds of files

### Biome/Ultracite (Formatter)
**Configuration:** `biome.jsonc`

Responsibilities:
- Code formatting (indentation, line breaks, spacing)
- Import organization
- Consistent style across the codebase

**Note:** Biome's linter is **disabled** (`"linter": { "enabled": false }`) to avoid overlap with Oxlint.

## Pre-commit Hooks

**Lint-staged configuration** (`package.json`):

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["oxlint", "bun x ultracite fix"],
    "*.{json,jsonc,css,scss,md,mdx}": ["bun x ultracite fix"]
  }
}
```

**What happens on commit:**
1. TypeScript/JSX files → Oxlint check + Biome format
2. Other files (JSON, CSS, Markdown) → Biome format only

## VS Code Setup

**Required Extensions:**
- [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
- [Oxc](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) (optional but recommended)

**Settings** (`.vscode/settings.json`):

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "oxc.enable": true,
  "oxc.lint.enable": true
}
```

**Benefits:**
- ✅ Format on save (Biome)
- ✅ Organize imports on save (Biome)
- ✅ Real-time lint warnings (Oxc extension)
- ✅ Quick fixes available via VS Code

## CI/CD Integration

Add to your CI pipeline:

```yaml
# .github/workflows/ci.yml
- name: Lint
  run: bun run lint

- name: Format check
  run: bun run lint:biome
```

Or use the combined command:

```yaml
- name: Check code quality
  run: bun run check
```

## Common Issues & Solutions

### Issue: Oxlint warnings about unused variables

**Solution:** Prefix with underscore:
```typescript
// ❌ Bad
catch (error) { }

// ✅ Good
catch (_error) { }
```

### Issue: Biome and Oxlint conflict

**Solution:** This shouldn't happen as:
- Oxlint handles linting rules
- Biome handles formatting only (linter disabled)

If you see conflicts, check that `biome.jsonc` has `"linter": { "enabled": false }`.

### Issue: Import order different between tools

**Solution:** Use Biome's import organizer:
```bash
bun x ultracite fix --write
```

## Performance Comparison

| Tool | Time (390 files) | Language | Configuration |
|------|------------------|----------|---------------|
| Oxlint | ~48ms | Rust | Minimal |
| ESLint | ~4-5s | JavaScript | Complex |
| Biome (format) | ~12ms | Rust | Zero-config |

**Result:** 100x faster linting + formatting vs. ESLint + Prettier setup!

## Why Not Use ESLint?

ESLint is great but:
- ❌ Slower (JavaScript-based)
- ❌ Requires extensive configuration
- ❌ Needs many plugins for React/Next.js/TypeScript
- ❌ Slower development experience

Oxlint gives you:
- ✅ Out-of-the-box rules for React, Next.js, TypeScript
- ✅ 50-100x faster
- ✅ Minimal configuration
- ✅ Growing ecosystem (Oxc project)

## Why Separate Lint and Format?

**Historical context:**
- ESLint tried to do both (linting + formatting)
- This caused:
  - Performance issues
  - Configuration complexity
  - Conflicts with Prettier

**Modern approach:**
- **Dedicated linter** (Oxlint) - focuses on code correctness
- **Dedicated formatter** (Biome) - focuses on style consistency
- No overlap, maximum speed

## Migrating from ESLint

If you have ESLint config:

1. Remove ESLint dependencies:
   ```bash
   bun remove eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react
   ```

2. Keep your Oxlint config (already set up)

3. Run initial check:
   ```bash
   bun run lint
   bun run format
   ```

4. Update CI/CD scripts to use `bun run check`

## Future Enhancements

- [ ] Add `oxlint-disable` comments for specific false positives
- [ ] Custom Oxlint rules (when Oxc plugin system is stable)
- [ ] Integrate with Biome's upcoming features
- [ ] Add performance monitoring in CI

## Resources

- [Oxlint Documentation](https://oxc.rs/docs/guide/usage/linter.html)
- [Biome Documentation](https://biomejs.dev/)
- [Ultracite (Biome wrapper)](https://github.com/your-org/ultracite)
- [Oxc Project](https://github.com/oxc-project/oxc)

---

**Setup Date:** 2025-10-27  
**Maintained by:** Development Team

