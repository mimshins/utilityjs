/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type KeyofBase = keyof any;

export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | undefined
  | null;

export type IsTuple<T> = T extends any[]
  ? any[] extends T
    ? never
    : T
  : never;

export type ReadonlyArrayOrSingle<T> = T | readonly T[];

export type Diff<U1 extends any, U2 extends any> =
  | Exclude<U1, U2>
  | Exclude<U2, U1>;

/** Removes types from `T` that are not assignable to `U`. */
export type Filter<T, U> = Extract<T, U>;

export type Nil = null | undefined;

export type Nilable<T> = T | Nil;
export type Nullable<T> = T | null;
export type Undefinable<T> = T | undefined;

export type MaybeNil<T> = T | Nil;
export type MaybeNull<T> = T | null;
export type MaybeUndefined<T> = T | undefined;
export type MaybePromise<T> = T | Promise<T>;
export type MaybeArray<T> = T | T[];
export type MaybeAsReturnType<T> = T | ((...args: any) => T);

/** Removes both null or undefined from T */
export type NonNil<T> = T extends nil ? never : T;

/** Removes null from T */
export type NonNull<T> = T extends null ? never : T;

/** Removes undefined from T */
export type NonUndefined<T> = T extends undefined ? never : T;

/** To be or not to be... */
export type Maybe<T> = T | void;

/** Make readonly object writable */
export type Writable<T> = { -readonly [P in keyof T]: T[P] };

export type IsNonNil<T> = null extends T
  ? never
  : undefined extends T
  ? never
  : T;
export type IsNilable<T> = null extends T
  ? True
  : undefined extends T
  ? True
  : False;
export type IsNonNull<T> = null extends T ? never : T;
export type IsNullable<T> = null extends T ? T : never;
export type IsNonUndefined<T> = undefined extends T ? never : T;
export type IsUndefinedable<T> = undefined extends T ? T : never;

type EmptyObjectNotation = {};

export type AnyFunction = (...args: any) => any;

export type AnyConstructor = new (...args: any) => any;

export interface AnyClass {
  prototype: any;
  new (...args: any): any;
}

export type List<A = any> = ReadonlyArray<A>;

export type ObjectKeys = string | number | symbol;

export type AnyObject = Record<ObjectKeys, unknown>;
export type EmptyObject = Record<ObjectKeys, never>;
export type AnyRecord<T = any> = Record<ObjectKeys, T>;

export type Function<P extends List = any, R extends any = any> = (
  ...args: P
) => R;

type DiffObjects<T, U> = Omit<T, keyof U>;

export type UnionObjects<
  T extends AnyRecord,
  U extends AnyRecord
> = DiffObjects<T, U> &
  { [P in keyof T & keyof U]: T[P] | U[P] } &
  DiffObjects<U, T>;

/**
 * Like `T & U`, but using the value types from `U` where their properties overlap.
 */
export type Overwrite<T, U> = DiffObjects<T, U> & U;

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
  U = EmptyObjectNotation
> = GenerateStringUnion<Overwrite<T, U>>;

export type PickKeysByValue<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/** Omit all properties of given type in object type */
export type OmitProperties<T, P> = Omit<T, PickKeysByValue<T, P>>;

/** Pick all properties of given type in object type */
export type PickProperties<T, P> = Pick<T, PickKeysByValue<T, P>>;

/** Gets keys of an object which are optional */
export type OptionalKeys<T> = T extends unknown
  ? {
      [K in keyof T]-?: undefined extends { [K2 in keyof T]: K2 }[K]
        ? K
        : never;
    }[keyof T]
  : never;

/** Gets keys of an object which are required */
export type RequiredKeys<T> = T extends unknown
  ? Exclude<keyof T, OptionalKeys<T>>
  : never;

/** Gets keys of properties of given type in object type */
export type PickKeys<T, P> = Exclude<keyof PickProperties<T, P>, undefined>;

/** Remove keys with `never` value from object type */
export type NonNever<T extends EmptyObjectNotation> = Pick<
  T,
  { [K in keyof T]: T[K] extends never ? never : K }[keyof T]
>;

export type NonEmptyObject<T extends AnyRecord> = keyof T extends never
  ? never
  : T;

/** Mark some properties as required, leaving others unchanged */
export type MarkRequired<T, RK extends keyof T> = T extends T
  ? Omit<T, RK> & Required<Pick<T, RK>>
  : never;

/** Mark some properties as optional, leaving others unchanged */
export type MarkOptional<T, K extends keyof T> = T extends T
  ? Omit<T, K> & Partial<Pick<T, K>>
  : never;

/** Mark some properties as readonly, leaving others unchanged */
export type MarkReadonly<T, K extends keyof T> = T extends T
  ? Omit<T, K> & Readonly<Pick<T, K>>
  : never;

/** Mark some properties as writable, leaving others unchanged */
export type MarkWritable<T, K extends keyof T> = T extends T
  ? Omit<T, K> & Writable<Pick<T, K>>
  : never;

export type StringLiteral<T> = T extends string
  ? string extends T
    ? never
    : T
  : never;

/** Gets in `O` the type of a field of key `K` */
export type At<O extends any, K extends ObjectKeys> = O extends List
  ? number extends O["length"]
    ? K extends number | `${number}`
      ? O[never] | undefined
      : undefined
    : K extends keyof O
    ? O[K]
    : undefined
  : unknown extends O
  ? unknown
  : K extends keyof O
  ? O[K]
  : undefined;

/** Explains to TS which function parameter has priority for generic inference */
export type NoInfer<A extends any> = [A][A extends any ? 0 : never];

export type Promisify<F extends Function> = (
  ...args: Parameters<F>
) => Promise<ReturnType<F>>;
