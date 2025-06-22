import type {
  InputGenerateTransactionPayloadData,
  MoveStructId,
} from '@aptos-labs/ts-sdk';

export async function lendTokensWithEchelon(
  mintType: MoveStructId,
  amount: number,
  poolAddress: string,
  fungibleAsset: boolean,
): Promise<string> {
  try {
    const FUNCTIONAL_ARGS_DATA = [poolAddress, amount];

    const COIN_STANDARD_DATA: InputGenerateTransactionPayloadData = {
      function:
        '0xc6bc659f1649553c1a3fa05d9727433dc03843baac29473c817d06d39e7621ba::scripts::supply',
      typeArguments: [mintType.toString()],
      functionArguments: FUNCTIONAL_ARGS_DATA,
    };

    const FUNGIBLE_ASSET_DATA: InputGenerateTransactionPayloadData = {
      function:
        '0xc6bc659f1649553c1a3fa05d9727433dc03843baac29473c817d06d39e7621ba::scripts::supply_fa',
      functionArguments: FUNCTIONAL_ARGS_DATA,
    };

    const response = await aptos.transaction.signAndSubmitTransaction({
      signer: account,
      transaction: fungibleAsset ? FUNGIBLE_ASSET_DATA : COIN_STANDARD_DATA,
    });

    if (!response) {
      throw new Error('Failed to lend tokens');
    }

    console.log(response.hash);
    return response.hash;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to lend tokens: ' + error);
  }
}