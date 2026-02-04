import { beforeEach, describe, expect, it } from "vitest";
import { Edge } from "./edge.ts";
import { Graph } from "./graph.ts";
import { Vertex } from "./vertex.ts";

describe("Graph", () => {
  let graph: Graph<string>;
  let directedGraph: Graph<string>;
  let vertexA: Vertex<string>;
  let vertexB: Vertex<string>;
  let vertexC: Vertex<string>;

  beforeEach(() => {
    graph = new Graph<string>();
    directedGraph = new Graph<string>(true);
    vertexA = new Vertex("A");
    vertexB = new Vertex("B");
    vertexC = new Vertex("C");
  });

  describe("constructor", () => {
    it("should create undirected graph by default", () => {
      expect(new Graph().isDirected()).toBe(false);
    });

    it("should create directed graph when specified", () => {
      expect(new Graph(true).isDirected()).toBe(true);
    });
  });

  describe("vertex management", () => {
    it("should add and get vertex", () => {
      graph.addVertex(vertexA);
      expect(graph.getVertex("A")).toBe(vertexA);
    });

    it("should return null for non-existent vertex", () => {
      expect(graph.getVertex("X")).toBeNull();
    });

    it("should get all vertices", () => {
      graph.addVertex(vertexA);
      graph.addVertex(vertexB);
      expect(graph.getVertices()).toHaveLength(2);
    });

    it("should create vertex index map", () => {
      graph.addVertex(vertexA);
      graph.addVertex(vertexB);
      const map = graph.getVerticesIndexMap();

      expect(map["A"]).toBe(0);
      expect(map["B"]).toBe(1);
    });
  });

  describe("edge management", () => {
    it("should add edge to undirected graph", () => {
      graph.addEdge(new Edge(vertexA, vertexB));
      expect(graph.getEdges()).toHaveLength(1);
      expect(vertexA.hasNeighbor(vertexB)).toBe(true);
      expect(vertexB.hasNeighbor(vertexA)).toBe(true);
    });

    it("should add edge to directed graph", () => {
      directedGraph.addEdge(new Edge(vertexA, vertexB));
      expect(vertexA.hasNeighbor(vertexB)).toBe(true);
      expect(vertexB.hasNeighbor(vertexA)).toBe(false);
    });

    it("should not add duplicate edges", () => {
      graph.addEdge(new Edge(vertexA, vertexB));
      graph.addEdge(new Edge(vertexA, vertexB));
      expect(graph.getEdges()).toHaveLength(1);
    });

    it("should handle self-loop", () => {
      graph.addEdge(new Edge(vertexA, vertexA));
      expect(vertexA.hasSelfLoop()).toBe(true);
    });

    it("should create vertices when adding edge", () => {
      graph.addEdge(new Edge(vertexA, vertexB));
      expect(graph.getVertices()).toHaveLength(2);
    });

    it("should use existing vertices when adding edge", () => {
      graph.addVertex(vertexA);
      graph.addEdge(new Edge(vertexA, vertexB));
      expect(graph.getVertex("A")).toBe(vertexA);
    });
  });

  describe("findEdge", () => {
    it("should find edge between vertices", () => {
      const edge = new Edge(vertexA, vertexB);

      graph.addEdge(edge);
      expect(graph.findEdge(vertexA, vertexB)).toBe(edge);
    });

    it("should find edge by edge object", () => {
      const edge = new Edge(vertexA, vertexB);

      graph.addEdge(edge);
      expect(graph.findEdge(edge)).toBe(edge);
    });

    it("should return null for non-existent edge", () => {
      expect(graph.findEdge(vertexA, vertexB)).toBeNull();
    });

    it("should throw error for invalid arguments", () => {
      expect(() =>
        graph.findEdge(vertexA as unknown as Edge<string>),
      ).toThrow();
    });
  });

  describe("deleteEdge", () => {
    it("should remove edge from graph", () => {
      const edge = new Edge(vertexA, vertexB);

      graph.addEdge(edge);
      graph.deleteEdge(edge);
      expect(graph.getEdges()).toHaveLength(0);
    });

    it("should handle non-existent edge deletion", () => {
      expect(() => graph.deleteEdge(new Edge(vertexA, vertexB))).not.toThrow();
    });
  });

  describe("weight", () => {
    it("should calculate total weight", () => {
      graph.addEdge(new Edge(vertexA, vertexB, 5));
      graph.addEdge(new Edge(vertexB, vertexC, 3));
      expect(graph.getWeight()).toBe(8);
    });

    it("should return 0 for empty graph", () => {
      expect(graph.getWeight()).toBe(0);
    });
  });

  describe("reverse", () => {
    it("should not affect undirected graph", () => {
      graph.addEdge(new Edge(vertexA, vertexB));
      graph.reverse();
      expect(vertexA.hasNeighbor(vertexB)).toBe(true);
    });

    it("should reverse edges in directed graph", () => {
      directedGraph.addEdge(new Edge(vertexA, vertexB));
      directedGraph.reverse();
      expect(directedGraph.findEdge(vertexB, vertexA)).not.toBeNull();
    });

    it("should handle empty graph", () => {
      expect(() => directedGraph.reverse()).not.toThrow();
    });
  });

  describe("adjacency matrix", () => {
    beforeEach(() => {
      graph.addVertex(vertexA);
      graph.addVertex(vertexB);
      graph.addVertex(vertexC);
    });

    it("should generate unweighted matrix", () => {
      graph.addEdge(new Edge(vertexA, vertexB));
      const matrix = graph.getAdjacencyMatrix(true);

      expect(matrix[0]?.[1]).toBe(1);
      expect(matrix[1]?.[0]).toBe(1);
      expect(matrix[0]?.[2]).toBe(0);
    });

    it("should generate weighted matrix", () => {
      graph.addEdge(new Edge(vertexA, vertexB, 5));
      const matrix = graph.getAdjacencyMatrix();

      expect(matrix[0]?.[1]).toBe(5);
      expect(matrix[0]?.[2]).toBe(Infinity);
    });

    it("should handle self-loop as 2 in unweighted", () => {
      graph.addEdge(new Edge(vertexA, vertexA));
      const matrix = graph.getAdjacencyMatrix(true);

      expect(matrix[0]?.[0]).toBe(2);
    });
  });

  describe("breadthFirstSearch", () => {
    beforeEach(() => {
      graph.addEdge(new Edge(vertexA, vertexB));
      graph.addEdge(new Edge(vertexB, vertexC));
    });

    it("should traverse all reachable vertices", () => {
      const visited: string[] = [];

      graph.breadthFirstSearch(vertexA, {
        onEnter: (_, curr) => visited.push(curr.getValue()),
      });
      expect(visited).toContain("A");
      expect(visited).toContain("B");
      expect(visited).toContain("C");
    });

    it("should work without callbacks", () => {
      expect(() => graph.breadthFirstSearch(vertexA)).not.toThrow();
    });

    it("should respect shouldTraverse callback", () => {
      const visited: string[] = [];
      const seen: Record<string, boolean> = {};

      graph.breadthFirstSearch(vertexA, {
        onEnter: (_, curr) => visited.push(curr.getValue()),
        shouldTraverse: (_, __, next) => {
          if (seen[next.getKey()] || next.getValue() === "C") return false;
          seen[next.getKey()] = true;
          return true;
        },
      });
      expect(visited).not.toContain("C");
    });
  });

  describe("depthFirstSearch", () => {
    beforeEach(() => {
      graph.addEdge(new Edge(vertexA, vertexB));
      graph.addEdge(new Edge(vertexB, vertexC));
    });

    it("should traverse all reachable vertices", () => {
      const visited: string[] = [];

      graph.depthFirstSearch(vertexA, {
        onEnter: (_, curr) => visited.push(curr.getValue()),
      });
      expect(visited).toContain("A");
      expect(visited).toContain("B");
      expect(visited).toContain("C");
    });

    it("should work without callbacks", () => {
      expect(() => graph.depthFirstSearch(vertexA)).not.toThrow();
    });

    it("should call onLeave callback", () => {
      const left: string[] = [];

      graph.depthFirstSearch(vertexA, {
        onLeave: (_, curr) => left.push(curr.getValue()),
      });
      expect(left.length).toBeGreaterThan(0);
    });
  });
});
