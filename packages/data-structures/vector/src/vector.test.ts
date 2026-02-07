import { describe, expect, it } from "vitest";
import { Vector } from "./vector.ts";

describe("Vector", () => {
  describe("constructor", () => {
    it("should create 2D vector", () => {
      const v = new Vector(3, 4);

      expect(v.getX()).toBe(3);
      expect(v.getY()).toBe(4);
      expect(v.getZ()).toBe(0);
    });

    it("should create 3D vector", () => {
      const v = new Vector(1, 2, 3);

      expect(v.getZ()).toBe(3);
    });
  });

  describe("getters and setters", () => {
    it("should get and set components", () => {
      const v = new Vector(1, 2, 3);

      expect(v.setX(5)).toBe(v);
      expect(v.getX()).toBe(5);
      expect(v.setY(6).getY()).toBe(6);
      expect(v.setZ(7).getZ()).toBe(7);
    });

    it("should set multiple axes", () => {
      const v = new Vector(1, 2, 3);

      v.setAxes(4, 5, 6);
      expect(v.toArray()).toEqual([4, 5, 6]);
    });

    it("should set 2D axes and reset Z", () => {
      const v = new Vector(1, 2, 3);

      v.setAxes(4, 5);
      expect(v.getZ()).toBe(0);
    });
  });

  describe("mathematical operations", () => {
    it("should add vectors", () => {
      const v1 = new Vector(1, 2, 3);

      v1.add(new Vector(4, 5, 6));
      expect(v1.toArray()).toEqual([5, 7, 9]);
    });

    it("should subtract vectors", () => {
      const v1 = new Vector(5, 7, 9);

      v1.subtract(new Vector(1, 2, 3));
      expect(v1.toArray()).toEqual([4, 5, 6]);
    });

    it("should multiply by scalar", () => {
      const v = new Vector(2, 3, 4);

      v.multiply(2);
      expect(v.toArray()).toEqual([4, 6, 8]);
    });

    it("should multiply by vector", () => {
      const v1 = new Vector(2, 3, 4);

      v1.multiply(new Vector(1, 2, 3));
      expect(v1.toArray()).toEqual([2, 6, 12]);
    });

    it("should calculate dot product", () => {
      const v1 = new Vector(1, 2, 3);

      expect(v1.dotProduct(new Vector(4, 5, 6))).toBe(32);
    });

    it("should calculate cross product", () => {
      const result = new Vector(1, 0, 0).crossProduct(new Vector(0, 1, 0));

      expect(result.toArray()).toEqual([0, 0, 1]);
    });
  });

  describe("geometric operations", () => {
    it("should calculate distance", () => {
      expect(new Vector(0, 0, 0).distance(new Vector(3, 4, 0))).toBe(5);
    });

    it("should calculate angle between vectors", () => {
      const angle = new Vector(1, 0, 0).angleBetween(new Vector(0, 1, 0));

      expect(angle).toBeCloseTo(Math.PI / 2);
    });

    it("should calculate negative angle for clockwise rotation", () => {
      const angle = new Vector(0, 1, 0).angleBetween(new Vector(1, 0, 0));

      expect(angle).toBeCloseTo(-Math.PI / 2);
    });

    it("should handle angle when cross product Z is zero", () => {
      const v1 = new Vector(1, 0, 0);
      const v2 = new Vector(2, 0, 0);
      const angle = v1.angleBetween(v2);

      expect(angle).toBeCloseTo(0);
    });

    it("should calculate magnitude", () => {
      expect(new Vector(3, 4, 0).magnitude()).toBe(5);
    });

    it("should calculate squared magnitude", () => {
      expect(new Vector(3, 4, 0).squaredMagnitude()).toBe(25);
    });

    it("should normalize vector", () => {
      const v = new Vector(3, 4, 0);

      v.normalize();
      expect(v.magnitude()).toBeCloseTo(1);
    });

    it("should handle zero vector normalization", () => {
      const v = new Vector(0, 0, 0);

      v.normalize();
      expect(v.toArray()).toEqual([0, 0, 0]);
    });

    it("should set magnitude", () => {
      const v = new Vector(3, 4, 0);

      v.setMagnitude(10);
      expect(v.magnitude()).toBeCloseTo(10);
    });

    it("should handle zero vector setMagnitude", () => {
      const v = new Vector(0, 0, 0);

      v.setMagnitude(5);
      expect(v.toArray()).toEqual([0, 0, 0]);
    });
  });

  describe("advanced operations", () => {
    it("should perform linear interpolation", () => {
      const v1 = new Vector(0, 0, 0);

      v1.lerp(new Vector(10, 10, 10), 0.5);
      expect(v1.toArray()).toEqual([5, 5, 5]);
    });

    it("should reflect vector", () => {
      const v = new Vector(1, -1, 0);

      v.reflect(new Vector(0, 1, 0));
      expect(v.getY()).toBeCloseTo(1);
    });

    it("should reverse vector", () => {
      const v = new Vector(3, -4, 5);

      v.reverse();
      expect(v.toArray()).toEqual([-3, 4, -5]);
    });
  });

  describe("utility methods", () => {
    it("should check equality", () => {
      expect(new Vector(1, 2, 3).equalsTo(new Vector(1, 2, 3))).toBe(true);
      expect(new Vector(1, 2, 3).equalsTo(new Vector(1, 2, 4))).toBe(false);
    });

    it("should clone vector", () => {
      const v1 = new Vector(1, 2, 3);
      const v2 = v1.clone();

      expect(v2).not.toBe(v1);
      expect(v2.equalsTo(v1)).toBe(true);
    });

    it("should convert to string", () => {
      expect(new Vector(1, 2, 3).toString()).toBe("Vector(1, 2, 3)");
    });

    it("should convert to array", () => {
      expect(new Vector(1, 2, 3).toArray()).toEqual([1, 2, 3]);
    });

    it("should convert to object", () => {
      expect(new Vector(1, 2, 3).toObject()).toEqual({ x: 1, y: 2, z: 3 });
    });
  });

  describe("static methods", () => {
    it("should perform static lerp", () => {
      const result = Vector.lerp(
        new Vector(0, 0, 0),
        new Vector(10, 10, 10),
        0.3,
      );

      expect(result.getX()).toBeCloseTo(3);
    });

    it("should perform static add", () => {
      const result = Vector.add(new Vector(1, 2, 3), new Vector(4, 5, 6));

      expect(result.toArray()).toEqual([5, 7, 9]);
    });

    it("should perform static subtract", () => {
      const result = Vector.subtract(new Vector(5, 7, 9), new Vector(1, 2, 3));

      expect(result.toArray()).toEqual([4, 5, 6]);
    });

    it("should perform static multiply", () => {
      expect(Vector.multiply(new Vector(2, 3, 4), 2).toArray()).toEqual([
        4, 6, 8,
      ]);
      expect(
        Vector.multiply(new Vector(2, 3, 4), new Vector(1, 2, 3)).toArray(),
      ).toEqual([2, 6, 12]);
    });

    it("should perform static dot product", () => {
      expect(Vector.dotProduce(new Vector(1, 2, 3), new Vector(4, 5, 6))).toBe(
        32,
      );
    });

    it("should perform static cross product", () => {
      const result = Vector.crossProduct(
        new Vector(1, 0, 0),
        new Vector(0, 1, 0),
      );

      expect(result.toArray()).toEqual([0, 0, 1]);
    });

    it("should calculate static distance", () => {
      expect(Vector.distance(new Vector(0, 0, 0), new Vector(3, 4, 0))).toBe(5);
    });

    it("should create vector from angle", () => {
      const v = Vector.fromAngle(Math.PI / 2);

      expect(v.getX()).toBeCloseTo(0);
      expect(v.getY()).toBeCloseTo(1);
    });

    it("should create vector from angle with magnitude", () => {
      const v = Vector.fromAngle(0, 5);

      expect(v.getX()).toBeCloseTo(5);
    });

    it("should create vector from array", () => {
      expect(Vector.fromArray([1, 2, 3]).toArray()).toEqual([1, 2, 3]);
      expect(Vector.fromArray([3, 4]).getZ()).toBe(0);
    });
  });

  describe("edge cases", () => {
    it("should handle zero vector operations", () => {
      const zero = new Vector(0, 0, 0);

      expect(zero.dotProduct(new Vector(1, 2, 3))).toBe(0);
      expect(zero.magnitude()).toBe(0);
    });

    it("should support method chaining", () => {
      const v = new Vector(1, 1, 1);
      const result = v
        .multiply(2)
        .add(new Vector(1, 1, 1))
        .normalize();

      expect(result).toBe(v);
      expect(v.magnitude()).toBeCloseTo(1);
    });
  });
});
