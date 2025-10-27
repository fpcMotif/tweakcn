import { json } from "@sveltejs/kit";
import { GOOGLE_FONTS_API_KEY } from "$env/static/private";
import type { PaginatedFontsResponse } from "$types/fonts";
import { FALLBACK_FONTS } from "$utils/fonts";
import { fetchGoogleFonts } from "$utils/fonts/google-fonts";
import type { RequestHandler } from "./$types";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

// Simple cache for Google Fonts data (per deployment)
let cachedFonts: Array<any> | null = null;
let cacheTime = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

async function getCachedGoogleFonts(apiKey: string | undefined) {
  const now = Date.now();
  if (cachedFonts && now - cacheTime < CACHE_TTL) {
    return cachedFonts;
  }

  try {
    const fonts = await fetchGoogleFonts(apiKey);
    cachedFonts = fonts;
    cacheTime = now;
    return fonts;
  } catch {
    return FALLBACK_FONTS;
  }
}

export const GET: RequestHandler = async ({ url }) => {
  try {
    const query = url.searchParams.get("q")?.toLowerCase() || "";
    const category = url.searchParams.get("category")?.toLowerCase();
    const limit = Math.min(
      Number(url.searchParams.get("limit")) || DEFAULT_LIMIT,
      MAX_LIMIT
    );
    const offset = Number(url.searchParams.get("offset")) || 0;

    const googleFonts = await getCachedGoogleFonts(GOOGLE_FONTS_API_KEY);

    // Filter fonts based on search query and category
    let filteredFonts = googleFonts;

    if (query) {
      filteredFonts = filteredFonts.filter((font) =>
        font.family.toLowerCase().includes(query)
      );
    }

    if (category && category !== "all") {
      filteredFonts = filteredFonts.filter(
        (font) => font.category === category
      );
    }

    const paginatedFonts = filteredFonts.slice(offset, offset + limit);

    const response: PaginatedFontsResponse = {
      fonts: paginatedFonts,
      total: filteredFonts.length,
      offset,
      limit,
      hasMore: offset + limit < filteredFonts.length,
    };

    return json(response);
  } catch {
    return json({ error: "Failed to fetch fonts" }, { status: 500 });
  }
};
