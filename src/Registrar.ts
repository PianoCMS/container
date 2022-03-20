import { dirname, resolve, isAbsolute } from 'path'
import { Exception } from '../types/index.ts';
import { Constructor } from "../types/index.ts";

/**
 * Registrar is used to register and boot the providers
 */
export class Registrar {
  /**
   * The first level of provider paths provided to the registrar
   */
  private providersPaths: string[] = []

  /**
   * An array of loaded providers. Their can be more providers than the
   * `_providersPaths` array, since each provider can provide it's
   * own sub providers
   */
  private providers: any[] = []

  /**
   * Method to instantiate provider instances. One can also defined
   * a custom instantiater function
   */
  private providersInstantiater = <T extends Constructor<any>>(provider: T) =>
    new provider(...this.providerConstructorParams)

  /**
   * Whether or not the providers can be collected
   */
  private collected = false

  constructor(private providerConstructorParams: any[], private basePath?: string) {}

  /**
   * Load the provider by requiring the file from the disk
   * and instantiate it. If ioc container is using ES6
   * imports, then default exports are handled
   * automatically.
   */
  private async loadProvider(providerPath: string, basePath?: string) {
    if(basePath === undefined) {
      basePath = Deno.cwd();
    }
    let resolvedPath:string;
    if(isAbsolute(providerPath)) {
      resolvedPath = providerPath;
    } else {
      resolvedPath = resolve(basePath, providerPath);
    }

    const provider = await import(providerPath)

    if (typeof provider.default !== 'function') {
      throw new Exception(`"${providerPath}" provider must use export default statement`)
    }

    return {
      provider: this.providersInstantiater(provider.default),
      resolvedPath: dirname(providerPath),
    }
  }

  /**
   * Loop's over an array of provider paths and pushes them to the
   * `providers` collection. This collection is later used to
   * register and boot providers
   */
  private async collect(providerPaths: string[], basePath?: string) {
    for (const providerPath of providerPaths) {
      const { provider, resolvedPath } = await this.loadProvider(providerPath, basePath)
      this.providers.push(provider)

      if (provider.provides) {
        await this.collect(provider.provides, resolvedPath)
      }
    }
  }

  /**
   * Register an array of provider paths
   */
  public useProviders(
    providersPaths: string[],
    callback?: <T extends Constructor<any>>(provider: T) => InstanceType<T>
  ): this {
    this.providersPaths = providersPaths

    if (typeof callback === 'function') {
      this.providersInstantiater = callback
    }

    return this
  }

  /**
   * Register all the providers by instantiating them and
   * calling the `register` method.
   *
   * The provider instance will be returned, which can be used
   * to boot them as well.
   */
  public async register() {
    if (this.collected) {
      return this.providers
    }

    this.collected = true
    await this.collect(this.providersPaths)

    /**
     * Register collected providers
     */
    this.providers.forEach((provider) => {
      if (typeof provider.register === 'function') {
        provider.register()
      }
    })

    return this.providers
  }

  /**
   * Boot all the providers by calling the `boot` method.
   * Boot methods are called in series.
   */
  public async boot() {
    const providers = await this.register()

    for (const provider of providers) {
      if (typeof provider.boot === 'function') {
        await provider.boot()
      }
    }
  }

  /**
   * Register an boot providers together.
   */
  public async registerAndBoot() {
    const providers = await this.register()
    await this.boot()
    return providers
  }
}
