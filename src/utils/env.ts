export function getEnv<T> (key: string): T {
  return process.env[key] as T
}
