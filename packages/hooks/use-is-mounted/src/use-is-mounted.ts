import { useCallback, useEffect, useRef } from "react";

/**
 * A React hook that tracks whether the component is currently mounted.
 * Useful for preventing state updates on unmounted components.
 *
 * @returns A function that returns true if the component is mounted, false otherwise
 *
 * @example
 * ```tsx
 * function AsyncComponent() {
 *   const [data, setData] = useState(null);
 *   const [loading, setLoading] = useState(false);
 *   const isMounted = useIsMounted();
 *
 *   const fetchData = async () => {
 *     setLoading(true);
 *     try {
 *       const response = await fetch('/api/data');
 *       const result = await response.json();
 *
 *       // Only update state if component is still mounted
 *       if (isMounted()) {
 *         setData(result);
 *         setLoading(false);
 *       }
 *     } catch (error) {
 *       if (isMounted()) {
 *         setLoading(false);
 *       }
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={fetchData}>Fetch Data</button>
 *       {loading && <p>Loading...</p>}
 *       {data && <p>Data: {JSON.stringify(data)}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export const useIsMounted = (): (() => boolean) => {
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => void (isMountedRef.current = false);
  }, []);

  return useCallback(() => isMountedRef.current, []);
};
