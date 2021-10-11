import { WarriorService } from "../Services/Warrior";

export class Ninja implements WarriorService {
  public attack() {
    return "slice";
  }
}
