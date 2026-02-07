/**
 * Performs a shallow equality check between two values.
 *
 * For arrays, compares each element using strict equality.
 * For other types, uses strict equality comparison.
 *
 * @template T The type of values being compared
 * @param v1 The first value to compare
 * @param v2 The second value to compare
 * @returns True if the values are equal, false otherwise
 */
export const isEqual = <T>(v1: T, v2: T): boolean => {
  if (typeof v1 !== typeof v2) return false;

  if (typeof v1 === "object" && v1 !== null && v2 !== null) {
    if (!Array.isArray(v1) || !Array.isArray(v2)) return v1 === v2;
    if (v1.length !== v2.length) return false;

    for (let i = 0; i < v1.length; i++) {
      if (v1[i] !== v2[i]) return false;
    }

    return true;
  }

  return v1 === v2;
};

/**
 * Checks if a value is undefined.
 *
 * @template T The type of the value being checked
 * @param value The value to check
 * @returns True if the value is undefined, false otherwise
 */
export const isUndef = <T>(value: T): boolean => typeof value === "undefined";
