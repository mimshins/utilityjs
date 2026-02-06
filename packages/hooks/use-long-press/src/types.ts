/**
 * Union type for mouse and touch events.
 */
export type TargetEvent = MouseEvent | TouchEvent;

/**
 * Represents x and y coordinates.
 */
export type Coordinates = {
  /** The x-coordinate position */
  x: number;
  /** The y-coordinate position */
  y: number;
};
