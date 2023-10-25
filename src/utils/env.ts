export function getEnv<T> (key: string, defaultValue?: T): T {
  const defValue = defaultValue as T
  const value = process.env[key] as T
  return value ?? defValue
}
