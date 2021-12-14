import * as React from "react";

let globalId = 0;
const useDeterministicId = (idOverride?: string): string | undefined => {
  const [defaultId, setDefaultId] = React.useState(idOverride);

  const id = idOverride || defaultId;

  React.useEffect(() => {
    if (defaultId == null) {
      // Fallback to this default id when possible.
      // Use the incrementing value for client-side rendering only.
      // We can't use it server-side.
      globalId += 1;
      setDefaultId(`sonnat-generated-id-${globalId}`);
    }
  }, [defaultId]);

  return id;
};

export default useDeterministicId;
