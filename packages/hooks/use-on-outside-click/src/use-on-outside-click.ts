import { useEventListener } from "@utilityjs/use-event-listener";
import { useGetLatest } from "@utilityjs/use-get-latest";
import { useRegisterNodeRef } from "@utilityjs/use-register-node-ref";
import { useRef } from "react";

/**
 * A React hook that invokes a callback when user clicks outside of the target element.
 *
 * This hook is commonly used for implementing dropdown menus, modals, tooltips,
 * and other UI components that should close when the user clicks outside of them.
 * It returns a ref callback that should be attached to the target element, and includes
 * an optional condition function for additional control over when the callback is triggered.
 *
 * @template T The type of HTML element (extends HTMLElement)
 * @param callback - Function to call when clicking outside the target
 * @param shouldTrigger - Optional condition function for additional filtering
 * @returns A ref callback to attach to the target element
 *
 * @example
 * ```tsx
 * import { useOnOutsideClick } from "@utilityjs/use-on-outside-click";
 * import { useState } from "react";
 *
 * function Dropdown() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const ref = useOnOutsideClick(() => {
 *     setIsOpen(false);
 *   });
 *
 *   return (
 *     <div ref={ref}>
 *       <button onClick={() => setIsOpen(!isOpen)}>
 *         Toggle Dropdown
 *       </button>
 *       {isOpen && (
 *         <div className="dropdown-menu">
 *           <div>Option 1</div>
 *           <div>Option 2</div>
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export const useOnOutsideClick = <T extends HTMLElement = HTMLElement>(
  callback: (event: MouseEvent) => void,
  shouldTrigger: (event: MouseEvent) => boolean = () => true,
): ((node: T | null) => void) => {
  const elementRef = useRef<T | null>(null);
  const cachedCallback = useGetLatest(callback);
  const cachedShouldTrigger = useGetLatest(shouldTrigger);

  useEventListener({
    /* v8 ignore next - SSR branch, window always defined in test env */
    target: typeof window === "undefined" ? null : document,
    eventType: "click",
    handler: event => {
      const element = elementRef.current;

      if (
        element !== null &&
        element !== event.target &&
        !element.contains(event.target as Node) &&
        cachedShouldTrigger.current(event)
      ) {
        cachedCallback.current(event);
      }
    },
  });

  return useRegisterNodeRef<T>(node => {
    elementRef.current = node;
  }, []);
};
