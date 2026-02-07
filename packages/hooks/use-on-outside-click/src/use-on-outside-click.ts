import { useEventListener } from "@utilityjs/use-event-listener";
import { useGetLatest } from "@utilityjs/use-get-latest";
import type { RefObject } from "react";

/**
 * A React hook that invokes a callback when user clicks outside of the target element.
 *
 * This hook is commonly used for implementing dropdown menus, modals, tooltips,
 * and other UI components that should close when the user clicks outside of them.
 * It supports both ref objects and direct element references, and includes an
 * optional condition function for additional control over when the callback is triggered.
 *
 * @template T The type of HTML element (extends HTMLElement)
 * @param target - The target element, ref object, or null
 * @param callback - Function to call when clicking outside the target
 * @param extendCondition - Optional condition function for additional filtering
 *
 * @example
 * ```tsx
 * import { useOnOutsideClick } from "@utilityjs/use-on-outside-click";
 * import { useRef, useState } from "react";
 *
 * function Dropdown() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const dropdownRef = useRef<HTMLDivElement>(null);
 *
 *   useOnOutsideClick(dropdownRef, () => {
 *     setIsOpen(false);
 *   });
 *
 *   return (
 *     <div ref={dropdownRef}>
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
  target: RefObject<T> | T | null,
  callback: (event: MouseEvent) => void,
  extendCondition: (event: MouseEvent) => boolean = () => true,
): void => {
  const cachedCallback = useGetLatest(callback);

  useEventListener({
    /* v8 ignore next - SSR branch, window always defined in test env */
    target: typeof window === "undefined" ? null : document,
    eventType: "click",
    handler: event => {
      const element = target && "current" in target ? target.current : target;

      if (
        element !== null &&
        element !== event.target &&
        !element.contains(event.target as Node) &&
        extendCondition(event)
      ) {
        cachedCallback.current(event);
      }
    },
  });
};
