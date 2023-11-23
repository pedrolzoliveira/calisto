export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

export type GenericJson = Record<string, JsonValue>
