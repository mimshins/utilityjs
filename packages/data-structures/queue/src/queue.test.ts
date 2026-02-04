import { beforeEach, describe, expect, it } from "vitest";
import { Queue } from "./queue.ts";

describe("Queue", () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = new Queue<number>();
  });

  describe("constructor", () => {
    it("should create an empty queue", () => {
      expect(queue.isEmpty()).toBe(true);
      expect(queue.peek()).toBeNull();
    });
  });

  describe("enqueue", () => {
    it("should add element to queue", () => {
      queue.enqueue(1);
      expect(queue.isEmpty()).toBe(false);
      expect(queue.peek()).toBe(1);
    });

    it("should add multiple elements", () => {
      queue.enqueue(1);
      queue.enqueue(2);
      expect(queue.peek()).toBe(1);
    });
  });

  describe("dequeue", () => {
    it("should return null for empty queue", () => {
      expect(queue.dequeue()).toBeNull();
    });

    it("should follow FIFO order", () => {
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);
      expect(queue.dequeue()).toBe(1);
      expect(queue.dequeue()).toBe(2);
      expect(queue.dequeue()).toBe(3);
    });
  });

  describe("peek", () => {
    it("should return null for empty queue", () => {
      expect(queue.peek()).toBeNull();
    });

    it("should return front element without removing", () => {
      queue.enqueue(1);
      expect(queue.peek()).toBe(1);
      expect(queue.peek()).toBe(1);
    });
  });

  describe("edge cases", () => {
    it("should handle null values", () => {
      const nullQueue = new Queue<null>();

      nullQueue.enqueue(null);
      expect(nullQueue.peek()).toBeNull();
      expect(nullQueue.isEmpty()).toBe(false);
    });

    it("should handle objects", () => {
      const objQueue = new Queue<{ id: number }>();
      const obj = { id: 1 };

      objQueue.enqueue(obj);
      expect(objQueue.peek()).toBe(obj);
    });
  });
});
