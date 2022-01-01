import * as React from "react";

const useGetLatest = <T>(value: T): React.MutableRefObject<T> => {
  const ref = React.useRef<T>(value);

  React.useEffect(() => void (ref.current = value));

  return ref;
};

export default useGetLatest;
