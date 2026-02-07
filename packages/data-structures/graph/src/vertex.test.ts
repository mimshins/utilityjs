import { beforeEach, describe, expect, it } from "vitest";
import { Edge } from "./edge.ts";
import { Vertex } from "./vertex.ts";

describe("Vertex", () => {
  let vertexA: Vertex<string>;
  let vertexB: Vertex<string>;
  let vertexC: Vertex<string>;

  beforeEach(() => {
    vertexA = new Vertex("A");
    vertexB = new Vertex("B");
    vertexC = new Vertex("C");
  });

  describe("constructor", () => {
    it("should create vertex with value as key", () => {
      expect(vertexA.getValue()).toBe("A");
      expect(vertexA.getKey()).toBe("A");
    });

    it("should create vertex with custom key", () => {
      const v = new Vertex("value", "custom-key");

      expect(v.getKey()).toBe("custom-key");
    });

    it("should throw error for undefined value", () => {
      expect(() => new Vertex<undefined>(undefined)).toThrow("valid value");
    });

    it("should handle various value types", () => {
      expect(new Vertex(42).getKey()).toBe("42");
      expect(new Vertex(true).getKey()).toBe("true");
      expect(new Vertex({ id: 1 }).getKey()).toBe("[object Object]");
    });
  });

  describe("value accessors", () => {
    it("should get and set value", () => {
      vertexA.setValue("new");
      expect(vertexA.getValue()).toBe("new");
    });
  });

  describe("edge management", () => {
    it("should add and get edges", () => {
      const edge = new Edge(vertexA, vertexB);

      vertexA.addEdge(edge);
      expect(vertexA.getEdges()).toContain(edge);
      expect(vertexA.hasEdge(edge)).toBe(true);
    });

    it("should return false for non-matching edge in hasEdge", () => {
      vertexA.addEdge(new Edge(vertexA, vertexB));
      expect(vertexA.hasEdge(new Edge(vertexA, vertexC))).toBe(false);
    });

    it("should delete edges", () => {
      const edge = new Edge(vertexA, vertexB);

      vertexA.addEdge(edge);
      vertexA.deleteEdge(edge);
      expect(vertexA.hasEdge(edge)).toBe(false);
    });

    it("should handle non-existent edge deletion", () => {
      expect(() =>
        vertexA.deleteEdge(new Edge(vertexA, vertexB)),
      ).not.toThrow();
    });

    it("should clear all edges", () => {
      vertexA.addEdge(new Edge(vertexA, vertexB));
      vertexA.addEdge(new Edge(vertexA, vertexC));
      vertexA.clearEdges();
      expect(vertexA.getEdges()).toHaveLength(0);
    });
  });

  describe("degree", () => {
    it("should return 0 for isolated vertex", () => {
      expect(vertexA.getDegree()).toBe(0);
    });

    it("should count edges", () => {
      vertexA.addEdge(new Edge(vertexA, vertexB));
      vertexA.addEdge(new Edge(vertexA, vertexC));
      expect(vertexA.getDegree()).toBe(2);
    });

    it("should count self-loop as 2", () => {
      vertexA.addEdge(new Edge(vertexA, vertexA));
      expect(vertexA.getDegree()).toBe(2);
    });
  });

  describe("neighbors", () => {
    it("should find neighbor when vertex is vA", () => {
      const edge = new Edge(vertexA, vertexB);

      vertexA.addEdge(edge);
      expect(vertexA.getNeighborEdge(vertexB)).toBe(edge);
      expect(vertexA.hasNeighbor(vertexB)).toBe(true);
    });

    it("should find neighbor when vertex is vB", () => {
      const edge = new Edge(vertexB, vertexA);

      vertexA.addEdge(edge);
      expect(vertexA.getNeighborEdge(vertexB)).toBe(edge);
      expect(vertexA.hasNeighbor(vertexB)).toBe(true);
    });

    it("should return null for non-neighbor", () => {
      expect(vertexA.getNeighborEdge(vertexB)).toBeNull();
      expect(vertexA.hasNeighbor(vertexB)).toBe(false);
    });

    it("should get all neighbors", () => {
      vertexA.addEdge(new Edge(vertexA, vertexB));
      vertexA.addEdge(new Edge(vertexA, vertexC));
      expect(vertexA.getNeighbors()).toContain(vertexB);
      expect(vertexA.getNeighbors()).toContain(vertexC);
    });

    it("should handle neighbor lookup with edge where vertex is vB", () => {
      const edge = new Edge(vertexB, vertexA);

      vertexA.addEdge(edge);
      expect(vertexA.getNeighbors()).toContain(vertexB);
    });
  });

  describe("self-loop", () => {
    it("should detect self-loop", () => {
      const selfLoop = new Edge(vertexA, vertexA);

      vertexA.addEdge(selfLoop);
      expect(vertexA.hasSelfLoop()).toBe(true);
      expect(vertexA.getSelfLoop()).toBe(selfLoop);
      expect(vertexA.hasNeighbor(vertexA)).toBe(true);
    });

    it("should return null when no self-loop", () => {
      vertexA.addEdge(new Edge(vertexA, vertexB));
      expect(vertexA.hasSelfLoop()).toBe(false);
      expect(vertexA.getSelfLoop()).toBeNull();
    });

    it("should return null when self-loop exists but searching for different vertex", () => {
      vertexA.addEdge(new Edge(vertexA, vertexA));
      expect(vertexA.getNeighborEdge(vertexB)).toBeNull();
      expect(vertexA.hasNeighbor(vertexB)).toBe(false);
    });
  });

  describe("edge comparator", () => {
    it("should compare edges with different keys during deletion", () => {
      const edge1 = new Edge(vertexA, vertexB, 0, "key1");
      const edge2 = new Edge(vertexA, vertexC, 0, "key2");

      vertexA.addEdge(edge1);
      vertexA.addEdge(edge2);
      // Delete second edge to trigger traverse comparison
      vertexA.deleteEdge(edge2);
      expect(vertexA.getEdges()).toHaveLength(1);
    });

    it("should compare edges with identical keys", () => {
      vertexA.addEdge(new Edge(vertexA, vertexB, 0, "same"));
      vertexA.addEdge(new Edge(vertexA, vertexC, 0, "same"));
      expect(vertexA.getEdges()).toHaveLength(2);
    });
  });
});
