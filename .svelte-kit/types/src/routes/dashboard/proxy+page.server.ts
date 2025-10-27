// @ts-nocheck
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  const session = await locals.auth();

  if (!session) {
    throw redirect(302, "/api/auth/signin");
  }

  return {
    session,
  };
};
