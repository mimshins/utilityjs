import { useGetLatest } from "@utilityjs/use-get-latest";
import { useRegisterNodeRef } from "@utilityjs/use-register-node-ref";
import { useEffect, useRef } from "react";
import type { Coordinates, TargetEvent } from "./types.ts";
import { calcPosition, isMouse, isTouch } from "./utils.ts";

/**
 * Configuration options for the useLongPress hook.
 */
export type Options = {
  /** Duration in milliseconds to wait before triggering long press (default: 500) */
  pressDelay?: number;
  /** Maximum movement in pixels before canceling long press (default: 25) */
  moveThreshold?: number;
  /** Whether to prevent context menu on long press (default: false) */
  preventContextMenuOnLongPress?: boolean;
  /** Whether to cancel long press when user moves (default: false) */
  preventLongPressOnMove?: boolean;
};

/**
 * Return type of the useLongPress hook.
 */
type HookReturn = {
  /** Function to register a DOM node for long press detection */
  registerNode: <T extends HTMLElement>(node: T | null) => void;
};

/**
 * A React hook that detects long clicks/taps on DOM elements.
 *
 * This hook provides a way to detect when a user performs a long press gesture
 * on an element, supporting both mouse and touch events. It includes options
 * for customizing the press duration, movement threshold, and context menu behavior.
 *
 * @param callback - Function to call when long press is detected
 * @param options - Configuration options for long press behavior
 * @returns Object containing registerNode function to attach to DOM elements
 *
 * @example
 * ```tsx
 * import { useLongPress } from "@utilityjs/use-long-press";
 *
 * function MyComponent() {
 *   const { registerNode } = useLongPress(() => {
 *     console.log('Long press detected!');
 *   }, {
 *     pressDelay: 1000,
 *     moveThreshold: 10
 *   });
 *
 *   return <button ref={registerNode}>Long press me</button>;
 * }
 * ```
 */
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

  /**
   * Starts the long press detection timer.
   *
   * @param event - The mouse or touch event that initiated the press
   */
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

  /**
   * Stops the long press detection and clears the timer.
   *
   * @param event - The mouse or touch event that ended the press
   */
  const stopLongPress = (event: TargetEvent) => {
    // Ignore events other than mouse and touch
    if (!isMouse(event) && !isTouch(event)) return;

    isPressedRef.current = false;
    startPositionsRef.current = null;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  /**
   * Prevents long press if the user moves beyond the threshold.
   *
   * @param event - The mouse or touch move event
   */
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

  /**
   * Prevents the context menu from appearing during long press.
   *
   * @param event - The context menu event
   */
  const preventContextMenu = (event: TargetEvent) => {
    if (!isPressedRef.current) return;
    if (preventContextMenuOnLongPress) event.preventDefault?.();
  };

  /**
   * Attaches or removes event listeners from a DOM node.
   *
   * @param node - The DOM element to attach listeners to
   * @param unsubscribe - Whether to remove listeners instead of adding them
   */
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

  /**
   * Subscriber function for registering DOM nodes.
   *
   * @param node - The DOM element to register
   * @returns Cleanup function to remove event listeners
   */
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
