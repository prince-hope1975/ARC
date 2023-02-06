import { z } from "zod";
import stdlib, { setStdlibOpts } from "../utils/reach.js";
import { ZodObj } from "../ARC69.js";
import algosdk, { makeAssetConfigTxnWithSuggestedParamsFromObject, } from "algosdk";
const Config = (p = { testnet: false }) => {
    const { testnet } = p;
    setStdlibOpts(!testnet);
    const reach = stdlib();
    const Provider = async () => await reach.getProvider();
    const ARC_69_Config = async (wallet, Provider, prop) => {
        let P = Provider;
        if (!Provider) {
            P = await reach.getProvider();
        }
        // const params ;
        const { metadata, assetId } = prop;
        const _data = ZodObj.parse(metadata);
        const _assetId = z.number().min(5).parse(assetId);
        const params = await P.algodClient.getTransactionParams().do();
        const _note = _data;
        const meta = await wallet.tokenMetadata(_assetId);
        if (meta.manager !== wallet.networkAccount.addr) {
            throw Error(`Incorrect manager trying to Config Asset: ${assetId} \n
      Manager : ${meta.manager}
      Current_config_address: ${wallet.networkAccount.addr}
      `);
        }
        // encode note field to  uint8array
        const note = new Uint8Array(Buffer.from(JSON.stringify(_note)));
        const txns = makeAssetConfigTxnWithSuggestedParamsFromObject({
            assetIndex: _assetId,
            from: wallet.networkAccount.addr,
            note,
            suggestedParams: params,
            strictEmptyAddressChecking: false,
            manager: wallet.networkAccount.addr,
        });
        // const txn = makeAssetConfigTxn(
        //   wallet.networkAccount.addr,
        //   params.fee,
        //   params.firstRound,
        //   params.lastRound,
        //   note,
        //   params.genesisHash,
        //   params.genesisID,
        //   _assetId,
        //   wallet.networkAccount.addr,
        //   wallet.networkAccount.addr,
        //   wallet.networkAccount.addr,
        //   wallet.networkAccount.addr
        // );
        const rawSignedTxn = txns.signTxn(wallet.networkAccount.sk);
        let tx = await P.algodClient.sendRawTransaction(rawSignedTxn).do();
        await algosdk.waitForConfirmation(P.algodClient, tx.txId, 4);
        return;
    };
    const Bulk_ARC_69_Config = async (wallet, Provider, options) => {
        let success = [];
        let failures = [];
        const { type, jsonData = [] } = options;
        let data;
        if (type === "json") {
            if (jsonData.length > 0 && !jsonData?.[0]) {
                z.array(z.object({
                    assetId: z.number(),
                    metadata: ZodObj,
                })).parse(jsonData);
                data = jsonData;
            }
        }
        if (type === "csv") {
        }
        for (const obj of jsonData) {
            await ARC_69_Config(wallet, Provider, {
                assetId: obj.assetId,
                metadata: obj.metadata,
            })
                .then(() => {
                success = [
                    ...success,
                    {
                        assetId: obj.assetId,
                        metadata: obj.metadata,
                    },
                ];
            })
                .catch((err) => {
                console.error(err);
                failures = [
                    ...failures,
                    {
                        assetId: obj.assetId,
                        metadata: obj.metadata,
                        reason: err,
                    },
                ];
            });
        }
        console.log({
            success: JSON.stringify(success, null, 2),
            failures: JSON.stringify(failures, null, 2),
        });
    };
    return { ARC_69_Config, Bulk_ARC_69_Config };
};
export default Config;
