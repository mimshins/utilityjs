import { useEffect, useState } from "react";

const __handoff__ = { isComplete: false };

export const useIsServerHandoffComplete = (): boolean => {
  const [isComplete, setIsComplete] = useState(__handoff__.isComplete);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => void (!isComplete && setIsComplete(true)), [isComplete]);

  useEffect(() => {
    if (!__handoff__.isComplete) __handoff__.isComplete = true;
  }, []);

  return isComplete;
};
