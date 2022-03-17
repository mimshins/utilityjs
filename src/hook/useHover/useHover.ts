import useRegisterNodeRef from "@utilityjs/use-register-node-ref";
import * as React from "react";

const useHover = (): {
  isHovered: boolean;
  setIsHovered: React.Dispatch<React.SetStateAction<boolean>>;
  registerRef: ReturnType<typeof useRegisterNodeRef>;
} => {
  const [isHovered, setIsHovered] = React.useState(false);

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

export default useHover;
