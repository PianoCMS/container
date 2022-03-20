/**
 * Injects bindings to the class constructor
 */

// @ts-ignore: node module
import { Reflect } from "./Reflect.ts";

export function inject(value?: any) {
  function decorator(target: any, propertyKey: string): void
  function decorator(target: any): void
  function decorator(target: any, propertyKey?: string): void {
    /**
     * Consturctor injections
     */
    if (!propertyKey) {
      if (!Object.prototype.hasOwnProperty.call(target, 'inject')) {
        Object.defineProperty(target, 'inject', {
          value: {},
        })
      }

      target.inject.instance = target.inject.instance || []

      const constructorParams = Reflect.getMetadata('design:paramtypes', target)

      if (constructorParams) {
        constructorParams.forEach((param: any, index: number) => {
          if (value && value[index]) {
            target.inject.instance.push(value[index])
          } else {
            target.inject.instance.push(param)
          }
        })
      }
      return
    }

    /**
     * Parameter injections
     */
    if (!Object.prototype.hasOwnProperty.call(target, 'inject')) {
      Object.defineProperty(target.constructor, 'inject', {
        value: {},
      })
    }

    target.constructor.inject[propertyKey] = target.constructor.inject[propertyKey] || []

    const methodParams = Reflect.getMetadata('design:paramtypes', target, propertyKey)
    if (methodParams) {
      methodParams.forEach((param: any, index: number) => {
        if (value && value[index]) {
          target.constructor.inject[propertyKey].push(value[index])
        } else {
          target.constructor.inject[propertyKey].push(param)
        }
      })
    }
  }

  return decorator
}
