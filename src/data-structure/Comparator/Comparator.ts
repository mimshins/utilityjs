export type CompareFunction<T> = (a: T, b: T) => -1 | 0 | 1;

export default class Comparator<T> {
  private compare: CompareFunction<T>;

  static defaultComparatorFunction = <T>(a: T, b: T): -1 | 0 | 1 => {
    if (a === b) return 0;
    return a < b ? -1 : 1;
  };

  constructor(compareFunction?: CompareFunction<T>) {
    this.compare = compareFunction || Comparator.defaultComparatorFunction;
  }

  public isEqual(a: T, b: T): boolean {
    return this.compare(a, b) === 0;
  }

  public isLessThan(a: T, b: T): boolean {
    return this.compare(a, b) === -1;
  }

  public isLessThanOrEqual(a: T, b: T): boolean {
    return this.isLessThan(a, b) || this.isEqual(a, b);
  }

  public isGreaterThan(a: T, b: T): boolean {
    return this.compare(a, b) === 1;
  }

  public isGreaterThanOrEqual(a: T, b: T): boolean {
    return this.isGreaterThan(a, b) || this.isEqual(a, b);
  }
}
