import { useCallback } from "react";
import { handleRef } from "./utils.ts";

/**
 * A React hook for forking/merging multiple refs into a single ref callback.
 *
 * This hook is useful when you need to pass multiple refs to a single element,
 * such as when combining your own ref with a forwarded ref from a parent component
 * or when using multiple libraries that each need their own ref.
 *
 * @template T The type of the element being referenced
 * @param refs Array of refs to fork/merge (can include undefined values)
 * @returns A single ref callback that will update all provided refs
 *
 * @example
 * ```tsx
 * function MyComponent({ forwardedRef }: { forwardedRef?: React.Ref<HTMLDivElement> }) {
 *   const internalRef = useRef<HTMLDivElement>(null);
 *   const mergedRef = useForkedRefs(internalRef, forwardedRef);
 *
 *   return <div ref={mergedRef}>Content</div>;
 * }
 *
 * // With multiple refs
 * function ComplexComponent() {
 *   const ref1 = useRef<HTMLInputElement>(null);
 *   const ref2 = useRef<HTMLInputElement>(null);
 *   const [ref3, setRef3] = useState<HTMLInputElement | null>(null);
 *
 *   const mergedRef = useForkedRefs(ref1, ref2, setRef3);
 *
 *   return <input ref={mergedRef} />;
 * }
 * ```
 */
export const useForkedRefs = <T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> => {
  return useCallback<React.RefCallback<T>>(
    instance => {
      refs.forEach(ref => {
        if (!ref) return;

        handleRef(ref, instance);
      });
    },
    [refs],
  );
};
