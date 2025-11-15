// Common type definitions

export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type Maybe<T> = T | null | undefined

export type AsyncResult<T, E = Error> = Promise<Result<T, E>>

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

export type NonEmptyArray<T> = [T, ...T[]]

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P]
}

export type ValueOf<T> = T[keyof T]

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

