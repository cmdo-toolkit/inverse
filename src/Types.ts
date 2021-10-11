export type Constructor<T> = {
  new (...args: any[]): T;
};

export type ConstructorArgs<T> = T extends new (...args: infer U) => any ? U : never;

export type Tokens = {
  [token: string]: Token;
};

export type Token<C = unknown, T = unknown> = {
  ctor: C;
  type: T;
};
