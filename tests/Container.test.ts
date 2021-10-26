import { Container } from "../src/Container";
import { MissingChildContainerError, MissingDependencyError } from "../src/Errors";
import { Context } from "./mocks/Context";
import { Kunoichi, Ninja } from "./mocks/Providers/Ninja";
import { Viking } from "./mocks/Providers/Viking";
import { Village } from "./mocks/Providers/Village";
import { Tokens } from "./mocks/Tokens";

describe("Container", () => {
  describe("when .where() method is used", () => {
    const contextA: Context = { foo: "a" };
    const contextB: Context = { foo: "b" };

    let container: Container<Tokens, Context>;

    beforeEach(() => {
      container = new Container<Tokens, Context>();
      container.where(contextA);
      container.where(contextB);
    });

    it("should add a sub container when context is provided", () => {
      expect(container.container.get(contextA)).toBeDefined();
      expect(container.container.get(contextB)).toBeDefined();
      expect(container.container.get({ foo: "c" })).toBeUndefined();
    });

    it("should add a encapsulated dependency to a sub container", () => {
      container.where((c) => c.foo === "a").set("ninja", Ninja);
      container.where((c) => c.foo === "b").set("ninja", Kunoichi);

      expect(
        container
          .where((c) => c.foo === "a")
          .get("ninja")
          .attack()
      ).toEqual("slice");

      expect(
        container
          .where((c) => c.foo === "b")
          .get("ninja")
          .attack()
      ).toEqual("dice");
    });

    it("should throw error when sub container does not exist", () => {
      expect(() => {
        container.where((c) => c.foo === "c");
      }).toThrow(new MissingChildContainerError());
    });

    it("should throw error when sub container does not have a registered dependency", () => {
      expect(() => {
        container.where((c) => c.foo === "a").get("ninja");
      }).toThrow(new MissingDependencyError("ninja"));
    });
  });

  describe("when .has() method is used", () => {
    const container = new Container<Tokens>();

    beforeAll(() => {
      container.set("ninja", Ninja);
    });

    it("should return true for registered dependencies", () => {
      expect(container.has("ninja")).toBeTruthy();
    });

    it("should return false for unregistered dependencies", () => {
      expect(container.has("viking")).toBeFalsy();
    });
  });

  describe("when .set() method is used", () => {
    const container = new Container<Tokens>();

    it("should set new dependency", () => {
      expect(container.set("ninja", Ninja).has("ninja")).toBeTruthy();
    });
  });

  describe("when .get() method is used", () => {
    const container = new Container<Tokens>();

    beforeAll(() => {
      container.set("ninja", Ninja);
      container.set("viking", Viking);
      container.set("village", Village);
    });

    it("should resolve correct warrior instances", () => {
      expect(container.get("ninja")).toBeInstanceOf(Ninja);
      expect(container.get("viking")).toBeInstanceOf(Viking);
    });

    it("should resolve correct fight results", () => {
      expect(container.get("ninja").attack()).toEqual("slice");
      expect(container.get("viking").attack()).toEqual("chop");
    });

    it("should resolve a transient provider with correct arguments", () => {
      expect(container.get("village", "scandinavia").origin).toEqual("scandinavia");
    });
  });
});
