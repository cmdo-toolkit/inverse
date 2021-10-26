import { MissingChildContainerError, MissingDependencyError } from "./Errors";
import { Constructor, ConstructorArgs, Filter, JSON, Tokens } from "./Types";

/**
 * A simple dependency injection service using inversion of control principles
 * allowing the developer to program against TypeScript types or interfaces
 * with implementation details injected by service providers.
 *
 * @author  Christoffer Rødvik <dev@kodemon.net>
 * @license MIT
 */
export class Container<T extends Tokens, C extends JSON = JSON> {
  public readonly providers: Map<keyof T, unknown> = new Map();
  public readonly container: Map<C, Container<T, C>> = new Map();

  /**
   * Create or retrieve a container based on a specific sub context.
   */
  public where(context: C): Container<T, C>;
  public where(filter: Filter<C>): Container<T, C>;
  public where(contextOrFilter: C | Filter<C>): Container<T, C> {
    if (typeof contextOrFilter === "function") {
      for (const context of Array.from(this.container.keys())) {
        if (contextOrFilter(context)) {
          return this.container.get(context) as Container<T, C>;
        }
      }
      throw new MissingChildContainerError();
    }
    return this.container.set(contextOrFilter, new Container<T, C>()).get(contextOrFilter) as Container<T, C>;
  }

  /**
   * Check if a token has been registered in the singleton or transient map
   * of the container.
   *
   * @param token - Token to verify.
   */
  public has<K extends keyof T>(token: K): boolean {
    return this.providers.has(token);
  }

  /**
   * Register a transient or singleton provider against the provided token.
   *
   * @param token    - Token to register.
   * @param provider - Provider to register under the given token.
   */
  public set<K extends keyof T>(token: K, provider: Constructor<T[K]["type"]>): this;
  public set<K extends keyof T>(token: K, provider: T[K]["type"]): this;
  public set<K extends keyof T>(token: K, provider: Constructor<T[K]["type"]> | T[K]["type"]): this {
    this.providers.set(token, provider);
    return this;
  }

  /**
   * Get a transient or singleton provider instance.
   *
   * @param token - Token to retrieve dependency for.
   * @param args  - Arguments to pass to a transient provider.
   */
  public get<K extends keyof T>(token: K, ...args: ConstructorArgs<T[K]["ctor"]>): T[K]["type"] {
    const provider = this.providers.get(token);
    if (!provider) {
      throw new MissingDependencyError(token);
    }
    if (typeof provider === "function") {
      return new (provider as Constructor<T>)(...args);
    }
    return provider as T[K]["type"];
  }
}
