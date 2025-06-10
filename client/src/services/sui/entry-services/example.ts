import { InputTransactionData } from "@aptos-labs/wallet-adapter-core";
import { AptosBaseService } from "@/services/sui/base";

export class ExampleService extends AptosBaseService {
  public getExamplePayload(): InputTransactionData {
    return {
      data: {
        function: "0x1::example::example",
        typeArguments: [],
        functionArguments: [],
      },
    };
  }
}
