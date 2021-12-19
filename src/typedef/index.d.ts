/** Removes types from `T` that are assignable to `U`. */
export type Diff<T, U> = Exclude<T, U>;

/** Removes types from `T` that are not assignable to `U`. */
export type Filter<T, U> = Extract<T, U>;

/** To be or not to be... */
export type Maybe<T> = T | void;

export type Optional<T> = T | undefined;
export type Nullable<T> = Optional<T> | null;

// eslint-disable-next-line @typescript-eslint/ban-types
export type EmptyIntersectionObject = {};

export type ObjectKeys = string | number | symbol;

export type AnyObject = Record<ObjectKeys, unknown>;
export type EmptyObject = Record<ObjectKeys, never>;

/**
 * Like `T & U`, but using the value types from `U` where their properties overlap.
 */
export type Overwrite<T, U> = Omit<T, keyof U> & U;

/**
 * Helps create a type where at least one of the properties of an interface is required to exist.
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Diff<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Diff<Keys, K>>>;
  }[Keys];

/**
 * Helps create a type where only one of the properties of an interface is required to exist.
 */
export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Diff<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Diff<Keys, K>, undefined>>;
  }[Keys];

type GenerateStringUnion<T> = Filter<
  {
    [Key in keyof T]: true extends T[Key] ? Key : never;
  }[keyof T],
  string
>;

/**
 * Generate a set of string literal types with the given default record `T` and
 * override record `U`.
 *
 * If the property value was `true`, the property key will be added to the
 * string union.
 */
export type OverridableStringUnion<
  T,
  U = EmptyIntersectionObject
> = GenerateStringUnion<Overwrite<T, U>>;
