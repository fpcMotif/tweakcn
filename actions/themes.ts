"use server";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

/**
 * Server action to get all themes for the authenticated user
 */
export async function getThemes() {
  const token = await convexAuthNextjsToken();

  const themes = await fetchQuery(api.themes.getThemes, {}, { token });

  return themes.map((theme) => ({
    id: theme._id,
    name: theme.name,
    styles: theme.styles,
    _creationTime: theme._creationTime,
    createdAt: new Date(theme._creationTime),
  }));
}

/**
 * Server action to get a single theme by ID
 */
export async function getTheme(themeId: string | Id<"themes">) {
  const token = await convexAuthNextjsToken();

  const theme = await fetchQuery(
    api.themes.getTheme,
    { themeId: themeId as Id<"themes"> },
    { token }
  );

  if (!theme) {
    return null;
  }

  return {
    id: theme._id,
    name: theme.name,
    styles: theme.styles,
    _creationTime: theme._creationTime,
    createdAt: new Date(theme._creationTime),
  };
}

/**
 * Server action to create a new theme
 */
export async function createTheme(data: { name: string; styles: any }) {
  const token = await convexAuthNextjsToken();

  const themeId = await fetchMutation(
    api.themes.createTheme,
    { name: data.name, styles: data.styles },
    { token }
  );

  const theme = await fetchQuery(api.themes.getTheme, { themeId }, { token });

  if (!theme) {
    throw new Error("Failed to create theme");
  }

  return {
    id: theme._id,
    name: theme.name,
    styles: theme.styles,
    _creationTime: theme._creationTime,
    createdAt: new Date(theme._creationTime),
  };
}

/**
 * Server action to update a theme
 */
export async function updateTheme(data: {
  id: string;
  name?: string;
  styles?: any;
}) {
  const token = await convexAuthNextjsToken();

  await fetchMutation(
    api.themes.updateTheme,
    {
      id: data.id as Id<"themes">,
      name: data.name,
      styles: data.styles,
    },
    { token }
  );

  const theme = await fetchQuery(
    api.themes.getTheme,
    { themeId: data.id as Id<"themes"> },
    { token }
  );

  if (!theme) {
    throw new Error("Failed to update theme");
  }

  return {
    id: theme._id,
    name: theme.name,
    styles: theme.styles,
    _creationTime: theme._creationTime,
    createdAt: new Date(theme._creationTime),
  };
}

/**
 * Server action to delete a theme
 */
export async function deleteTheme(themeId: string) {
  const token = await convexAuthNextjsToken();

  const theme = await fetchQuery(
    api.themes.getTheme,
    { themeId: themeId as Id<"themes"> },
    { token }
  );

  if (!theme) {
    throw new Error("Theme not found");
  }

  await fetchMutation(
    api.themes.deleteTheme,
    { themeId: themeId as Id<"themes"> },
    { token }
  );

  return {
    id: theme._id,
    name: theme.name,
  };
}
