declare module 'pdf-poppler' {
  export interface Options {
    format: string
    out_dir: string
  }

  export function convert (
    file: string,
    options: Options
  ): Promise<void>
}
