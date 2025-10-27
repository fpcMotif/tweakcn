import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cache } from "react";
import type { PaginatedFontsResponse } from "@/types/fonts";
import { FALLBACK_FONTS } from "@/utils/fonts";
import { fetchGoogleFonts } from "@/utils/fonts/google-fonts";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

const cachedFetchGoogleFonts = cache(async (apiKey: string | undefined) =>
  fetchGoogleFonts(apiKey)
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
    const category = searchParams.get("category")?.toLowerCase();
    const limit = Math.min(
      Number(searchParams.get("limit")) || DEFAULT_LIMIT,
      MAX_LIMIT
    );
    const offset = Number(searchParams.get("offset")) || 0;

    let googleFonts = FALLBACK_FONTS;

    try {
      googleFonts = await cachedFetchGoogleFonts(
        process.env.GOOGLE_FONTS_API_KEY
      );
    } catch {
      // Use fallback fonts
    }

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

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch fonts" },
      { status: 500 }
    );
  }
}
