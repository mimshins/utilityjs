<div align="center">
  <h1 align="center">
    PriorityQueue
  </h1>
</div>

<div align="center">

An implementation of PriorityQueue data structure.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/priority-queue?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/priority-queue)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/priority-queue?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/priority-queue)
[![types](https://img.shields.io/npm/types/@utilityjs/priority-queue?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/priority-queue)

```bash
npm i @utilityjs/priority-queue | yarn add @utilityjs/priority-queue
```

</div>

<hr>

### `PriorityQueue(compareFunction?)`

```ts
export default class Vector {
  constructor(x: number, y: number);
  constructor(x: number, y: number, z: number);
  setX(x: number): Vector;
  getX(): number;
  setY(y: number): Vector;
  getY(): number;
  setZ(z: number): Vector;
  getZ(): number;
  setAxes(x: number, y: number): Vector;
  setAxes(x: number, y: number, z: number): Vector;
  add(vector: Vector): Vector;
  subtract(vector: Vector): Vector;
  multiply(vector: Vector): Vector;
  multiply(scalar: number): Vector;
  dotProduct(vector: Vector): number;
  crossProduct(vector: Vector): Vector;
  distance(vector: Vector): number;
  angleBetween(vector: Vector): number;
  lerp(vector: Vector, t: number): Vector;
  normalize(): Vector;
  reflect(surfaceNormal: Vector): Vector;
  reverse(): Vector;
  setMagnitude(magnitude: number): Vector;
  magnitude(): number;
  squaredMagnitude(): number;
  equalsTo(vector: Vector): boolean;
  clone(): Vector;
  toString(): string;
  toArray(): [number, number, number];
  toObject(): { x: number; y: number; z: number; };
  static lerp(vector1: Vector, vector2: Vector, t: number): Vector;
  static add(vector1: Vector, vector2: Vector): Vector;
  static subtract(vector1: Vector, vector2: Vector): Vector;
  static multiply(vector1: Vector, vector2: Vector): Vector;
  static multiply(vector1: Vector, scalar: number): Vector;
  static dotProduce(vector1: Vector, vector2: Vector): number;
  static crossProduct(vector1: Vector, vector2: Vector): Vector;
  static distance(vector1: Vector, vector2: Vector): number;
  static fromAngle(angleInRadians: number, magnitude?: number): Vector;
  static fromArray(
    arrayOfComponents: [number, number, number] | [number, number]
  ): Vector;
}
```