<div align="center">
  <h1 align="center">
    Vector
  </h1>
</div>

<div align="center">

An implementation of a two or three-dimensional Vector.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/vector?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/vector)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/vector?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/vector)
[![types](https://img.shields.io/npm/types/@utilityjs/vector?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/vector)

```bash
npm i @utilityjs/vector | yarn add @utilityjs/vector
```

</div>

<hr>

### `Vector(x, y, z?)`

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
  getNormalizedVector(): Vector;
  reflect(surfaceNormal: Vector): Vector;
  reverse(): Vector;
  setMagnitude(magnitude: number): Vector;
  magnitude(): number;
  squaredMagnitude(): number;
  equalsTo(vector: Vector): boolean;
  clone(): Vector;
  toString(): string;
  toArray(): [number, number, number];
  toObject(): {
    x: number;
    y: number;
    z: number;
  };
  static fromAngle(angleInRadians: number, magnitude?: number): Vector;
  static fromArray(
    arrayOfComponents: [number, number, number] | [number, number]
  ): Vector;
}
```