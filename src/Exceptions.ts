import { Exception } from '../types/index.ts';

/**
 * Raised when unable to lookup a namespace
 */
export class IocLookupException extends Exception {
  public static lookupFailed(namespace: string) {
    return new this(
      `Cannot resolve "${namespace}" namespace from the IoC Container`,
      500,
      'E_IOC_LOOKUP_FAILED'
    )
  }

  /**
   * Invalid namespace type
   */
  public static invalidNamespace() {
    return new this(
      '"Ioc.lookup" accepts a namespace string or a lookup node',
      500,
      'E_INVALID_IOC_NAMESPACE'
    )
  }

  /**
   * Fake is missing and yet resolved
   */
  public static missingFake(namespace: string) {
    return new this(`Cannot resolve fake for "${namespace}" namespace`, 500, 'E_MISSING_IOC_FAKE')
  }
}

export class InvalidInjectionException extends Exception {
  public static invoke(value: any, parentName: string, index: number) {
    const primitiveName = `{${value.name} Constructor}`
    return new this(
      `Cannot inject "${primitiveName}" to "${parentName}" at position "${index + 1}"`
    )
  }
}

