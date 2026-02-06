import { useEffect, useState } from "react";

/**
 * Global handoff state to track SSR completion across all hook instances.
 */
const __handoff__ = { isComplete: false };

/**
 * A React hook that returns `true` if the SSR handoff completes.
 *
 * This hook is useful for detecting when the client-side hydration has completed
 * and the application has fully transitioned from server-side rendering to
 * client-side rendering. It helps prevent hydration mismatches and ensures
 * client-only code runs at the appropriate time.
 *
 * @returns A boolean indicating whether the SSR handoff is complete
 *
 * @example
 * ```tsx
 * import { useIsServerHandoffComplete } from "@utilityjs/use-is-server-handoff-complete";
 *
 * function MyComponent() {
 *   const isHandoffComplete = useIsServerHandoffComplete();
 *
 *   if (!isHandoffComplete) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   return <div>Client-side content</div>;
 * }
 * ```
 */
export const useIsServerHandoffComplete = (): boolean => {
  const [isComplete, setIsComplete] = useState(__handoff__.isComplete);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => void (!isComplete && setIsComplete(true)), [isComplete]);

  useEffect(() => {
    if (!__handoff__.isComplete) __handoff__.isComplete = true;
  }, []);

  return isComplete;
};
