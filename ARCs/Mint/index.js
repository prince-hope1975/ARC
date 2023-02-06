import { z } from "zod";
import stdlib, { setStdlibOpts } from "../utils/reach.js";
import { ZodObj } from "../ARC69.js";
import { ARC3ZodObj } from "../Arc3.js";
import { pinJSONToIPFS } from "../utils/helper/index.js";
const Mint = ({ testnet }) => {
    setStdlibOpts(!testnet);
    const reach = stdlib();
    const ARC_69 = async (wallet, prop) => {
        const { name, symbol, metadata, image_url, supply = 1 } = prop;
        const _name = z.string().parse(name);
        const _symbol = z.string().parse(symbol);
        const _data = ZodObj.parse(metadata);
        const _supply = z.number().min(1).parse(supply);
        const tok = await reach.launchToken(wallet, _name, _symbol, {
            supply: _supply,
            decimals: 0,
            url: image_url,
            manager: wallet.networkAccount.addr,
            freeze: wallet.networkAccount.addr,
            note: new TextEncoder().encode(JSON.stringify(_data)),
        });
        console.log("Token deployed to", reach.bigNumberToNumber(tok?.id));
    };
    const ARC_3 = async (wallet, prop) => {
        const { name, symbol, metadata, supply = 1 } = prop;
        const _name = z.string().parse(name);
        const _symbol = z.string().parse(symbol);
        const _data = ARC3ZodObj.parse(metadata);
        const _supply = z.number().min(1).parse(supply);
        // Todo Uncomment this
        const pin = await pinJSONToIPFS(_data);
        console.log({ pin });
        // Todo Uncomment this
        // const wallet = await reach.newAccountFromMnemonic(process?.env?.SEED || "");
        const url = z.string().parse(pin?.ipfsHash);
        const tok = await reach.launchToken(wallet, _name, _symbol, {
            supply: _supply,
            decimals: 0,
            url: url + "#arc3",
            manager: wallet.networkAccount.addr,
            freeze: wallet.networkAccount.addr,
            note: new TextEncoder().encode("Test Token for Prince"),
        });
        console.log("Token deployed to", tok, reach.bigNumberToNumber(tok?.id));
    };
    const log = async () => {
        return { testnet, reach: await reach.getProvider() };
    };
    return { ARC_3, ARC_69, log };
};
export default Mint;
