export interface Factory<T> {
  create: (attributes?: Partial<T>) => T | Promise<T>
}
