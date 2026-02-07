import type { Coordinates, TargetEvent } from "./types.ts";

/**
 * Type guard to check if an event is a TouchEvent.
 *
 * @param event - The event to check
 * @returns True if the event is a TouchEvent, false otherwise
 */
export const isTouch = (event: Event): event is TouchEvent =>
  /* v8 ignore next - TouchEvent is always defined in jsdom */
  TouchEvent ? event instanceof TouchEvent : "touches" in event;

/**
 * Type guard to check if an event is a MouseEvent.
 *
 * @param event - The event to check
 * @returns True if the event is a MouseEvent, false otherwise
 */
export const isMouse = (event: Event): event is MouseEvent =>
  event instanceof MouseEvent;

/**
 * Calculates the position coordinates from a mouse or touch event.
 *
 * @param event - The mouse or touch event
 * @returns The coordinates object with x and y positions, or null if unable to calculate
 */
export const calcPosition = (event: TargetEvent): Coordinates | null => {
  return isTouch(event)
    ? { x: event.touches[0]!.pageX, y: event.touches[0]!.pageY }
    : isMouse(event)
      ? { x: event.pageX, y: event.pageY }
      : /* v8 ignore next - unreachable, callers guard for mouse/touch */ null;
};
