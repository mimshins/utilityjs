type KeyGenerator<T> = (value: T) => string;

const _defaultKeyGenerator = <T>(value: T) => JSON.stringify(value);

export class Item<T> {
  private _value: T;

  private _parent: Item<T> | null = null;
  private _children: Record<string, Item<T>> = {};

  private _keyGenerator: KeyGenerator<T>;

  constructor(value: T, keyGenerator: KeyGenerator<T> = _defaultKeyGenerator) {
    this._value = value;
    this._keyGenerator = keyGenerator;
  }

  public getKey(): string {
    return this._keyGenerator(this._value);
  }

  public getRoot(): Item<T> {
    return this.isRoot() ? this : (this._parent as Item<T>).getRoot();
  }

  public isRoot(): boolean {
    return this._parent === null;
  }

  public getRank(): number {
    return this.getChildren().reduce<number>(
      (result, child) => result + 1 + child.getRank(),
      0
    );
  }

  public getChildren(): Item<T>[] {
    return Object.keys(this._children).map(key => this._children[key]);
  }

  public setParent(parent: Item<T>, alsoAsParentChild = false): void {
    this._parent = parent;
    if (alsoAsParentChild) parent.addChild(this);
  }

  public getParent(): Item<T> | null {
    return this._parent;
  }

  public addChild(child: Item<T>): void {
    this._children[child.getKey()] = child;
    child.setParent(this);
  }
}

export default class DisjointSet<T> {
  private _items: Record<string, Item<T>> = {};

  private _keyGenerator: KeyGenerator<T>;

  constructor(keyGenerator: KeyGenerator<T> = _defaultKeyGenerator) {
    this._keyGenerator = keyGenerator;
  }

  public makeSet(value: T): void {
    const key = this._keyGenerator(value);
    const item = this._items[key];

    if (!item) this._items[key] = new Item<T>(value, this._keyGenerator);
  }

  public find(value: T): string | null {
    const item = this._items[this._keyGenerator(value)];

    if (!item) return null;
    return item.getRoot().getKey();
  }

  public union(valueA: T, valueB: T): DisjointSet<T> {
    const rootKeyA = this.find(valueA);
    const rootKeyB = this.find(valueB);

    if (rootKeyA === null)
      throw new Error(`${String(valueA)} isn't in any set.`);
    if (rootKeyB === null)
      throw new Error(`${String(valueB)} isn't in any set.`);

    if (rootKeyA === rootKeyB) return this;

    const rootA = this._items[rootKeyA];
    const rootB = this._items[rootKeyB];

    if (rootA.getRank() < rootB.getRank()) {
      rootB.addChild(rootA);
      return this;
    }

    rootA.addChild(rootB);
    return this;
  }

  public inSameSet(valueA: T, valueB: T): boolean {
    const rootKeyA = this.find(valueA);
    const rootKeyB = this.find(valueB);

    if (rootKeyA === null)
      throw new Error(`${String(valueA)} isn't in any set.`);
    if (rootKeyB === null)
      throw new Error(`${String(valueB)} isn't in any set.`);

    return rootKeyA === rootKeyB;
  }
}
