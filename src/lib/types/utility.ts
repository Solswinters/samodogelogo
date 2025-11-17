/**
 * Comprehensive utility type definitions
 */

// Deep type utilities
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P]
}

export type DeepReadonly<T> = T extends (infer R)[]
  ? DeepReadonlyArray<R>
  : T extends (...args: unknown[]) => unknown
    ? T
    : T extends object
      ? DeepReadonlyObject<T>
      : T

type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>

type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>
}

export type DeepWriteable<T> = {
  -readonly [P in keyof T]: DeepWriteable<T[P]>
}

// Mutability utilities
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

export type Immutable<T> = {
  +readonly [P in keyof T]: T[P]
}

export type Writeable<T> = {
  -readonly [P in keyof T]: T[P]
}

// Key filtering utilities
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T]

export type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never
}[keyof T]

export type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? never : K
}[keyof T]

export type PickByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? Key : never }[keyof T]
>

export type OmitByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? never : Key }[keyof T]
>

// Require utilities
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

export type RequireExactlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, never>>
  }[Keys]

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = RequireExactlyOne<T, Keys>

// Pick/Omit utilities
export type OmitMultiple<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type PickRequired<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>

// Async/Promise utilities
export type Awaitable<T> = T | Promise<T>

export type PromiseType<T> = T extends Promise<infer U> ? U : T

export type AsyncReturnType<T extends (...args: unknown[]) => Promise<unknown>> = T extends (
  ...args: unknown[]
) => Promise<infer R>
  ? R
  : never

export type ReturnTypeAsync<T extends (...args: unknown[]) => Promise<unknown>> = AsyncReturnType<T>

// Nullable utilities
export type Nullable<T> = T | null

export type Maybe<T> = T | null | undefined

export type NonNullableType<T> = T extends null | undefined ? never : T

// Array utilities
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never

export type NonEmptyArray<T> = [T, ...T[]]

export type ReadonlyNonEmptyArray<T> = readonly [T, ...T[]]

export type UnionToArray<T> = T extends unknown ? T[] : never

// Object utilities
export type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

export type Keys<T> = (keyof T)[]

export type Values<T> = T[keyof T][]

// Union/Intersection utilities
export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

// Branded types
export type Brand<T, B> = T & { __brand: B }

// Conditional types
export type If<C extends boolean, T, F> = C extends true ? T : F

export type Equals<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false

// String utilities
export type Split<S extends string, D extends string> = S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S]

export type Join<T extends string[], D extends string> = T extends [infer F, ...infer R]
  ? R extends string[]
    ? F extends string
      ? `${F}${D}${Join<R, D>}`
      : never
    : F
  : ''
