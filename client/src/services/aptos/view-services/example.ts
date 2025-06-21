import { AptosBaseService } from "../base";

export class ExampleService extends AptosBaseService {
  public async getReservesData(): Promise<boolean> {
    const resp = await this.callViewMethod("0x1::example::get_reserves_data", []);
    console.log(resp);
    return true;
  }
}
