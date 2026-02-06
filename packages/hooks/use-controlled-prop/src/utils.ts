export const isEqual = <T>(v1: T, v2: T): boolean => {
  if (typeof v1 !== typeof v2) return false;
  if (typeof v1 === "object") {
    if (!Array.isArray(v1)) return false;
    else if (v1.length !== (v2 as typeof v1).length) return false;
    else {
      for (let i = 0; i < v1.length; i++) {
        if (v1[i] !== (v2 as typeof v1)[i]) return false;
      }
    }
  }

  return true;
};

export const isUndef = <T>(value: T): boolean => typeof value === "undefined";
