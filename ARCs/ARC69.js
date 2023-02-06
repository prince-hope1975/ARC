import { z } from "zod";
import reach from "../utils/reach.js";
const ARC_69 = async (wallet, prop) => {
    const { name, symbol, metadata, image_url, supply = 1 } = prop;
    const _name = z.string().parse(name);
    const _symbol = z.string().parse(symbol);
    const _data = ZodObj.parse(metadata);
    const _supply = z.number().min(1).parse(supply);
    const tok = await reach().launchToken(wallet, _name, _symbol, {
        supply: _supply,
        decimals: 0,
        url: image_url,
        manager: wallet.networkAccount.addr,
        freeze: wallet.networkAccount.addr,
        note: new TextEncoder().encode(JSON.stringify(_data)),
    });
    console.log("Token deployed to", reach().bigNumberToNumber(tok?.id));
};
const zStr = z.string();
export const ZodObj = z
    .object({
    standard: z
        .string({
        required_error: "You must specify the ARC Type eg ARC69 ARC003 etc",
    })
        .min(4)
        .default("ARC69")
        .describe("The current ARC standard"),
    description: zStr.describe("Should contain info about the Asset"),
    external_url: zStr
        .describe("This should contain a link to an external website")
        .nullable(),
    media_url: zStr
        .describe("This should contain a link to the file to be displayed")
        .nullable(),
    mime_type: zStr.nullable(),
    properties: z.object({}).passthrough(),
})
    .partial({
    mime_type: true,
    description: true,
    external_url: true,
    media_url: true,
});
export default ARC_69;
