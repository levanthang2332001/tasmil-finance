// import path from "path";
// import dotenv from "dotenv";

// Load .env file first - place at the beginning of file
// const envPath = path.resolve(__dirname, "../../../.env");
// dotenv.config({ path: envPath });

import { Network, Aptos, AptosConfig } from "@aptos-labs/ts-sdk";

// Log for debugging
// console.log("ENV variables after loading:", {
//   APTOS_NETWORK: process.env.APTOS_NETWORK,
//   NODE_ENV: process.env.NODE_ENV,
//   POOL_MANAGER_ACCOUNT_ADDRESS: process.env.POOL_MANAGER_ACCOUNT_ADDRESS,
//   PWD: process.cwd(),
//   ENV_PATH: envPath
// });

class AptosProvider {
  private readonly network: Network;
  private readonly aptos: Aptos;

  constructor() {
    // if (!process.env.APTOS_NETWORK) {
    //   throw new Error("Missing APTOS_NETWORK in .env file. Eg: APTOS_NETWORK=testnet");
    // }
    // Use NEXT_PUBLIC_ prefix
    const networkName = process.env.NEXT_PUBLIC_APTOS_NETWORK;

    if (!networkName) {
      console.error("Current env:", {
        network: process.env.NEXT_PUBLIC_APTOS_NETWORK,
        nodeEnv: process.env.NODE_ENV,
        poolManager: process.env.NEXT_PUBLIC_POOL_MANAGER_ACCOUNT_ADDRESS,
      });
      throw new Error("Missing NEXT_PUBLIC_APTOS_NETWORK in environment variables");
    }

    // check APTOS_NETWORK
    switch (networkName.toLowerCase()) {
      case "testnet": {
        this.network = Network.TESTNET;
        break;
      }
      case "devnet": {
        this.network = Network.DEVNET;
        break;
      }
      case "mainnet": {
        this.network = Network.MAINNET;
        break;
      }
      case "local": {
        this.network = Network.LOCAL;
        break;
      }
      default:
        throw new Error(`Unknown network ${process.env.APTOS_NETWORK ? process.env.APTOS_NETWORK : "undefined"}`);
    }

    // declare aptos
    const config = new AptosConfig({ network: this.network });
    this.aptos = new Aptos(config);
  }

  public isSendableNetwork(connected: boolean, networkName?: string): boolean {
    return connected && !this.isMainnet(connected, networkName);
  }

  public isMainnet(connected: boolean, networkName?: string): boolean {
    return connected && networkName === Network.MAINNET;
  }

  public getAptos(): Aptos {
    return this.aptos;
  }

  public getNetwork(): Network {
    return this.network;
  }
}

export const aptosProvider = new AptosProvider();
