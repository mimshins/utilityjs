import { describe, expect, it } from "vitest";
import { LinkedList } from "./linked-list.ts";
import { Node } from "./node.ts";

describe("LinkedList", () => {
  describe("constructor", () => {
    it("should create an empty list", () => {
      const list = new LinkedList<number>();

      expect(list.isEmpty()).toBe(true);
      expect(list.getLength()).toBe(0);
      expect(list.getHead()).toBeNull();
      expect(list.getTail()).toBeNull();
    });

    it("should accept custom compare function", () => {
      const list = new LinkedList<number>((a, b) =>
        a === b ? 0 : a > b ? -1 : 1,
      );

      expect(list).toBeInstanceOf(LinkedList);
    });
  });

  describe("append", () => {
    it("should append to empty list", () => {
      const list = new LinkedList<number>();

      list.append(1);
      expect(list.getLength()).toBe(1);
      expect(list.getHead()?.getValue()).toBe(1);
      expect(list.getTail()?.getValue()).toBe(1);
    });

    it("should append multiple values", () => {
      const list = new LinkedList<number>();

      list.append(1);
      list.append(2);
      list.append(3);
      expect(list.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe("prepend", () => {
    it("should prepend to empty list", () => {
      const list = new LinkedList<number>();

      list.prepend(1);
      expect(list.getHead()?.getValue()).toBe(1);
      expect(list.getTail()?.getValue()).toBe(1);
    });

    it("should prepend multiple values", () => {
      const list = new LinkedList<number>();

      list.prepend(3);
      list.prepend(2);
      list.prepend(1);
      expect(list.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe("deleteHead", () => {
    it("should do nothing on empty list", () => {
      const list = new LinkedList<number>();

      list.deleteHead();
      expect(list.isEmpty()).toBe(true);
    });

    it("should delete head from single-element list", () => {
      const list = new LinkedList<number>();

      list.append(1);
      list.deleteHead();
      expect(list.isEmpty()).toBe(true);
      expect(list.getTail()).toBeNull();
    });

    it("should delete head from multi-element list", () => {
      const list = new LinkedList<number>();

      list.fromArray([1, 2, 3]);
      list.deleteHead();
      expect(list.toArray()).toEqual([2, 3]);
    });
  });

  describe("deleteTail", () => {
    it("should do nothing on empty list", () => {
      const list = new LinkedList<number>();

      list.deleteTail();
      expect(list.isEmpty()).toBe(true);
    });

    it("should delete tail from single-element list", () => {
      const list = new LinkedList<number>();

      list.append(1);
      list.deleteTail();
      expect(list.isEmpty()).toBe(true);
    });

    it("should delete tail from multi-element list", () => {
      const list = new LinkedList<number>();

      list.fromArray([1, 2, 3]);
      list.deleteTail();
      expect(list.toArray()).toEqual([1, 2]);
    });
  });

  describe("delete", () => {
    it("should do nothing on empty list", () => {
      const list = new LinkedList<number>();

      list.delete(1);
      expect(list.isEmpty()).toBe(true);
    });

    it("should delete head if value matches", () => {
      const list = new LinkedList<number>();

      list.fromArray([1, 2]);
      list.delete(1);
      expect(list.getHead()?.getValue()).toBe(2);
    });

    it("should delete middle element", () => {
      const list = new LinkedList<number>();

      list.fromArray([1, 2, 3]);
      list.delete(2);
      expect(list.toArray()).toEqual([1, 3]);
    });

    it("should delete tail if value matches", () => {
      const list = new LinkedList<number>();

      list.fromArray([1, 2, 3]);
      list.delete(3);
      expect(list.getTail()?.getValue()).toBe(2);
    });

    it("should delete only first occurrence", () => {
      const list = new LinkedList<number>();

      list.fromArray([1, 2, 2, 3]);
      list.delete(2);
      expect(list.toArray()).toEqual([1, 2, 3]);
    });

    it("should do nothing if value not found", () => {
      const list = new LinkedList<number>();

      list.fromArray([1, 2]);
      list.delete(5);
      expect(list.toArray()).toEqual([1, 2]);
    });
  });

  describe("traverse", () => {
    it("should not execute callback on empty list", () => {
      const list = new LinkedList<number>();
      let count = 0;

      list.traverse(() => {
        count++;
      });
      expect(count).toBe(0);
    });

    it("should traverse all nodes", () => {
      const list = new LinkedList<number>();

      list.fromArray([1, 2, 3]);
      const values: number[] = [];

      list.traverse(node => {
        values.push(node.getValue());
      });
      expect(values).toEqual([1, 2, 3]);
    });

    it("should stop traversal when callback returns true", () => {
      const list = new LinkedList<number>();

      list.fromArray([1, 2, 3]);
      const values: number[] = [];

      list.traverse(node => {
        values.push(node.getValue());
        return node.getValue() === 2;
      });
      expect(values).toEqual([1, 2]);
    });
  });

  describe("reverse", () => {
    it("should do nothing on empty list", () => {
      const list = new LinkedList<number>();

      list.reverse();
      expect(list.isEmpty()).toBe(true);
    });

    it("should reverse multi-element list", () => {
      const list = new LinkedList<number>();

      list.fromArray([1, 2, 3]);
      list.reverse();
      expect(list.toArray()).toEqual([3, 2, 1]);
      expect(list.getHead()?.getValue()).toBe(3);
      expect(list.getTail()?.getValue()).toBe(1);
    });
  });

  describe("fromArray and toArray", () => {
    it("should create list from array", () => {
      const list = new LinkedList<number>();

      list.fromArray([1, 2, 3]);
      expect(list.toArray()).toEqual([1, 2, 3]);
    });

    it("should return empty array for empty list", () => {
      const list = new LinkedList<number>();

      expect(list.toArray()).toEqual([]);
    });
  });

  describe("custom comparator", () => {
    it("should use custom comparator for deletion", () => {
      const list = new LinkedList<{ id: number }>((a, b) =>
        a.id === b.id ? 0 : a.id < b.id ? -1 : 1,
      );

      list.append({ id: 1 });
      list.append({ id: 2 });
      list.delete({ id: 2 });
      expect(list.getLength()).toBe(1);
    });
  });
});

describe("Node", () => {
  it("should create node with value", () => {
    const node = new Node(5);

    expect(node.getValue()).toBe(5);
    expect(node.getNext()).toBeNull();
    expect(node.hasNext()).toBe(false);
  });

  it("should create node with next reference", () => {
    const next = new Node(2);
    const node = new Node(1, next);

    expect(node.getNext()).toBe(next);
    expect(node.hasNext()).toBe(true);
  });

  it("should set and get value", () => {
    const node = new Node(1);

    node.setValue(2);
    expect(node.getValue()).toBe(2);
  });

  it("should set and get next", () => {
    const node1 = new Node(1);
    const node2 = new Node(2);

    node1.setNext(node2);
    expect(node1.getNext()).toBe(node2);
  });
});
