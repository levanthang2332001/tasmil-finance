import { aptosProvider } from "@/wrappers/aptos-provider";
import {
  Aptos,
  EntryFunctionArgumentTypes,
  MoveFunctionId,
  MoveValue,
  SimpleEntryFunctionArgumentTypes,
} from "@aptos-labs/ts-sdk";

async function View(
  aptos: Aptos,
  func_addr: MoveFunctionId,
  func_args: Array<EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes>
) {
  return aptos.view({
    payload: {
      function: func_addr,
      functionArguments: func_args,
    },
  });
}

export abstract class AptosBaseService {
  protected client: Aptos;

  constructor() {
    this.client = aptosProvider.getAptos();
  }

  public async callViewMethod(
    functionId: MoveFunctionId,
    func_args: Array<EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes>
  ): Promise<MoveValue[]> {
    return View(this.client, functionId, func_args);
  }
}
