import { DEFAULT_KEY_GENERATOR } from "./constants.ts";
import type { KeyGenerator } from "./types.ts";

/**
 * Represents an item in a disjoint set with parent-child relationships.
 * Used internally by DisjointSet to maintain tree structure.
 *
 * @template T The type of value stored in this item
 */
export class Item<T> {
  /** The value stored in this item */
  private _value: T;

  /** Reference to parent item, null if this is a root */
  private _parent: Item<T> | null = null;

  /** Map of child items keyed by their generated keys */
  private _children: Record<string, Item<T>> = {};

  /** Function to generate unique keys for values */
  private _keyGenerator: KeyGenerator<T>;

  /**
   * Creates a new Item instance.
   *
   * @param value The value to store in this item
   * @param keyGenerator Function to generate unique string keys from values
   */
  constructor(value: T, keyGenerator: KeyGenerator<T> = DEFAULT_KEY_GENERATOR) {
    this._value = value;
    this._keyGenerator = keyGenerator;
  }

  /**
   * Gets the unique key for this item's value.
   *
   * @returns The generated key string
   */
  public getKey(): string {
    return this._keyGenerator(this._value);
  }

  /**
   * Finds and returns the root item of this item's tree.
   * Implements path compression for efficiency.
   *
   * @returns The root item of the tree
   */
  public getRoot(): Item<T> {
    return this.isRoot() ? this : (this._parent as Item<T>).getRoot();
  }

  /**
   * Checks if this item is a root (has no parent).
   *
   * @returns True if this item is a root, false otherwise
   */
  public isRoot(): boolean {
    return this._parent === null;
  }

  /**
   * Calculates the rank (height) of the subtree rooted at this item.
   *
   * @returns The rank of this item's subtree
   */
  public getRank(): number {
    return this.getChildren().reduce<number>(
      (result, child) => result + 1 + child.getRank(),
      0,
    );
  }

  /**
   * Gets all direct children of this item.
   *
   * @returns Array of child items
   */
  public getChildren(): Item<T>[] {
    return Object.keys(this._children).map(key => this._children[key]!);
  }

  /**
   * Sets the parent of this item.
   *
   * @param parent The new parent item
   * @param alsoAsParentChild If true, also adds this item as a child of the parent
   */
  public setParent(parent: Item<T>, alsoAsParentChild = false): void {
    this._parent = parent;

    if (alsoAsParentChild) parent.addChild(this);
  }

  /**
   * Gets the parent of this item.
   *
   * @returns The parent item, or null if this is a root
   */
  public getParent(): Item<T> | null {
    return this._parent;
  }

  /**
   * Adds a child to this item and sets this item as the child's parent.
   *
   * @param child The child item to add
   */
  public addChild(child: Item<T>): void {
    this._children[child.getKey()] = child;

    child.setParent(this);
  }
}
