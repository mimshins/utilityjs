import { useGetLatest } from "@utilityjs/use-get-latest";
import { useRegisterNodeRef } from "@utilityjs/use-register-node-ref";
import { useEffect, useRef } from "react";
import type { Coordinates, TargetEvent } from "./types.ts";
import { calcPosition, isMouse, isTouch } from "./utils.ts";

export type Options = {
  pressDelay?: number;
  moveThreshold?: number;
  preventContextMenuOnLongPress?: boolean;
  preventLongPressOnMove?: boolean;
};

type HookReturn = {
  registerNode: <T extends HTMLElement>(node: T | null) => void;
};

export const useLongPress = (
  callback: () => void,
  options: Options = {},
): HookReturn => {
  const {
    pressDelay = 500,
    moveThreshold = 25,
    preventContextMenuOnLongPress = false,
    preventLongPressOnMove = false,
  } = options;

  const callbackRef = useGetLatest(callback);

  const timeoutRef = useRef<number>(-1);
  const startPositionsRef = useRef<Coordinates | null>(null);

  const isPressedRef = useRef(false);

  const startLongPress = (event: TargetEvent) => {
    // Ignore events other than mouse and touch
    if (!isMouse(event) && !isTouch(event)) return;

    if (isPressedRef.current) return;

    // Main button pressed
    isPressedRef.current = isMouse(event) ? event.button === 0 : true;
    startPositionsRef.current = calcPosition(event);

    timeoutRef.current = window.setTimeout(
      () => void callbackRef.current?.(),
      pressDelay,
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

  const subscriber = <T extends HTMLElement>(node: T) => {
    handleEvents(node);
    return () => void handleEvents(node, true);
  };

  const registerNode = useRegisterNodeRef(subscriber);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { registerNode };
};
