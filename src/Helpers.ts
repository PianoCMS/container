import { Exception } from '../types/index.ts';

/**
 * Returns a boolean telling if value is an esm module
 * with `export default`.
 */
export const isEsm:(value:any) => boolean = (value: any) => true;
/**
 * Returns a boolean telling if value is a primitive or object constructor.
 */
export function isPrimtiveConstructor(value: any): boolean {
  return [String, Function, Object, Date, Number, Boolean].indexOf(value) > -1
}

/**
 * Raises error with a message when callback is not
 * a function.
 */
export function ensureIsFunction(callback: (...args: any) => any, message: string) {
  if (typeof callback !== 'function') {
    throw new Exception(message, 500, 'E_RUNTIME_EXCEPTION')
  }
}
