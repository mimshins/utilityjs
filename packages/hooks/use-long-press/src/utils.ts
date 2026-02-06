import type { Coordinates, TargetEvent } from "./types.ts";

export const isTouch = (event: Event): event is TouchEvent =>
  TouchEvent ? event instanceof TouchEvent : "touches" in event;

export const isMouse = (event: Event): event is MouseEvent =>
  event instanceof MouseEvent;

export const calcPosition = (event: TargetEvent): Coordinates | null => {
  return isTouch(event)
    ? { x: event.touches[0]!.pageX, y: event.touches[0]!.pageY }
    : isMouse(event)
      ? { x: event.pageX, y: event.pageY }
      : null;
};
