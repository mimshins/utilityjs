import { Comparator } from "@utilityjs/comparator";
import { beforeEach, describe, expect, it } from "vitest";
import { PriorityQueue } from "./priority-queue.ts";

describe("PriorityQueue", () => {
  let pq: PriorityQueue<string>;

  beforeEach(() => {
    pq = new PriorityQueue<string>();
  });

  describe("constructor", () => {
    it("should create an empty priority queue", () => {
      expect(pq.isEmpty()).toBe(true);
      expect(pq.peek()).toBeNull();
    });

    it("should use custom compare function for equal priorities", () => {
      const customPQ = new PriorityQueue<string>(
        (a, b) => b.localeCompare(a) as -1 | 0 | 1,
      );

      customPQ.add("a", 1);
      customPQ.add("b", 1);

      expect(customPQ.peek()).toBe("b");
    });
  });

  describe("add", () => {
    it("should add element with default priority 0", () => {
      pq.add("test");
      expect(pq.peek()).toBe("test");
    });

    it("should maintain priority order (lower priority first)", () => {
      pq.add("low", 10);
      pq.add("high", 1);
      pq.add("medium", 5);

      expect(pq.poll()).toBe("high");
      expect(pq.poll()).toBe("medium");
      expect(pq.poll()).toBe("low");
    });

    it("should handle equal priorities", () => {
      pq.add("first", 5);
      pq.add("second", 5);

      const results = [pq.poll(), pq.poll()];

      expect(results).toContain("first");
      expect(results).toContain("second");
    });
  });

  describe("poll", () => {
    it("should return null for empty queue", () => {
      expect(pq.poll()).toBeNull();
    });

    it("should return highest priority element", () => {
      pq.add("low", 10);
      pq.add("high", 1);

      expect(pq.poll()).toBe("high");
      expect(pq.peek()).toBe("low");
    });
  });

  describe("remove", () => {
    it("should remove element and its priority", () => {
      pq.add("test", 5);
      pq.remove("test");

      expect(pq.isEmpty()).toBe(true);
      expect(pq.hasValue("test")).toBe(false);
    });

    it("should use custom comparator when provided", () => {
      const customComparator = new Comparator<string>(
        (a, b) => a.localeCompare(b) as -1 | 0 | 1,
      );

      pq.add("test", 5);
      pq.remove("test", customComparator);

      expect(pq.isEmpty()).toBe(true);
    });

    it("should handle removing non-existent element", () => {
      pq.add("exists", 5);
      pq.remove("nonexistent");

      expect(pq.peek()).toBe("exists");
    });
  });

  describe("changePriority", () => {
    it("should change priority of existing element", () => {
      pq.add("test", 10);
      pq.add("other", 5);

      pq.changePriority("test", 1);
      expect(pq.peek()).toBe("test");
    });

    it("should ignore non-existent element", () => {
      pq.add("exists", 5);
      pq.changePriority("nonexistent", 1);

      expect(pq.peek()).toBe("exists");
    });
  });

  describe("findByValue", () => {
    it("should find element indices by value", () => {
      pq.add("test", 5);
      expect(pq.findByValue("test")).toHaveLength(1);
    });

    it("should find multiple occurrences", () => {
      pq.add("duplicate", 1);
      pq.add("duplicate", 2);
      expect(pq.findByValue("duplicate")).toHaveLength(2);
    });

    it("should return empty array for non-existent element", () => {
      expect(pq.findByValue("nonexistent")).toEqual([]);
    });
  });

  describe("hasValue", () => {
    it("should return true for existing element", () => {
      pq.add("test", 5);
      expect(pq.hasValue("test")).toBe(true);
    });

    it("should return false for non-existent element", () => {
      expect(pq.hasValue("nonexistent")).toBe(false);
    });
  });

  describe("complex scenarios", () => {
    it("should handle mixed operations", () => {
      pq.add("task1", 5);
      pq.add("task2", 1);
      pq.add("task3", 10);

      expect(pq.poll()).toBe("task2");

      pq.changePriority("task3", 0);
      expect(pq.peek()).toBe("task3");

      pq.remove("task1");
      expect(pq.poll()).toBe("task3");
      expect(pq.isEmpty()).toBe(true);
    });

    it("should work with object values", () => {
      type Task = { id: number; name: string };

      const taskPQ = new PriorityQueue<Task>(
        (a, b) => (a.id - b.id) as -1 | 0 | 1,
      );

      const task1: Task = { id: 1, name: "Task 1" };
      const task2: Task = { id: 2, name: "Task 2" };

      taskPQ.add(task2, 5);
      taskPQ.add(task1, 10);

      expect(taskPQ.peek()).toBe(task2);
      expect(taskPQ.hasValue(task1)).toBe(true);
    });
  });

  describe("inherited methods", () => {
    it("should inherit heap navigation methods", () => {
      pq.add("a", 1);
      pq.add("b", 2);
      pq.add("c", 3);

      expect(pq.getLeftChildIndex(0)).toBe(1);
      expect(pq.getRightChildIndex(0)).toBe(2);
      expect(pq.getParentIndex(1)).toBe(0);
      expect(pq.hasParent(1)).toBe(true);
      expect(pq.hasLeftChild(0)).toBe(true);
      expect(typeof pq.toString()).toBe("string");
    });
  });
});
