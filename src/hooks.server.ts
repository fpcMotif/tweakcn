import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  // For now, we'll handle auth client-side only
  // This is a placeholder that allows the app to run
  event.locals.auth = async () => null;

  return resolve(event);
};
