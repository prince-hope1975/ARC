import { z } from "zod";
import { pinJSONToIPFS } from "../utils/helper/index.js";
import reach from "../utils/reach.js";
const zStr = z.string();
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
    // @ts-ignore
    const url = zStr.parse(pin?.ipfsHash);
    const tok = await reach().launchToken(wallet, _name, _symbol, {
        supply: _supply,
        decimals: 0,
        url: url + "#arc3",
        manager: wallet.networkAccount.addr,
        freeze: wallet.networkAccount.addr,
        note: new TextEncoder().encode("Test Token for Prince"),
    });
    console.log("Token deployed to", tok, reach().bigNumberToNumber(tok?.id));
};
export const ARC3ZodObj = z
    .object({
    decimals: z.number().min(0).max(18).default(0),
    image: zStr.describe("This should contain a link to the file to be displayed"),
    name: z
        .string({
        required_error: "You must specify the ARC Type eg ARC69 ARC003 etc",
    })
        .min(3)
        .describe("The token name"),
    description: zStr.describe("Should contain info about the Asset"),
    // external_url: zStr
    //   .describe("This should contain a link to an external website")
    //   .nullable(),
    image_mimetype: zStr.nullable(),
    properties: z.object({}).passthrough(),
})
    .partial({
    // mime_type: true,
    description: true,
    external_url: true,
});
export default ARC_3;
