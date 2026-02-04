/**
 * A 2D/3D vector implementation with mathematical operations.
 * Supports both 2D and 3D vectors with z-axis defaulting to 0 for 2D operations.
 */
export class Vector {
  private _x: number;
  private _y: number;
  private _z: number;

  /**
   * Creates a new 2D vector.
   *
   * @param x The x-component of the vector
   * @param y The y-component of the vector
   */
  constructor(x: number, y: number);
  /**
   * Creates a new 3D vector.
   *
   * @param x The x-component of the vector
   * @param y The y-component of the vector
   * @param z The z-component of the vector
   */
  constructor(x: number, y: number, z: number);
  constructor(x: number, y: number, z = 0) {
    this._x = x;
    this._y = y;
    this._z = z;
  }

  /**
   * Sets the x-component of the vector.
   *
   * @param x The new x-component value
   * @returns This vector instance for method chaining
   */
  public setX(x: number): Vector {
    this._x = x;

    return this;
  }

  /**
   * Gets the x-component of the vector.
   *
   * @returns The x-component value
   */
  public getX(): number {
    return this._x;
  }

  /**
   * Sets the y-component of the vector.
   *
   * @param y The new y-component value
   * @returns This vector instance for method chaining
   */
  public setY(y: number): Vector {
    this._y = y;

    return this;
  }

  /**
   * Gets the y-component of the vector.
   *
   * @returns The y-component value
   */
  public getY(): number {
    return this._y;
  }

  /**
   * Sets the z-component of the vector.
   *
   * @param z The new z-component value
   * @returns This vector instance for method chaining
   */
  public setZ(z: number): Vector {
    this._z = z;

    return this;
  }

  /**
   * Gets the z-component of the vector.
   *
   * @returns The z-component value
   */
  public getZ(): number {
    return this._z;
  }

  /**
   * Sets the x and y components of the vector (2D).
   *
   * @param x The new x-component value
   * @param y The new y-component value
   * @returns This vector instance for method chaining
   */
  public setAxes(x: number, y: number): Vector;
  /**
   * Sets the x, y, and z components of the vector (3D).
   *
   * @param x The new x-component value
   * @param y The new y-component value
   * @param z The new z-component value
   * @returns This vector instance for method chaining
   */
  public setAxes(x: number, y: number, z: number): Vector;
  public setAxes(x: number, y: number, z = 0): Vector {
    this._x = x;
    this._y = y;
    this._z = z;

    return this;
  }

  /**
   * Adds another vector to this vector (component-wise addition).
   *
   * @param vector The vector to add
   * @returns This vector instance for method chaining
   */
  public add(vector: Vector): Vector {
    this._x += vector.getX();
    this._y += vector.getY();
    this._z += vector.getZ();

    return this;
  }

  /**
   * Subtracts another vector from this vector (component-wise subtraction).
   *
   * @param vector The vector to subtract
   * @returns This vector instance for method chaining
   */
  public subtract(vector: Vector): Vector {
    this._x -= vector.getX();
    this._y -= vector.getY();
    this._z -= vector.getZ();

    return this;
  }

