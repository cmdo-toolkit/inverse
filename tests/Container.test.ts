import { Container } from "../src/Container";
import { Ninja } from "./mocks/Providers/Ninja";
import { Viking } from "./mocks/Providers/Viking";
import { Village } from "./mocks/Providers/Village";
import { Tokens } from "./mocks/Tokens";

describe("Container", () => {
  describe("when .has() method is run", () => {
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

  describe("when .set() method is run", () => {
    const container = new Container<Tokens>();

    it("should set new dependency", () => {
      expect(container.set("ninja", Ninja).has("ninja")).toBeTruthy();
    });
  });

  describe("when .get() method is run", () => {
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
