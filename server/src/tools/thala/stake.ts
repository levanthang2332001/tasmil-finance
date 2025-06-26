import { Aptos, Account } from '@aptos-labs/ts-sdk';
import { getLastErrorMessage } from 'src/utils';

interface StakeResponse {
  hash: string;
}

export async function stakeTokensWithThala(
  aptos: Aptos,
  account: Account,
  amount: number,
): Promise<StakeResponse> {
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

    console.log('response: ', response);

    const tx = await aptos.waitForTransaction({
      transactionHash: response.hash,
    });

    if (!tx.success || !tx.hash) throw new Error('Failed to stake tokens');

    return {
      hash: tx.hash,
    };
  } catch (error) {
    console.error(error);
    let formattedMessage = 'An unknown error occurred while staking.';
    let txHash = '';
    let explorerUrl = '';
    let txHtml = '';
    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof (error as { message?: unknown }).message === 'string'
    ) {
      const message = (error as { message: string }).message;
      const match = message.match(
        /Transaction ([0-9a-fx]+) failed with an error: (.+)/i,
      );
      if (Array.isArray(match) && match.length >= 3) {
        txHash = match[1];
        formattedMessage = getLastErrorMessage(match[2]);
        explorerUrl = `https://explorer.aptoslabs.com/txn/${txHash}`;
        txHtml = `<a href="${explorerUrl}" target="_blank" rel="noopener noreferrer">${txHash}</a>`;
      } else {
        formattedMessage = getLastErrorMessage(message);
      }
    }
    throw new Error(`${formattedMessage} <br /> ${txHtml}`);
  }
}
