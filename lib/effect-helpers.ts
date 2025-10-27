import { Console, Effect, pipe } from "effect";

/**
 * Effect-TS helper function: safely execute side effects and handle errors
 */
export const safeApiCall = <T>(
  operation: () => Promise<T>,
  errorMessage = "Operation failed"
) =>
  pipe(
    Effect.tryPromise({
      try: operation,
      catch: (error) => ({
        _tag: "ApiError" as const,
        message: errorMessage,
        cause: error,
      }),
    }),
    Effect.tap(() => Console.log(`Executing: ${errorMessage}`)),
    Effect.catchAll((error) =>
      pipe(
        Console.error(`Error: ${error.message}`, error.cause),
        Effect.andThen(() => Effect.fail(error))
      )
    )
  );

export type ApiError = {
  _tag: "ApiError";
  message: string;
  cause: unknown;
};
