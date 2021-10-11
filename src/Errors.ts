export class MissingDependencyError extends Error {
  public type = "MissingDependencyError" as const;

  constructor(token: string | number | symbol) {
    super(`Dependency Violation: Attempted to resolve unregistered dependency token: ${token.toString()}`);
  }
}
