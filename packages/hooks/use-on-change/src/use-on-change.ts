import { useGetLatest } from "@utilityjs/use-get-latest";
import { usePreviousValue } from "@utilityjs/use-previous-value";
import { useEffect } from "react";

/**
 * A React hook that invokes a callback anytime a value changes.
 *
 * This hook monitors a value and executes a callback function whenever the value
 * changes from its previous state. It's useful for side effects that should occur
 * in response to value changes, such as logging, analytics, or triggering other
 * operations when specific state changes occur.
 *
 * @template T The type of the value being monitored
 * @param value - The value to monitor for changes
 * @param onChange - Callback function to invoke when the value changes
 *
 * @example
 * ```tsx
 * import { useOnChange } from "@utilityjs/use-on-change";
 * import { useState } from "react";
 *
 * function UserProfile() {
 *   const [userId, setUserId] = useState(1);
 *
 *   useOnChange(userId, (newUserId) => {
 *     console.log(`User changed to: ${newUserId}`);
 *     // Fetch user data, update analytics, etc.
 *   });
 *
 *   return (
 *     <div>
 *       <button onClick={() => setUserId(userId + 1)}>
 *         Next User
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useOnChange = <T>(
  value: T,
  onChange: (current: T) => void,
): void => {
  const cachedOnChange = useGetLatest(onChange);
  const prevValue = usePreviousValue(value);

  useEffect(() => {
    if (value !== prevValue) cachedOnChange.current(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, prevValue]);
};
