import * as React from "react";

const useForceRerender = (): (() => void) => {
  const [, setState] = React.useState({});
  return React.useCallback(() => void setState({}), []);
};

export default useForceRerender;
