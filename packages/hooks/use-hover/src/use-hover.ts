import { useRegisterNodeRef } from "@utilityjs/use-register-node-ref";
import { useState, type Dispatch, type SetStateAction } from "react";

/**
 * A React hook that tracks whether the mouse is hovering over an element.
 *
 * @returns An object containing:
 *   - `isHovered`: Boolean indicating if the element is currently being hovered
 *   - `setIsHovered`: Function to manually set the hover state
 *   - `registerRef`: Function to register an element for hover tracking
 *
 * @example
 * ```tsx
 * function HoverExample() {
 *   const { isHovered, registerRef } = useHover();
 *
 *   return (
 *     <div ref={registerRef}>
 *       {isHovered ? "Hovering!" : "Not hovering"}
 *     </div>
 *   );
 * }
 * ```
 */
export const useHover = (): {
  isHovered: boolean;
  setIsHovered: Dispatch<SetStateAction<boolean>>;
  registerRef: <T extends HTMLElement>(node: T | null) => void;
} => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const registerRef = useRegisterNodeRef(node => {
    node.addEventListener("mouseenter", handleMouseEnter);
    node.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      node.removeEventListener("mouseenter", handleMouseEnter);
      node.removeEventListener("mouseleave", handleMouseLeave);
    };
  });

  return { isHovered, setIsHovered, registerRef };
};