  /**
   * Multiplies this vector by another vector (component-wise multiplication).
   *
   * @param vector The vector to multiply by
   * @returns This vector instance for method chaining
   */
  public multiply(vector: Vector): Vector;
  /**
   * Multiplies this vector by a scalar value.
   *
   * @param scalar The scalar value to multiply by
   * @returns This vector instance for method chaining
   */
  public multiply(scalar: number): Vector;
  public multiply(vectorOrScalar: Vector | number): Vector {
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

  /**
   * Calculates the dot product of this vector and another vector.
   *
   * @param vector The other vector
   * @returns The dot product (scalar value)
   */
  public dotProduct(vector: Vector): number {
    return (
      this._x * vector.getX() +
      this._y * vector.getY() +
      this._z * vector.getZ()
    );
  }

  /**
   * Calculates the cross product of this vector and another vector.
   *
   * @param vector The other vector
   * @returns A new vector representing the cross product
   */
  public crossProduct(vector: Vector): Vector {
    return new Vector(
      this._y * vector.getZ() - this._z * vector.getY(),
      this._z * vector.getX() - this._x * vector.getZ(),
      this._x * vector.getY() - this._y * vector.getX(),
    );
  }

  /**
   * Calculates the Euclidean distance between this vector and another vector.
   *
   * @param vector The other vector
   * @returns The distance between the vectors
   */
  public distance(vector: Vector): number {
    return vector.clone().subtract(this).magnitude();
  }

  /**
   * Calculates the angle between this vector and another vector in radians.
   *
   * @param vector The other vector
   * @returns The angle in radians (-π to π)
   */
  public angleBetween(vector: Vector): number {
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

  /**
   * Performs linear interpolation between this vector and another vector.
   *
   * @param vector The target vector to interpolate towards
   * @param t The interpolation factor (0 = this vector, 1 = target vector)
   * @returns This vector instance for method chaining
   */
  public lerp(vector: Vector, t: number): Vector {
    return this.add(vector.subtract(this).multiply(new Vector(t, t, t)));
  }

  /**
   * Normalizes this vector to unit length (magnitude of 1).
   *
   * @returns This vector instance for method chaining
   */
  public normalize(): Vector {
    const magnitude = this.magnitude();

    if (magnitude !== 0) this.multiply(1 / magnitude);

    return this;
  }

  /**
   * Reflects this vector across a surface defined by its normal vector.
   *
   * @param surfaceNormal The normal vector of the surface
   * @returns This vector instance for method chaining
   */
  public reflect(surfaceNormal: Vector): Vector {
    surfaceNormal.normalize();
    return this.subtract(
      surfaceNormal.multiply(2 * this.dotProduct(surfaceNormal)),
    );
  }

  /**
   * Reverses the direction of this vector (multiplies by -1).
   *
   * @returns This vector instance for method chaining
   */
  public reverse(): Vector {
    return this.multiply(-1);
  }

  /**
   * Sets the magnitude of this vector while preserving its direction.
   *
   * @param magnitude The new magnitude value
   * @returns This vector instance for method chaining
   */
  public setMagnitude(magnitude: number): Vector {
    return this.normalize().multiply(magnitude);
  }

  /**
   * Calculates the magnitude (length) of this vector.
   *
   * @returns The magnitude of the vector
   */
  public magnitude(): number {
    return Math.sqrt(this.squaredMagnitude());
  }

  /**
   * Calculates the squared magnitude of this vector (more efficient than magnitude).
   *
   * @returns The squared magnitude of the vector
   */
  public squaredMagnitude(): number {
    return this._x ** 2 + this._y ** 2 + this._z ** 2;
  }

  /**
   * Checks if this vector is equal to another vector.
   *
   * @param vector The vector to compare with
   * @returns True if vectors are equal, false otherwise
   */
  public equalsTo(vector: Vector): boolean {
    return (
      vector.getX() === this._x &&
      vector.getY() === this._y &&
      vector.getZ() === this._z
    );
  }

  /**
   * Creates a copy of this vector.
   *
   * @returns A new Vector instance with the same components
   */
  public clone(): Vector {
    return new Vector(this._x, this._y, this._z);
  }

  /**
   * Returns a string representation of this vector.
   *
   * @returns String in format "Vector(x, y, z)"
   */
  public toString(): string {
    return `Vector(${this._x}, ${this._y}, ${this._z})`;
  }

  /**
   * Converts this vector to an array of components.
   *
   * @returns Array containing [x, y, z] components
   */
  public toArray(): [number, number, number] {
    return [this._x, this._y, this._z];
  }

  /**
   * Converts this vector to an object with named components.
   *
   * @returns Object with x, y, z properties
   */
  public toObject(): { x: number; y: number; z: number } {
    return { x: this._x, y: this._y, z: this._z };
  }

  /**
   * Performs linear interpolation between two vectors.
   *
   * @param vector1 The starting vector
   * @param vector2 The target vector
   * @param t The interpolation factor (0 = vector1, 1 = vector2)
   * @returns The interpolated vector
   */
  public static lerp(vector1: Vector, vector2: Vector, t: number): Vector {
    return vector1.lerp(vector2, t);
  }

  /**
   * Adds two vectors together.
   *
   * @param vector1 The first vector
   * @param vector2 The second vector
   * @returns The sum of the vectors
   */
  public static add(vector1: Vector, vector2: Vector): Vector {
    return vector1.add(vector2);
  }

  /**
   * Subtracts the second vector from the first vector.
   *
   * @param vector1 The vector to subtract from
   * @param vector2 The vector to subtract
   * @returns The difference of the vectors
   */
  public static subtract(vector1: Vector, vector2: Vector): Vector {
    return vector1.subtract(vector2);
  }

  /**
   * Multiplies two vectors together (component-wise).
   *
   * @param vector1 The first vector
   * @param vector2 The second vector
   * @returns The product of the vectors
   */
  public static multiply(vector1: Vector, vector2: Vector): Vector;
  /**
   * Multiplies a vector by a scalar value.
   *
   * @param vector1 The vector to multiply
   * @param scalar The scalar value
   * @returns The scaled vector
   */
  public static multiply(vector1: Vector, scalar: number): Vector;
  public static multiply(
    vector1: Vector,
    vectorOrScalar: Vector | number,
  ): Vector {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return vector1.multiply(vectorOrScalar);
  }

  /**
   * Calculates the dot product of two vectors.
   *
   * @param vector1 The first vector
   * @param vector2 The second vector
   * @returns The dot product (scalar value)
   */
  public static dotProduce(vector1: Vector, vector2: Vector): number {
    return vector1.dotProduct(vector2);
  }

  /**
   * Calculates the cross product of two vectors.
   *
   * @param vector1 The first vector
   * @param vector2 The second vector
   * @returns A new vector representing the cross product
   */
  public static crossProduct(vector1: Vector, vector2: Vector): Vector {
    return vector1.crossProduct(vector2);
  }

  /**
   * Calculates the distance between two vectors.
   *
   * @param vector1 The first vector
   * @param vector2 The second vector
   * @returns The distance between the vectors
   */
  public static distance(vector1: Vector, vector2: Vector): number {
    return vector1.distance(vector2);
  }

  /**
   * Creates a 2D vector from an angle and magnitude.
   *
   * @param angleInRadians The angle in radians
   * @param magnitude The magnitude (defaults to 1)
   * @returns A new vector pointing in the specified direction
   */
  public static fromAngle(angleInRadians: number, magnitude = 1): Vector {
    return new Vector(
      magnitude * Math.cos(angleInRadians),
      magnitude * Math.sin(angleInRadians),
      0,
    );
  }

  /**
   * Creates a vector from an array of components.
   *
   * @param arrayOfComponents Array containing [x, y] or [x, y, z] components
   * @returns A new vector with the specified components
   */
  public static fromArray(
    arrayOfComponents: [number, number, number] | [number, number],
  ): Vector {
    return new Vector(
      arrayOfComponents[0],
      arrayOfComponents[1],
      arrayOfComponents[2] ?? 0,
    );
  }
}
