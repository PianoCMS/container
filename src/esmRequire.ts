export function esmResolver(output: any) {
    return output && output.__esModule && output.default ? output.default : output
  }

export function esmRequire(filePath: string) {
    return esmResolver(import(filePath))
}