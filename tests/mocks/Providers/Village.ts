import { VillageService } from "../Services/Village";

export class Village implements VillageService {
  constructor(public origin: string) {}
}
