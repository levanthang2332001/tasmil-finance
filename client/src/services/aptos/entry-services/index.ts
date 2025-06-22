import { ExampleService } from "@/services/aptos/entry-services/example";

export class EntryService {
  private readonly example: ExampleService;

  constructor() {
    this.example = new ExampleService();
  }

  getExample(): ExampleService {
    return this.example;
  }
}
