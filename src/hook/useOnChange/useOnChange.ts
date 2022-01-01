import useGetLatest from "@utilityjs/use-get-latest";
import usePreviousValue from "@utilityjs/use-previous-value";
import * as React from "react";

const useOnChange = <T>(value: T, onChange: (current: T) => void): void => {
  const cachedOnChange = useGetLatest(onChange);
  const prevValue = usePreviousValue(value);

  React.useEffect(() => {
    if (value !== prevValue) cachedOnChange.current(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, prevValue]);
};

export default useOnChange;
