import * as React from "react";

const DEFAULT_PREFIX = "UTILITYJS-GEN-ID";

let globalId = 0;
const useDeterministicId = (
  idOverride?: string,
  prefix = DEFAULT_PREFIX
): string | undefined => {
  const [defaultId, setDefaultId] = React.useState(idOverride);

  const id = idOverride || defaultId;

  React.useEffect(() => {
    if (defaultId == null) {
      // Fallback to this default id when possible.
      // Use the incrementing value for client-side rendering only.
      // We can't use it server-side.
      globalId += 1;
      setDefaultId(`${prefix.length ? prefix : DEFAULT_PREFIX}-${globalId}`);
    }
  }, [defaultId, prefix]);

  return id;
};

export default useDeterministicId;
