import { useRegisterNodeRef } from "@utilityjs/use-register-node-ref";
import { useState, type Dispatch, type SetStateAction } from "react";

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
