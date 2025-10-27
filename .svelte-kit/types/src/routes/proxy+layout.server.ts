// @ts-nocheck
import type { LayoutServerLoad } from "./$types";

export const load = async () => {
  // Auth is handled client-side with Convex
  // Server-side session will be implemented later
  return {
    session: null,
  };
};
;null as any as LayoutServerLoad;