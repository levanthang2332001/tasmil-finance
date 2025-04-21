import { createNetworkConfig } from "@mysten/dapp-kit";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { getContractConfig } from "./config";

type Network = 'mainnet' | 'testnet';

const network = (process.env.NEXT_PUBLIC_NETWORK as Network) || 'testnet';

const { networkConfig, useNetworkVariables } = createNetworkConfig({
    testnet: {
        url: getFullnodeUrl('testnet'),
        variables: getContractConfig('testnet'),
    },
    mainnet: {
        url: getFullnodeUrl('mainnet'),
        variables: getContractConfig('mainnet'),
    }
})

const suiClient = new SuiClient({ url: getFullnodeUrl(network)})

export { suiClient, networkConfig, useNetworkVariables, network }
