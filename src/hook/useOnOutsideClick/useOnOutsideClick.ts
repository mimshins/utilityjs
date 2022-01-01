import useGetLatest from "@utilityjs/use-get-latest";
import useEventListener from "@utilityjs/use-event-listener";
import * as React from "react";

const useOnOutsideClick = <T extends HTMLElement = HTMLElement>(
  target: React.RefObject<T> | T | null,
  callback: (event: MouseEvent) => void,
  extendCondition: (event: MouseEvent) => boolean = () => true
): void => {
  const cachedCallback = useGetLatest(callback);

  useEventListener({
    target: typeof window === "undefined" ? null : document,
    eventType: "click",
    handler: event => {
      const element = target && "current" in target ? target.current : target;

      if (
        element !== null &&
        element !== event.target &&
        !element.contains(event.target as Node) &&
        extendCondition(event)
      ) {
        cachedCallback.current(event);
      }
    }
  });
};

export default useOnOutsideClick;
