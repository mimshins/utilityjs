import { beforeEach, describe, expect, it } from "vitest";
import { Stack } from "./stack.ts";

describe("Stack", () => {
  let stack: Stack<number>;

  beforeEach(() => {
    stack = new Stack<number>();
  });

  describe("constructor", () => {
    it("should create an empty stack", () => {
      expect(stack.isEmpty()).toBe(true);
      expect(stack.toArray()).toEqual([]);
    });
  });

  describe("push", () => {
    it("should add element to stack", () => {
      stack.push(1);
      expect(stack.isEmpty()).toBe(false);
      expect(stack.peek()).toBe(1);
    });

    it("should add multiple elements", () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      expect(stack.toArray()).toEqual([3, 2, 1]);
    });
  });

  describe("pop", () => {
    it("should return null from empty stack", () => {
      expect(stack.pop()).toBeNull();
    });

    it("should follow LIFO order", () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      expect(stack.pop()).toBe(3);
      expect(stack.pop()).toBe(2);
      expect(stack.pop()).toBe(1);
    });
  });

  describe("peek", () => {
    it("should return null from empty stack", () => {
      expect(stack.peek()).toBeNull();
    });

    it("should return top element without removing", () => {
      stack.push(1);
      expect(stack.peek()).toBe(1);
      expect(stack.peek()).toBe(1);
    });
  });

  describe("toArray", () => {
    it("should return empty array for empty stack", () => {
      expect(stack.toArray()).toEqual([]);
    });

    it("should return array with top element first", () => {
      stack.push(1);
      stack.push(2);
      expect(stack.toArray()).toEqual([2, 1]);
    });

    it("should not modify original stack", () => {
      stack.push(1);
      const array = stack.toArray();

      array.push(2);
      expect(stack.toArray()).toEqual([1]);
    });
  });

  describe("edge cases", () => {
    it("should handle null values", () => {
      const nullStack = new Stack<null>();

      nullStack.push(null);
      expect(nullStack.peek()).toBeNull();
      expect(nullStack.isEmpty()).toBe(false);
    });

    it("should maintain state after mixed operations", () => {
      stack.push(1);
      stack.push(2);
      stack.pop();
      stack.push(3);
      expect(stack.toArray()).toEqual([3, 1]);
    });
  });
});
