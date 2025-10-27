import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
  // Auth is handled client-side with Convex
  // Server-side session will be implemented later
  return {
    session: null,
  };
};
