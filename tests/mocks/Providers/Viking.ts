import { WarriorService } from "../Services/Warrior";

export class Viking implements WarriorService {
  public attack() {
    return "chop";
  }
}
