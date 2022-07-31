export default class Vector {
  private _x: number;
  private _y: number;
  private _z: number;

  constructor(x: number, y: number);
  constructor(x: number, y: number, z: number);
  constructor(x: number, y: number, z = 0) {
    this._x = x;
    this._y = y;
    this._z = z;
  }

  setX(x: number): Vector {
    this._x = x;

    return this;
  }

  getX(): number {
    return this._x;
  }

  setY(y: number): Vector {
    this._y = y;

    return this;
  }

  getY(): number {
    return this._y;
  }

  setZ(z: number): Vector {
    this._z = z;

    return this;
  }

  getZ(): number {
    return this._z;
  }

  setAxes(x: number, y: number): Vector;
  setAxes(x: number, y: number, z: number): Vector;
  setAxes(x: number, y: number, z = 0): Vector {
    this._x = x;
    this._y = y;
    this._z = z;

    return this;
  }

  add(vector: Vector): Vector {
    this._x += vector.getX();
    this._y += vector.getY();
    this._z += vector.getZ();

    return this;
  }

  subtract(vector: Vector): Vector {
    this._x -= vector.getX();
    this._y -= vector.getY();
    this._z -= vector.getZ();

    return this;
  }

  multiply(vector: Vector): Vector;
  multiply(scalar: number): Vector;
  multiply(vectorOrScalar: Vector | number): Vector {
    if (vectorOrScalar instanceof Vector) {
      this._x *= vectorOrScalar.getX();
      this._y *= vectorOrScalar.getY();
      this._z *= vectorOrScalar.getZ();
    } else {
      this._x *= vectorOrScalar;
      this._y *= vectorOrScalar;
      this._z *= vectorOrScalar;
    }

    return this;
  }

  dotProduct(vector: Vector): number {
    return (
      this._x * vector.getX() +
      this._y * vector.getY() +
      this._z * vector.getZ()
    );
  }

  crossProduct(vector: Vector): Vector {
    return new Vector(
      this._y * vector.getZ() - this._z * vector.getY(),
      this._z * vector.getX() - this._x * vector.getZ(),
      this._x * vector.getY() - this._y * vector.getX()
    );
  }

  distance(vector: Vector): number {
    return vector.clone().subtract(this).magnitude();
  }

  angleBetween(vector: Vector): number {
    const dotMagMag =
      this.dotProduct(vector) / (this.magnitude() * vector.magnitude());

    // Mathematically speaking: the `dotMagMag` variable will be between -1 and 1
    // inclusive. Practically though it could be slightly outside this range due
    // to floating-point rounding issues. This can make Math.acos return NaN.
    // Solution: we'll clamp the value to the -1,1 range:
    let angle;
    angle = Math.acos(Math.min(1, Math.max(-1, dotMagMag)));
    angle = angle * Math.sign(this.crossProduct(vector).getZ() || 1);

    return angle;
  }

  lerp(vector: Vector, t: number): Vector {
    return this.add(vector.subtract(this).multiply(new Vector(t, t, t)));
  }

  normalize(): Vector {
    const magnitude = this.magnitude();
    if (magnitude !== 0) this.multiply(1 / magnitude);

    return this;
  }

  reflect(surfaceNormal: Vector): Vector {
    surfaceNormal.normalize();
    return this.subtract(
      surfaceNormal.multiply(2 * this.dotProduct(surfaceNormal))
    );
  }

  reverse(): Vector {
    return this.multiply(-1);
  }

  setMagnitude(magnitude: number): Vector {
    return this.normalize().multiply(magnitude);
  }

  magnitude(): number {
    return Math.sqrt(this.squaredMagnitude());
  }

  squaredMagnitude(): number {
    return this._x ** 2 + this._y ** 2 + this._z ** 2;
  }

  equalsTo(vector: Vector): boolean {
    return (
      vector.getX() === this._x &&
      vector.getY() === this._y &&
      vector.getZ() === this._z
    );
  }

  clone(): Vector {
    return new Vector(this._x, this._y, this._z);
  }

  toString(): string {
    return `Vector(${this._x}, ${this._y}, ${this._z})`;
  }

  toArray(): [number, number, number] {
    return [this._x, this._y, this._z];
  }

  toObject(): { x: number; y: number; z: number } {
    return { x: this._x, y: this._y, z: this._z };
  }

  static lerp(vector1: Vector, vector2: Vector, t: number): Vector {
    return vector1.lerp(vector2, t);
  }

  static add(vector1: Vector, vector2: Vector): Vector {
    return vector1.add(vector2);
  }

  static subtract(vector1: Vector, vector2: Vector): Vector {
    return vector1.subtract(vector2);
  }

  static multiply(vector1: Vector, vector2: Vector): Vector;
  static multiply(vector1: Vector, scalar: number): Vector;
  static multiply(vector1: Vector, vectorOrScalar: Vector | number): Vector {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return vector1.multiply(vectorOrScalar);
  }

  static dotProduce(vector1: Vector, vector2: Vector): number {
    return vector1.dotProduct(vector2);
  }

  static crossProduct(vector1: Vector, vector2: Vector): Vector {
    return vector1.crossProduct(vector2);
  }

  static distance(vector1: Vector, vector2: Vector): number {
    return vector1.distance(vector2);
  }

  static fromAngle(angleInRadians: number, magnitude = 1): Vector {
    return new Vector(
      magnitude * Math.cos(angleInRadians),
      magnitude * Math.sin(angleInRadians),
      0
    );
  }

  static fromArray(
    arrayOfComponents: [number, number, number] | [number, number]
  ): Vector {
    return new Vector(
      arrayOfComponents[0],
      arrayOfComponents[1],
      arrayOfComponents[2] ?? 0
    );
  }
}
