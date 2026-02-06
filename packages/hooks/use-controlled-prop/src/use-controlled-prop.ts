import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { isEqual, isUndef } from "./utils.ts";

/**
 * A React hook that manages controlled and uncontrolled prop patterns.
 *
 * This hook helps components support both controlled and uncontrolled usage patterns
 * by managing the state internally when no controlled value is provided, while
 * deferring to the controlled value when it is provided.
 *
 * @template T The type of the value being controlled
 * @param controlledValueProp The controlled value from props (undefined for uncontrolled)
 * @param defaultValueProp The default value for uncontrolled usage
 * @param fallbackValue The fallback value when both controlled and default are undefined
 * @returns A tuple containing [currentValue, setter, isControlled]
 *
 * @example
 * ```tsx
 * function MyInput({ value, defaultValue, onChange }) {
 *   const [inputValue, setInputValue, isControlled] = useControlledProp(
 *     value,
 *     defaultValue,
 *     ""
 *   );
 *
 *   const handleChange = (e) => {
 *     const newValue = e.target.value;
 *     setInputValue(newValue);
 *     onChange?.(newValue);
 *   };
 *
 *   return <input value={inputValue} onChange={handleChange} />;
 * }
 * ```
 */
export const useControlledProp = <T>(
  controlledValueProp: T | undefined,
  defaultValueProp: T | undefined,
  fallbackValue: T,
): [
  value: T,
  setUncontrolledValue: Dispatch<SetStateAction<T>>,
  isControlled: boolean,
] => {
  const { current: isControlled } = useRef(!isUndef(controlledValueProp));
  const { current: defaultValue } = useRef(defaultValueProp);

  const { current: fallback } = useRef<T | undefined>(
    isUndef(controlledValueProp)
      ? isUndef(defaultValueProp)
        ? fallbackValue
        : defaultValueProp
      : undefined,
  );

  if (process.env["NODE_ENV"] !== "production") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (
        !isControlled &&
        defaultValue !== defaultValueProp &&
        !isEqual(defaultValue, defaultValueProp)
      ) {
        // eslint-disable-next-line no-console
        console.error(
          [
            `[@utilityjs/use-controlled-prop]: A component is changing the defaultValue state of an uncontrolled prop after being initialized.`,
            `To suppress this warning use a controlled prop.`,
          ].join(" "),
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValueProp]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (isControlled !== !isUndef(controlledValueProp)) {
        // eslint-disable-next-line no-console
        console.error(
          [
            `[@utilityjs/use-controlled-prop]: A component is changing the ${
              isControlled ? "" : "un"
            }controlled state of a prop to be ${
              isControlled ? "un" : ""
            }controlled.`,
            "Decide between using a controlled or uncontrolled prop " +
              "for the lifetime of the component.",
            "The nature of the prop's state is determined during the first render, it's considered controlled if the prop is not `undefined`.",
          ].join("\n"),
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [controlledValueProp]);

    if (
      isUndef(controlledValueProp) &&
      isUndef(defaultValueProp) &&
      isUndef(fallbackValue)
    ) {
      // eslint-disable-next-line no-console
      console.error(
        [
          "[@utilityjs/use-controlled-prop]: The values you provide are `undefined`!",
          "To suppress this warning use a valid non-undefined controlled, default or fallback value.",
        ].join(" "),
      );
    }
  }

  const [uncontrolledValue, setUncontrolledValue] = useState(fallback);
  const value = isControlled ? controlledValueProp : uncontrolledValue;

  return [
    value as T,
    useCallback((newValue: SetStateAction<T>) => {
      if (!isControlled) setUncontrolledValue(newValue as T);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
    isControlled,
  ];
};
