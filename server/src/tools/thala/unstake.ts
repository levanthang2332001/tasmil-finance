import { Aptos, Account } from '@aptos-labs/ts-sdk';

interface UnstakeResponse {
  hash: string;
}

export async function unstakeTokensWithThala(
  aptos: Aptos,
  account: Account,
  amount: number,
): Promise<UnstakeResponse> {
  try {
    const transaction = await aptos.transaction.build.simple({
      sender: account.accountAddress,
      data: {
        function:
          '0xfaf4e633ae9eb31366c9ca24214231760926576c7b625313b3688b5e900731f6::scripts::unstake_thAPT',
        functionArguments: [amount],
      },
    });

    const response = await aptos.transaction.signAndSubmitTransaction({
      signer: account,
      transaction,
    });

    const tx = await aptos.waitForTransaction({
      transactionHash: response.hash,
    });

    if (!tx.success || !tx.hash) {
      throw new Error('Failed to unstake tokens');
    }

    console.log('tx: ', tx.hash, tx.success);

    return {
      hash: tx.hash,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to unstake tokens: ' + error);
  }
}
