import { cn } from "@/lib/utils";

type GridPatternProps = {
  /**
   * Opacity of the grid lines (0-1)
   * @default 0.075
   */
  opacity?: number;
  /**
   * Size of each grid cell in rem
   * @default 4
   */
  size?: number;
  /**
   * CSS variable name for the color
   * @default "primary-foreground"
   */
  color?:
    | "primary-foreground"
    | "muted-foreground"
    | "primary"
    | "muted"
    | "foreground";
  /**
   * Thickness of grid lines in pixels
   * @default 1
   */
  lineWidth?: number;
  /**
   * Additional className
   */
  className?: string;
};

/**
 * GridPattern - A reusable grid pattern background component
 *
 * Creates a subtle grid overlay using CSS linear gradients.
 * Perfect for adding texture to sections without being distracting.
 *
 * @example
 * ```tsx
 * <section className="relative">
 *   <GridPattern />
 *   <div>Your content</div>
 * </section>
 * ```
 *
 * @example
 * ```tsx
 * <GridPattern
 *   opacity={0.05}
 *   size={3}
 *   color="muted-foreground"
 * />
 * ```
 */
export function GridPattern({
  opacity = 0.075,
  size = 4,
  color = "primary-foreground",
  lineWidth = 1,
  className,
}: GridPatternProps) {
  const colorVar = `--${color}`;
  const opacityPercent = Math.round(opacity * 1000) / 10;

  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 -z-10", className)}
      style={{
        backgroundImage: `linear-gradient(to_right, rgba(from_var(${colorVar}) r g b / ${opacity}) ${lineWidth}px, transparent ${lineWidth}px), linear-gradient(to_bottom, rgba(from_var(${colorVar}) r g b / ${opacity}) ${lineWidth}px, transparent ${lineWidth}px)`,
        backgroundSize: `${size}rem ${size}rem`,
      }}
    />
  );
}

/**
 * GridPatternSimple - Simplified version with preset variations
 *
 * @example
 * ```tsx
 * <GridPatternSimple variant="subtle" />
 * <GridPatternSimple variant="medium" />
 * <GridPatternSimple variant="bold" />
 * ```
 */
export function GridPatternSimple({
  variant = "medium",
  className,
}: {
  variant?: "subtle" | "medium" | "bold" | "fine";
  className?: string;
}) {
  const variants = {
    subtle: {
      opacity: 0.05,
      size: 3,
      color: "muted-foreground" as const,
    },
    medium: {
      opacity: 0.075,
      size: 4,
      color: "primary-foreground" as const,
    },
    bold: {
      opacity: 0.25,
      size: 2.5,
      color: "primary" as const,
    },
    fine: {
      opacity: 0.025,
      size: 2,
      color: "muted-foreground" as const,
    },
  };

  const config = variants[variant];

  return (
    <GridPattern
      className={className}
      color={config.color}
      opacity={config.opacity}
      size={config.size}
    />
  );
}
