# OKLCH Migration Plan for Tailwind CSS v4

## Overview

Migrate from HSL triple format to OKLCH triple format for all color tokens, following Tailwind CSS v4 best practices.

## Current State

- ✅ Already using Tailwind CSS v4
- ✅ Default theme colors already in OKLCH format (`config/theme.ts`)
- ✅ Color converter supports OKLCH format
- ❌ CSS variables generated as HSL triples (`hsl(var(--primary))`)
- ❌ `@theme inline` uses raw `var(--primary)` instead of `oklch(var(--primary))`
- ❌ Grid backgrounds use HSL/rgb(from) syntax

## Migration Steps

### Step 1: Update Color Formatter for OKLCH Triples

**File:** `utils/color-converter.ts`

**Change:** Modify `colorFormatter` to output OKLCH triples (not full `oklch()` function) for Tailwind v4

**Current behavior:**

- `oklch` format outputs: `oklch(0.84 0.16 84)` (full function)
- Need: `0.84 0.16 84` (triple only)

**Why:** Tailwind v4 `@theme inline` expects triples stored in CSS variables, then wrapped with `oklch()` in the theme definition.

---

### Step 2: Update Theme Style Generator

**File:** `utils/theme-style-generator.ts`

**Change:** Update `generateColorVariables` to output OKLCH triples directly

**Current behavior:**

- Uses `formatColor()` which wraps colors in functions
- Need: Output raw OKLCH triples (e.g., `0.84 0.16 84`)

**Why:** CSS variables should store triples, not full color functions.

---

### Step 3: Update globals.css @theme inline Block

**File:** `app/globals.css`

**Change:** Wrap color variables with `oklch()` function

**Current:**

```css
--color-primary: var(--primary);
```

**New:**

```css
--color-primary: oklch(var(--primary));
```

**Why:** Tailwind utilities need complete color values. Variables store triples, theme wraps them.

---

### Step 4: Create Reusable Grid Background Utility

**File:** `app/globals.css`

**Add:** A flexible `.bg-grid` utility class with customizable properties

**Why:** Clean, reusable pattern for grid backgrounds using OKLCH colors with alpha.

---

### Step 5: Update Generated Theme Code

**File:** `utils/theme-style-generator.ts`

**Change:** Ensure `generateTailwindV4ThemeInline` wraps colors with `oklch()`

**Why:** Generated theme code should match manual `globals.css` approach.

---

### Step 6: Update Default Theme Colors (if needed)

**File:** `config/theme.ts`

**Check:** Ensure all default colors are valid OKLCH triples

**Status:** ✅ Already using OKLCH format

---

### Step 7: Update Any Component Using Grid Backgrounds

**Search:** Find components using `bg-[linear-gradient(...)]` pattern

**Change:** Replace with `.bg-grid` utility or update to use `oklch(var(--token)/alpha)`

---

### Step 8: Test and Verify

- Test theme switching (light/dark)
- Verify all colors render correctly
- Check grid backgrounds display properly
- Test alpha transparency works
- Verify Tailwind utilities (`bg-primary`, `text-foreground`, etc.) work

---

## File-by-File Changes

### 1. `utils/color-converter.ts`

**Line 35:** Modify OKLCH case to return triple only

### 2. `utils/theme-style-generator.ts`

**Line 17-48:** Update `generateColorVariables` to handle OKLCH triples
**Line 140-193:** Update `generateTailwindV4ThemeInline` to wrap with `oklch()`

### 3. `app/globals.css`

**Line 7-39:** Update `@theme inline` to wrap colors with `oklch()`
**Add:** New `.bg-grid` utility class

### 4. Component files (if any)

**Search pattern:** `bg-[linear-gradient`
**Replace:** Use `.bg-grid` utility or update syntax

---

## Expected Result

### Before:

```css
:root {
  --primary: 222.2 47.4% 11.2%; /* HSL triple */
}

@theme inline {
  --color-primary: var(--primary);
}

/* Usage */
.bg-primary /* Works but HSL-based */
```

### After:

```css
:root {
  --primary: 0.62 0.12 262; /* OKLCH triple */
}

@theme inline {
  --color-primary: oklch(var(--primary));
}

/* Usage */
.bg-primary /* Works with OKLCH */
.bg-grid [--grid-color:oklch(var(--primary-foreground)/0.075)]
```

---

## Notes

- OKLCH triples: `L C h` (Lightness Chroma Hue)
- Store triples in CSS variables
- Wrap with `oklch()` in `@theme inline`
- Alpha: `oklch(var(--token)/0.5)`
- Browser support: Modern browsers (Safari 16.4+, Chrome 111+, Firefox 128+)
