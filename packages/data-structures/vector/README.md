<div align="center">

# UtilityJS | Vector

A 2D/3D vector implementation with mathematical operations.

</div>

<hr />

## Features

- **2D and 3D Support**: Works with both 2D and 3D vectors
- **Mathematical Operations**: Add, subtract, multiply, dot product, cross
  product
- **Vector Utilities**: Normalize, reflect, lerp, distance, angle calculation
- **Method Chaining**: Fluent API for composing operations
- **Static Methods**: Class-level operations for functional style

## Installation

```bash
npm install @utilityjs/vector
```

or

```bash
pnpm add @utilityjs/vector
```

## Usage

### Creating Vectors

```typescript
import { Vector } from "@utilityjs/vector";

const v2d = new Vector(3, 4); // 2D vector
const v3d = new Vector(1, 2, 3); // 3D vector
```

### Basic Operations

```typescript
const v1 = new Vector(1, 2);
const v2 = new Vector(3, 4);

v1.add(v2); // v1 is now (4, 6)
v1.subtract(v2); // v1 is now (1, 2)
v1.multiply(2); // v1 is now (2, 4)
```

### Vector Math

```typescript
const v1 = new Vector(3, 4);

v1.magnitude(); // 5
v1.normalize(); // unit vector
v1.dotProduct(new Vector(1, 0)); // dot product

const v2 = new Vector(1, 0, 0);
const v3 = new Vector(0, 1, 0);
v2.crossProduct(v3); // (0, 0, 1)
```

### Static Methods

```typescript
const v1 = new Vector(1, 2);
const v2 = new Vector(3, 4);

Vector.distance(v1, v2);
Vector.lerp(v1, v2, 0.5);
Vector.fromAngle(Math.PI / 4);
Vector.fromArray([1, 2, 3]);
```

## API

### `Vector`

#### Constructor

- `new Vector(x: number, y: number)` - Creates a 2D vector
- `new Vector(x: number, y: number, z: number)` - Creates a 3D vector

#### Instance Methods

- `getX(): number` / `setX(x): Vector` - X component accessor
- `getY(): number` / `setY(y): Vector` - Y component accessor
- `getZ(): number` / `setZ(z): Vector` - Z component accessor
- `setAxes(x, y, z?): Vector` - Set all components
- `add(vector): Vector` - Add another vector
- `subtract(vector): Vector` - Subtract another vector
- `multiply(vectorOrScalar): Vector` - Multiply by vector or scalar
- `dotProduct(vector): number` - Calculate dot product
- `crossProduct(vector): Vector` - Calculate cross product
- `distance(vector): number` - Calculate distance to another vector
- `angleBetween(vector): number` - Calculate angle in radians
- `lerp(vector, t): Vector` - Linear interpolation
- `normalize(): Vector` - Normalize to unit length
- `reflect(surfaceNormal): Vector` - Reflect across surface
- `reverse(): Vector` - Reverse direction
- `setMagnitude(magnitude): Vector` - Set magnitude preserving direction
- `magnitude(): number` - Get vector length
- `squaredMagnitude(): number` - Get squared length (efficient)
- `equalsTo(vector): boolean` - Check equality
- `clone(): Vector` - Create a copy
- `toString(): string` - String representation
- `toArray(): [number, number, number]` - Convert to array
- `toObject(): { x, y, z }` - Convert to object

#### Static Methods

- `Vector.add(v1, v2): Vector` - Add two vectors
- `Vector.subtract(v1, v2): Vector` - Subtract vectors
- `Vector.multiply(v1, v2OrScalar): Vector` - Multiply vectors
- `Vector.dotProduce(v1, v2): number` - Dot product
- `Vector.crossProduct(v1, v2): Vector` - Cross product
- `Vector.distance(v1, v2): number` - Distance between vectors
- `Vector.lerp(v1, v2, t): Vector` - Linear interpolation
- `Vector.fromAngle(angle, magnitude?): Vector` - Create from angle
- `Vector.fromArray(array): Vector` - Create from array

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
