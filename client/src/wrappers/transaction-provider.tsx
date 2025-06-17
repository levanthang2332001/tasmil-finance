"use client";
import React, { createContext, useContext, useMemo, useCallback, ReactNode } from "react";
import { useToast } from "@/hooks/shared/use-toast";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-core";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptosProvider } from "./aptos-provider";
import { TransactionHash } from "@/components/transaction-hash";
import { InputViewFunctionData, MoveValue } from "@aptos-labs/ts-sdk";
import { EntryService } from "@/services/sui/entry-services";
import { ViewService } from "@/services/sui/view-services";

interface ITransactionContext {
  signAndSubmitTx: (tx: InputTransactionData, options?: TransactionOptions) => Promise<void>;
  viewTx: (tx: InputViewFunctionData, options?: TransactionOptions) => Promise<MoveValue[] | undefined>;
  entryService: EntryService;
  viewService: ViewService;
}

interface TransactionOptions {
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
  skipToast?: boolean;
  onFinally?: () => void;
}

const TransactionContext = createContext<ITransactionContext>({} as ITransactionContext);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { account, network, signAndSubmitTransaction, connected } = useWallet();

  const entryService = useMemo(() => new EntryService(), []);
  const viewService = useMemo(() => new ViewService(), []);

  const handleError = useCallback(
    (error: any, options?: TransactionOptions) => {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Transaction Error",
        description: error.message || "Have an error when wallet transaction",
      });
      options?.onError?.(error);
    },
    [toast]
  );

  const handleSuccess = useCallback(
    (title: string = "Success", hash: string, options?: TransactionOptions) => {
      toast({
        title,
        description: <TransactionHash hash={hash} network={network} />,
      });
      options?.onSuccess?.(hash);
    },
    [toast, network]
  );

  const preTransactionValidation = useCallback(() => {
    if (!account) throw new Error("Wallet not connected");
    if (!network) throw new Error("Network not selected");
    if (!connected) throw new Error("Wallet not conntected");
  }, [account, network, connected]);

  const signAndSubmitTx = useCallback(
    async (transaction: InputTransactionData, options?: TransactionOptions) => {
      try {
        // pre-check transaction
        preTransactionValidation();

        // call transtion in dapp
        const response = await signAndSubmitTransaction(transaction);

        // wait for the transaction completed successfully
        await aptosProvider.getAptos().waitForTransaction({
          transactionHash: response.hash,
        });

        // handle the toast success message
        handleSuccess(undefined, response.hash, options);
      } catch (error) {
        handleError(error, options);
      } finally {
        options?.onFinally?.();
      }
    },
    [signAndSubmitTransaction, handleError, handleSuccess, preTransactionValidation]
  );

  const viewTx = useCallback(
    async (transaction: InputViewFunctionData) => {
      try {
        // pre-check transaction
        preTransactionValidation();

        // call transtion in dapp
        const response = await aptosProvider.getAptos().view({ payload: transaction });
        return response;
      } catch (error) {
        console.error(error);
      }
    },
    [preTransactionValidation]
  );

  return (
    <TransactionContext.Provider
      value={{
        signAndSubmitTx,
        viewTx,
        entryService,
        viewService,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransaction must be used within a TransactionProvider");
  }
  return context;
};
