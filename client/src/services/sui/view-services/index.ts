// import { UiPoolDataProviderService } from "@/services/sui/view-services/ui-pool-data-provider";
import { ExampleService } from "@/services/sui/view-services/example";

export class ViewService {
  private example: ExampleService;

  constructor() {
    this.example = new ExampleService();
  }

  public getExample(): ExampleService {
    return this.example;
  }
}
