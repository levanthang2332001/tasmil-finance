import { Aptos, Account } from '@aptos-labs/ts-sdk';

export async function stakeTokensWithThala(
  aptos: Aptos,
  account: Account,
  amount: number,
): Promise<string> {
  try {
    const transaction = await aptos.transaction.build.simple({
      sender: account.accountAddress,
      data: {
        function:
          '0xfaf4e633ae9eb31366c9ca24214231760926576c7b625313b3688b5e900731f6::scripts::stake_APT_and_thAPT',
        functionArguments: [amount],
      },
    });

    const response = await aptos.transaction.signAndSubmitTransaction({
      signer: account,
      transaction,
    });

    if (!response) {
      throw new Error('Failed to stake tokens');
    }

    return response.hash;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to stake tokens: ' + error);
  }
}
