import { DEFAULT_KEY_GENERATOR } from "./constants.ts";
import { Item } from "./item.ts";
import type { KeyGenerator } from "./types.ts";

/**
 * A Disjoint Set (Union-Find) data structure implementation.
 * Supports efficient union and find operations with path compression and union by rank.
 *
 * @template T The type of values stored in the disjoint set
 */
export default class DisjointSet<T> {
  /** Internal storage for set items */
  private _items: Record<string, Item<T>> = {};

  /** Function to generate unique keys for values */
  private _keyGenerator: KeyGenerator<T>;

  /**
   * Creates a new DisjointSet instance.
   *
   * @param keyGenerator Function to generate unique string keys from values. Defaults to JSON.stringify.
   */
  constructor(keyGenerator: KeyGenerator<T> = DEFAULT_KEY_GENERATOR) {
    this._keyGenerator = keyGenerator;
  }

  /**
   * Creates a new set containing the specified value.
   * If the value already exists in a set, this operation has no effect.
   *
   * @param value The value to create a set for
   * @returns This DisjointSet instance for method chaining
   */
  public makeSet(value: T): DisjointSet<T> {
    const key = this._keyGenerator(value);
    const item = this._items[key];

    if (!item) this._items[key] = new Item<T>(value, this._keyGenerator);

    return this;
  }

  /**
   * Finds the root key of the set containing the specified value.
   *
   * @param value The value to find the root for
   * @returns The key of the root element, or null if the value is not in any set
   */
  public find(value: T): string | null {
    const item = this._items[this._keyGenerator(value)];

    if (!item) return null;

    return item.getRoot().getKey();
  }

  /**
   * Unites the sets containing the two specified values.
   * Uses union by rank to maintain balanced trees.
   *
   * @param valueA First value
   * @param valueB Second value
   * @returns This DisjointSet instance for method chaining
   * @throws Error if either value is not in any set
   */
  public union(valueA: T, valueB: T): DisjointSet<T> {
    const rootKeyA = this.find(valueA);
    const rootKeyB = this.find(valueB);

    if (rootKeyA === null) {
      throw new Error(`${String(valueA)} isn't in any set.`);
    }

    if (rootKeyB === null) {
      throw new Error(`${String(valueB)} isn't in any set.`);
    }

    if (rootKeyA === rootKeyB) return this;

    const rootA = this._items[rootKeyA]!;
    const rootB = this._items[rootKeyB]!;

    if (rootA.getRank() < rootB.getRank()) {
      rootB.addChild(rootA);

      return this;
    }

    rootA.addChild(rootB);

    return this;
  }

  /**
   * Checks if two values are in the same set.
   *
   * @param valueA First value
   * @param valueB Second value
   * @returns True if both values are in the same set, false otherwise
   * @throws Error if either value is not in any set
   */
  public inSameSet(valueA: T, valueB: T): boolean {
    const rootKeyA = this.find(valueA);
    const rootKeyB = this.find(valueB);

    if (rootKeyA === null) {
      throw new Error(`${String(valueA)} isn't in any set.`);
    }

    if (rootKeyB === null) {
      throw new Error(`${String(valueB)} isn't in any set.`);
    }

    return rootKeyA === rootKeyB;
  }
}
