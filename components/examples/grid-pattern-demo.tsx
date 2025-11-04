import { GridPattern, GridPatternSimple } from "@/components/ui/grid-pattern";

/**
 * Demo component showing different grid pattern variations
 * This file demonstrates how to use the GridPattern component
 */
export function GridPatternDemo() {
  return (
    <div className="space-y-20 p-8">
      {/* Example 1: Using GridPatternSimple with presets */}
      <section className="relative rounded-lg border p-12 overflow-hidden">
        <GridPatternSimple variant="subtle" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">Subtle Grid Pattern</h2>
          <p className="text-muted-foreground">
            Using GridPatternSimple with variant="subtle"
          </p>
          <code className="mt-4 block text-sm bg-muted p-2 rounded">
            {`<GridPatternSimple variant="subtle" />`}
          </code>
        </div>
      </section>

      {/* Example 2: Custom GridPattern */}
      <section className="relative rounded-lg border p-12 overflow-hidden bg-primary/5">
        <GridPattern color="primary" opacity={0.1} size={3} />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">Custom Grid Pattern</h2>
          <p className="text-muted-foreground">
            Custom opacity (0.1), size (3rem), and color (primary)
          </p>
          <code className="mt-4 block text-sm bg-muted p-2 rounded">
            {`<GridPattern opacity={0.1} size={3} color="primary" />`}
          </code>
        </div>
      </section>

      {/* Example 3: Medium grid */}
      <section className="relative rounded-lg border p-12 overflow-hidden">
        <GridPatternSimple variant="medium" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">Medium Grid Pattern</h2>
          <p className="text-muted-foreground">
            Default medium variant - good for most use cases
          </p>
        </div>
      </section>

      {/* Example 4: Bold grid */}
      <section className="relative rounded-lg border p-12 overflow-hidden bg-muted/30">
        <GridPatternSimple variant="bold" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">Bold Grid Pattern</h2>
          <p className="text-muted-foreground">
            Higher opacity for more visible grid lines
          </p>
        </div>
      </section>

      {/* Example 5: Fine grid */}
      <section className="relative rounded-lg border p-12 overflow-hidden">
        <GridPatternSimple variant="fine" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">Fine Grid Pattern</h2>
          <p className="text-muted-foreground">
            Very subtle with smaller grid cells
          </p>
        </div>
      </section>

      {/* Example 6: Hero section style */}
      <section className="relative min-h-[400px] rounded-lg border overflow-hidden bg-gradient-to-br from-primary/10 to-transparent">
        <GridPattern color="primary-foreground" opacity={0.075} size={4} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-bold mb-4">Hero Section Example</h2>
            <p className="text-muted-foreground max-w-md">
              Perfect for hero sections, CTAs, and prominent sections
            </p>
          </div>
        </div>
      </section>

      {/* Example 7: Inline usage (like your original code) */}
      <section className="relative rounded-lg border p-12 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--primary-foreground)_7.5%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--primary-foreground)_7.5%,transparent)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">Inline Usage</h2>
          <p className="text-muted-foreground mb-4">
            You can still use the inline Tailwind classes directly:
          </p>
          <code className="block text-xs bg-muted p-4 rounded overflow-x-auto">
            {`<div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--primary-foreground)_7.5%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--primary-foreground)_7.5%,transparent)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>`}
          </code>
        </div>
      </section>
    </div>
  );
}
