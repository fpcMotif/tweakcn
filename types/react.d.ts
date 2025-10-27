import "react";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function useEffectEvent<T extends (...args: any[]) => any>(callback: T): T;
}
