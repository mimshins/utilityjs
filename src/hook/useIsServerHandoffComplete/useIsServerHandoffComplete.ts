import * as React from "react";

const handoff = { isComplete: false };

const useIsServerHandoffComplete = (): boolean => {
  const [isComplete, setIsComplete] = React.useState(handoff.isComplete);

  React.useEffect(
    () => void (!isComplete && setIsComplete(true)),
    [isComplete]
  );

  React.useEffect(() => {
    if (!handoff.isComplete) handoff.isComplete = true;
  }, []);

  return isComplete;
};

export default useIsServerHandoffComplete;
