import { beforeEach, describe, expect, it } from "vitest";
import { Edge } from "./edge.ts";
import { Vertex } from "./vertex.ts";

describe("Edge", () => {
  let vertexA: Vertex<string>;
  let vertexB: Vertex<string>;
  let edge: Edge<string>;

  beforeEach(() => {
    vertexA = new Vertex("A");
    vertexB = new Vertex("B");
    edge = new Edge(vertexA, vertexB);
  });

  describe("constructor", () => {
    it("should create edge with default weight 0", () => {
      expect(edge.getVA()).toBe(vertexA);
      expect(edge.getVB()).toBe(vertexB);
      expect(edge.getWeight()).toBe(0);
    });

    it("should create edge with custom weight and key", () => {
      const e = new Edge(vertexA, vertexB, 5, "custom");

      expect(e.getWeight()).toBe(5);
      expect(e.getKey()).toBe("custom");
    });

    it("should throw error for undefined vertices", () => {
      expect(
        () => new Edge(undefined as unknown as Vertex<string>, vertexB),
      ).toThrow("valid start vertex");
      expect(
        () => new Edge(vertexA, undefined as unknown as Vertex<string>),
      ).toThrow("valid end vertex");
    });

    it("should handle negative and decimal weights", () => {
      expect(new Edge(vertexA, vertexB, -5).getWeight()).toBe(-5);
      expect(new Edge(vertexA, vertexB, 3.14).getWeight()).toBe(3.14);
    });
  });

  describe("vertex accessors", () => {
    it("should get and set vertices", () => {
      const newVertex = new Vertex("C");

      edge.setVA(newVertex);
      expect(edge.getVA()).toBe(newVertex);
      edge.setVB(newVertex);
      expect(edge.getVB()).toBe(newVertex);
    });
  });

  describe("weight", () => {
    it("should get and set weight", () => {
      edge.setWeight(15);
      expect(edge.getWeight()).toBe(15);
      edge.setWeight(0);
      expect(edge.getWeight()).toBe(0);
    });
  });

  describe("getKey", () => {
    it("should return generated key from vertex keys", () => {
      expect(edge.getKey()).toBe("A:B");
    });

    it("should return custom key when provided", () => {
      const e = new Edge(vertexA, vertexB, 0, "custom");

      expect(e.getKey()).toBe("custom");
    });

    it("should use vertex custom keys", () => {
      const e = new Edge(new Vertex("v1", "k1"), new Vertex("v2", "k2"));

      expect(e.getKey()).toBe("k1:k2");
    });
  });

  describe("isSelfLoop", () => {
    it("should return true for self-loop", () => {
      expect(new Edge(vertexA, vertexA).isSelfLoop()).toBe(true);
    });

    it("should return false for different vertices", () => {
      expect(edge.isSelfLoop()).toBe(false);
    });

    it("should detect self-loop by key match", () => {
      expect(new Edge(vertexA, new Vertex("A")).isSelfLoop()).toBe(true);
      expect(
        new Edge(new Vertex("x", "k"), new Vertex("y", "k")).isSelfLoop(),
      ).toBe(true);
    });
  });

  describe("reverse", () => {
    it("should swap vertices", () => {
      edge.reverse();
      expect(edge.getVA()).toBe(vertexB);
      expect(edge.getVB()).toBe(vertexA);
      expect(edge.getKey()).toBe("B:A");
    });

    it("should preserve weight and custom key", () => {
      const e = new Edge(vertexA, vertexB, 10, "custom");

      e.reverse();
      expect(e.getWeight()).toBe(10);
      expect(e.getKey()).toBe("custom");
    });

    it("should be reversible", () => {
      edge.reverse();
      edge.reverse();
      expect(edge.getVA()).toBe(vertexA);
    });
  });
});
