export class MissingChildContainerError extends Error {
  public type = "MissingChildContainerError" as const;

  constructor() {
    super("Dependency Violation: Failed to resolve unregistered sub container");
  }
}

export class MissingDependencyError extends Error {
  public type = "MissingDependencyError" as const;

  constructor(token: string | number | symbol) {
    super(`Dependency Violation: Failed to resolve unregistered dependency token: ${token.toString()}`);
  }
}
