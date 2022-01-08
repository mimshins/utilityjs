import useGetLatest from "@utilityjs/use-get-latest";
import useRegisterNodeRef from "@utilityjs/use-register-node-ref";
import * as React from "react";

type TargetEvent = MouseEvent | TouchEvent;

type Coordinates = { x: number; y: number };

interface Options {
  pressDelay?: number;
  moveThreshold?: number;
  preventContextMenuOnLongPress?: boolean;
  preventLongPressOnMove?: boolean;
}

interface HookReturn {
  registerNode: <T extends HTMLElement>(node: T | null) => void;
}

const isTouch = (event: Event): event is TouchEvent =>
  TouchEvent ? event instanceof TouchEvent : "touches" in event;

const isMouse = (event: Event): event is MouseEvent =>
  event instanceof MouseEvent;

const calcPosition = (event: TargetEvent): Coordinates | null => {
  return isTouch(event)
    ? { x: event.touches[0].pageX, y: event.touches[0].pageY }
    : isMouse(event)
    ? { x: event.pageX, y: event.pageY }
    : null;
};

const useLongPress = (
  callback: () => void,
  options: Options = {}
): HookReturn => {
  const {
    pressDelay = 500,
    moveThreshold = 25,
    preventContextMenuOnLongPress = false,
    preventLongPressOnMove = false
  } = options;

  const callbackRef = useGetLatest(callback);

  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const startPositionsRef = React.useRef<Coordinates | null>(null);

  const isPressedRef = React.useRef(false);

  const startLongPress = (event: TargetEvent) => {
    // Ignore events other than mouse and touch
    if (!isMouse(event) && !isTouch(event)) return;

    if (isPressedRef.current) return;

    // Main button pressed
    isPressedRef.current = isMouse(event) ? event.button === 0 : true;
    startPositionsRef.current = calcPosition(event);

    timeoutRef.current = setTimeout(
      () => void callbackRef.current?.(),
      pressDelay
    );
  };

  const stopLongPress = (event: TargetEvent) => {
    // Ignore events other than mouse and touch
    if (!isMouse(event) && !isTouch(event)) return;

    isPressedRef.current = false;
    startPositionsRef.current = null;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const preventLongPress = (event: TargetEvent) => {
    if (!preventLongPressOnMove) return;

    // Ignore events other than mouse and touch
    if (!isMouse(event) && !isTouch(event)) return;

    if (!startPositionsRef.current) return;

    const position = calcPosition(event);
    const initialPosition = startPositionsRef.current;

    if (!position) return;

    const dx = Math.abs(position.x - initialPosition.x);
    const dy = Math.abs(position.y - initialPosition.y);

    if (dx > moveThreshold || dy > moveThreshold) stopLongPress(event);
  };

  const preventContextMenu = (event: TargetEvent) => {
    if (!isPressedRef.current) return;
    if (preventContextMenuOnLongPress) event.preventDefault?.();
  };

  const handleEvents = (node: HTMLElement, unsubscribe = false) => {
    node.oncontextmenu = unsubscribe ? null : preventContextMenu;

    const fn = unsubscribe
      ? node.removeEventListener.bind(node)
      : node.addEventListener.bind(node);

    fn("mousedown", startLongPress);
    fn("touchstart", startLongPress);

    fn("mousemove", preventLongPress);
    fn("touchmove", preventLongPress);

    fn("mouseup", stopLongPress);
    fn("mouseleave", stopLongPress);
    fn("touchend", stopLongPress);
  };

  const subscriber = <T extends HTMLElement>(node: T | null) => {
    if (!node) return;

    handleEvents(node);
    return () => void handleEvents(node, true);
  };

  const registerNode = useRegisterNodeRef(subscriber);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { registerNode };
};

export default useLongPress;
