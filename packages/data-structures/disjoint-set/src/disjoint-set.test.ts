import { describe, expect, it } from "vitest";
import DisjointSet from "./disjoint-set.ts";
import { Item } from "./item.ts";

describe("DisjointSet", () => {
  describe("constructor", () => {
    it("should create instance with default key generator", () => {
      const ds = new DisjointSet<number>();

      expect(ds).toBeInstanceOf(DisjointSet);
    });

    it("should create instance with custom key generator", () => {
      const ds = new DisjointSet<number>(n => `key_${n}`);

      expect(ds).toBeInstanceOf(DisjointSet);
    });
  });

  describe("makeSet", () => {
    it("should create a new set for a value", () => {
      const ds = new DisjointSet<number>();

      ds.makeSet(1);
      expect(ds.find(1)).toBe("1");
    });

    it("should not create duplicate sets", () => {
      const ds = new DisjointSet<number>();

      ds.makeSet(1);
      const firstRoot = ds.find(1);

      ds.makeSet(1);
      expect(ds.find(1)).toBe(firstRoot);
    });

    it("should work with custom key generator", () => {
      const ds = new DisjointSet<number>(n => `num_${n}`);

      ds.makeSet(42);
      expect(ds.find(42)).toBe("num_42");
    });

    it("should work with complex objects", () => {
      const ds = new DisjointSet<{ id: number }>(obj => obj.id.toString());

      ds.makeSet({ id: 1 });
      expect(ds.find({ id: 1 })).toBe("1");
    });
  });

  describe("find", () => {
    it("should return null for non-existent value", () => {
      const ds = new DisjointSet<number>();

      expect(ds.find(1)).toBeNull();
    });

    it("should return root key for existing value", () => {
      const ds = new DisjointSet<number>();

      ds.makeSet(1);
      expect(ds.find(1)).toBe("1");
    });

    it("should return same root for values in same set", () => {
      const ds = new DisjointSet<number>();

      ds.makeSet(1);
      ds.makeSet(2);
      ds.union(1, 2);
      expect(ds.find(1)).toBe(ds.find(2));
    });
  });

  describe("union", () => {
    it("should unite two separate sets", () => {
      const ds = new DisjointSet<number>();

      ds.makeSet(1);
      ds.makeSet(2);
      ds.union(1, 2);
      expect(ds.inSameSet(1, 2)).toBe(true);
    });

    it("should return this for method chaining", () => {
      const ds = new DisjointSet<number>();

      ds.makeSet(1);
      ds.makeSet(2);
      expect(ds.union(1, 2)).toBe(ds);
    });

    it("should return this when values already in same set", () => {
      const ds = new DisjointSet<number>();

      ds.makeSet(1);
      ds.makeSet(2);
      ds.union(1, 2);
      expect(ds.union(1, 2)).toBe(ds);
    });

    it("should throw error when first value not in any set", () => {
      const ds = new DisjointSet<number>();

      ds.makeSet(2);
      expect(() => ds.union(1, 2)).toThrow("1 isn't in any set.");
    });

    it("should throw error when second value not in any set", () => {
      const ds = new DisjointSet<number>();

      ds.makeSet(1);
      expect(() => ds.union(1, 2)).toThrow("2 isn't in any set.");
    });

    it("should use union by rank correctly", () => {
      const ds = new DisjointSet<number>();

      [1, 2, 3, 4].forEach(n => ds.makeSet(n));
      ds.union(2, 1);
      ds.union(4, 3);
      ds.union(1, 3);
      expect(ds.inSameSet(1, 4)).toBe(true);
    });

    it("should handle rootA smaller than rootB", () => {
      const ds = new DisjointSet<number>();

      [1, 2, 3, 4].forEach(n => ds.makeSet(n));
      ds.union(1, 2);
      ds.union(2, 3);
      ds.makeSet(4);
      ds.union(4, 1);
      expect(ds.inSameSet(1, 4)).toBe(true);
    });
  });

  describe("inSameSet", () => {
    it("should return true for values in same set", () => {
      const ds = new DisjointSet<number>();

      ds.makeSet(1);
      ds.makeSet(2);
      ds.union(1, 2);
      expect(ds.inSameSet(1, 2)).toBe(true);
    });

    it("should return false for values in different sets", () => {
      const ds = new DisjointSet<number>();

      ds.makeSet(1);
      ds.makeSet(2);
      expect(ds.inSameSet(1, 2)).toBe(false);
    });

    it("should throw error when first value not in any set", () => {
      const ds = new DisjointSet<number>();

      ds.makeSet(2);
      expect(() => ds.inSameSet(1, 2)).toThrow("1 isn't in any set.");
    });

    it("should throw error when second value not in any set", () => {
      const ds = new DisjointSet<number>();

      ds.makeSet(1);
      expect(() => ds.inSameSet(1, 2)).toThrow("2 isn't in any set.");
    });
  });

  describe("integration", () => {
    it("should handle complex scenario with multiple sets", () => {
      const ds = new DisjointSet<number>();

      for (let i = 1; i <= 10; i++) ds.makeSet(i);

      ds.union(1, 2).union(2, 3).union(3, 4).union(4, 5);
      ds.union(6, 7).union(7, 8).union(8, 9).union(9, 10);

      expect(ds.inSameSet(1, 5)).toBe(true);
      expect(ds.inSameSet(6, 10)).toBe(true);
      expect(ds.inSameSet(1, 6)).toBe(false);

      ds.union(5, 6);
      expect(ds.inSameSet(1, 10)).toBe(true);
    });
  });
});

describe("Item", () => {
  it("should create item with default key generator", () => {
    const item = new Item(42);

    expect(item.getKey()).toBe("42");
  });

  it("should create item with custom key generator", () => {
    const item = new Item(42, n => `item_${n}`);

    expect(item.getKey()).toBe("item_42");
  });

  it("should set parent with alsoAsParentChild flag", () => {
    const parent = new Item(1);
    const child = new Item(2);

    child.setParent(parent, true);
    expect(child.getParent()).toBe(parent);
    expect(parent.getChildren()).toContain(child);
  });

  it("should return null for root parent", () => {
    const item = new Item(1);

    expect(item.getParent()).toBeNull();
  });
});
