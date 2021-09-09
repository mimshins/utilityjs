import * as React from "react";

const isEqual = <T>(v1: T, v2: T): boolean => {
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

const useControlledProp = <T>(
  controlledValue: T,
  defaultValue: T
): [
  value: Exclude<T, undefined>,
  updater: (value: React.SetStateAction<NonNullable<T>>) => void,
  isControlled: boolean
] => {
  const { current: isControlled } = React.useRef(controlledValue !== undefined);
  const { current: _default_ } = React.useRef(defaultValue);

  const [uncontrolledValue, setUncontrolledValue] = React.useState(_default_);

  const value = isControlled ? controlledValue : uncontrolledValue;

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (
        !isControlled &&
        _default_ !== defaultValue &&
        !isEqual(_default_, defaultValue)
      ) {
        // eslint-disable-next-line no-console
        console.error(
          [
            `UtilityJS: A component is changing the defaultValue state of an uncontrolled prop after being initialized.`,
            `To suppress this warning use a controlled prop.`
          ].join(" ")
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (isControlled !== (controlledValue !== undefined)) {
        // eslint-disable-next-line no-console
        console.error(
          [
            `UtilityJS: A component is changing the ${
              isControlled ? "" : "un"
            }controlled state of a prop to be ${
              isControlled ? "un" : ""
            }controlled.`,
            `Decide between using a controlled or uncontrolled prop ` +
              "for the lifetime of the component.",
            "The nature of the prop state is determined during the first render, it's considered controlled if the state is not `undefined`."
          ].join("\n")
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [controlledValue]);

    if (controlledValue === undefined && defaultValue === undefined) {
      // eslint-disable-next-line no-console
      console.error(
        [
          `UtilityJS: Both \`controlledValue\` and \`defaultValue\` parameters of the prop are \`undefined\`!`,
          `To suppress this warning use a valid \`controlledValue\` or \`defaultValue\`.`
        ].join(" ")
      );
    }
  }

  return [
    value as Exclude<T, undefined>,
    React.useCallback((newValue: React.SetStateAction<NonNullable<T>>) => {
      if (!isControlled) setUncontrolledValue(newValue as NonNullable<T>);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
    isControlled
  ];
};

export default useControlledProp;
