import { Token } from "../../src/Types";
import { Ninja } from "./Providers/Ninja";
import { Viking } from "./Providers/Viking";
import { Village } from "./Providers/Village";

export type Tokens = {
  ninja: Token<{ new (): Ninja }, Ninja>;
  viking: Token<{ new (): Viking }, Viking>;
  village: Token<{ new (origin: string): Village }, Village>;
};
