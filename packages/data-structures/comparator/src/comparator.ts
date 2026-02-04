/**
 * A function that compares two values and returns their relative order.
 *
 * @template T The type of values being compared
 * @param a First value to compare
 * @param b Second value to compare
 * @returns -1 if a < b, 0 if a === b, 1 if a > b
 */
export type CompareFunction<T> = (a: T, b: T) => -1 | 0 | 1;

/**
 * A utility class for comparing values with a customizable comparison function.
 * @template T The type of values being compared
 */
export class Comparator<T> {
  private compare: CompareFunction<T>;

  /**
   * Default comparison function using JavaScript's built-in comparison operators.
   * @template T The type of values being compared
   * @param a First value to compare
   * @param b Second value to compare
   * @returns -1 if a < b, 0 if a === b, 1 if a > b
   */
  static defaultComparatorFunction = <T>(a: T, b: T): -1 | 0 | 1 => {
    if (a === b) return 0;
    return a < b ? -1 : 1;
  };

  /**
   * Creates a new Comparator instance.
   * @param compareFunction Optional custom comparison function. If not provided, uses default comparison.
   */
  constructor(compareFunction?: CompareFunction<T>) {
    this.compare = compareFunction || Comparator.defaultComparatorFunction;
  }

  /**
   * Checks if two values are equal.
   * @param a First value
   * @param b Second value
   * @returns true if a equals b
   */
  public isEqual(a: T, b: T): boolean {
    return this.compare(a, b) === 0;
  }

  /**
   * Checks if first value is less than second value.
   * @param a First value
   * @param b Second value
   * @returns true if a < b
   */
  public isLessThan(a: T, b: T): boolean {
    return this.compare(a, b) === -1;
  }

  /**
   * Checks if first value is less than or equal to second value.
   * @param a First value
   * @param b Second value
   * @returns true if a <= b
   */
  public isLessThanOrEqual(a: T, b: T): boolean {
    return this.isLessThan(a, b) || this.isEqual(a, b);
  }

  /**
   * Checks if first value is greater than second value.
   * @param a First value
   * @param b Second value
   * @returns true if a > b
   */
  public isGreaterThan(a: T, b: T): boolean {
    return this.compare(a, b) === 1;
  }

  /**
   * Checks if first value is greater than or equal to second value.
   * @param a First value
   * @param b Second value
   * @returns true if a >= b
   */
  public isGreaterThanOrEqual(a: T, b: T): boolean {
    return this.isGreaterThan(a, b) || this.isEqual(a, b);
  }
}
