import { v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { getCurrentUserId } from "./lib/auth";

const MAX_FREE_THEMES = 10; // Match the constant from lib/constants

// Validation errors
class ValidationError extends Error {
  constructor(
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

class ThemeNotFoundError extends Error {
  constructor(message = "Theme not found") {
    super(message);
    this.name = "ThemeNotFoundError";
  }
}

class ThemeLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ThemeLimitError";
  }
}

/**
 * Get all themes for the authenticated user
 */
export const getThemes = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("themes"),
      _creationTime: v.number(),
      userId: v.string(),
      name: v.string(),
      styles: v.any(),
    })
  ),
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);

    const themes = await ctx.db
      .query("themes")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return themes;
  },
});

/**
 * Get a single theme by ID with ownership check
 */
export const getTheme = query({
  args: { themeId: v.id("themes") },
  returns: v.union(
    v.object({
      _id: v.id("themes"),
      _creationTime: v.number(),
      userId: v.string(),
      name: v.string(),
      styles: v.any(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    const theme = await ctx.db.get(args.themeId);

    if (!theme) {
      return null;
    }

    // Ownership check
    if (theme.userId !== userId) {
      throw new ThemeNotFoundError("Theme not found or not owned by user");
    }

    return theme;
  },
});

/**
 * Internal query to count user's themes
 */
export const getUserThemeCount = internalQuery({
  args: { userId: v.string() },
  returns: v.number(),
  handler: async (ctx, args) => {
    const themes = await ctx.db
      .query("themes")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    return themes.length;
  },
});

/**
 * Create a new theme (with limit enforcement for free users)
 */
export const createTheme = mutation({
  args: {
    name: v.string(),
    styles: v.any(),
  },
  returns: v.id("themes"),
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);

    // Validate input
    if (!args.name || args.name.length === 0) {
      throw new ValidationError("Theme name cannot be empty");
    }
    if (args.name.length > 50) {
      throw new ValidationError("Theme name too long");
    }

    // Check theme limit
    const userThemes = await ctx.db
      .query("themes")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    if (userThemes.length >= MAX_FREE_THEMES) {
      // Check if user has active subscription
      const activeSubscriptions = await ctx.db
        .query("subscriptions")
        .withIndex("by_userId_and_status", (q) =>
          q.eq("userId", userId).eq("status", "active")
        )
        .collect();

      const hasProSubscription = activeSubscriptions.some(
        (sub) =>
          sub.productId === process.env.NEXT_PUBLIC_TWEAKCN_PRO_PRODUCT_ID
      );

      if (!hasProSubscription) {
        throw new ThemeLimitError(
          `You cannot have more than ${MAX_FREE_THEMES} themes.`
        );
      }
    }

    // Create theme
    const themeId = await ctx.db.insert("themes", {
      userId,
      name: args.name,
      styles: args.styles,
    });

    return themeId;
  },
});

/**
 * Update an existing theme with ownership check
 */
export const updateTheme = mutation({
  args: {
    id: v.id("themes"),
    name: v.optional(v.string()),
    styles: v.optional(v.any()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);

    // Get existing theme
    const theme = await ctx.db.get(args.id);

    if (!theme) {
      throw new ThemeNotFoundError();
    }

    // Ownership check
    if (theme.userId !== userId) {
      throw new ThemeNotFoundError("Theme not found or not owned by user");
    }

    // Validate input
    if (!args.name && !args.styles) {
      throw new ValidationError("No update data provided");
    }

    if (args.name !== undefined) {
      if (args.name.length === 0) {
        throw new ValidationError("Theme name cannot be empty");
      }
      if (args.name.length > 50) {
        throw new ValidationError("Theme name too long");
      }
    }

    // Update theme
    const updateData: any = {};
    if (args.name !== undefined) updateData.name = args.name;
    if (args.styles !== undefined) updateData.styles = args.styles;

    await ctx.db.patch(args.id, updateData);

    return null;
  },
});

/**
 * Delete a theme with ownership check
 */
export const deleteTheme = mutation({
  args: { themeId: v.id("themes") },
  returns: v.object({
    id: v.id("themes"),
    name: v.string(),
  }),
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);

    // Get existing theme
    const theme = await ctx.db.get(args.themeId);

    if (!theme) {
      throw new ThemeNotFoundError();
    }

    // Ownership check
    if (theme.userId !== userId) {
      throw new ThemeNotFoundError("Theme not found or not owned by user");
    }

    // Delete theme
    await ctx.db.delete(args.themeId);

    return {
      id: args.themeId,
      name: theme.name,
    };
  },
});
