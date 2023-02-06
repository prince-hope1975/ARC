import algosdk, { BaseHTTPClient, Transaction } from "algosdk";
import { WalletTransaction } from "@randlabs/myalgo-connect";
import { ZodObj } from "./ARC69";
import { z } from "zod";

export interface wallet {
  contract(...arg: any): any;
  tokenMetadata(...arg: any): Promise<tokenMetadata>;
  getAddress(): Promise<string>;
  balanceOf(...arg: any): Promise<{ _hex: string; _isBigNumber: true }>;
  networkAccount: {
    addr: string;
    sk:Uint8Array
  };
  tokenAccepted: (tok: string | number) => Promise<boolean>;
  tokenAccept: (tok: string | number) => Promise<any>;
}
interface tokenMetadata {
  clawback: string;
  creator: string;
  decimals: { _hex: string; _isBigNumber: true } | number;
  defaultFrozen: boolean;
  freeze: string;
  manager: string;
  metadata: any;
  name: string;
  reserve: string;
  supply: { _hex: string; _isBigNumber: true } | number;
  symbol: string;
  url: string;
}

interface BasicProvider {
  algod_bc: BaseHTTPClient;
  indexer_bc: BaseHTTPClient;
  algodClient: algosdk.Algodv2;
  indexer: algosdk.Indexer;
}
export interface Provider extends BasicProvider {
  nodeWriteOnly: boolean;
  getDefaultAddress: () => Promise<string>;
  isIsolatedNetwork: boolean;
  signAndPostTxns: (
    txns: WalletTransaction[],
    opts?: object
  ) => Promise<unknown>;
}


export type jsonData = Array<{
  assetId: number;
  metadata: z.infer<typeof ZodObj>;
}>;