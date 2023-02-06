import dotenv from "dotenv";
import { Provider, wallet } from "./ARCs/type.js";
import { loadStdlib } from "@reach-sh/stdlib";
import { createReadStream, readFileSync } from "fs";
import { pinFileToIPFS } from "./ARCs/utils/helper/index.js";

/**
 * SDK
 */
import { FetchAsset, Mint, Config } from "./ARCs/index.js";
/**
 * SDK
 */

const reach = loadStdlib("ALGO");
reach.setProviderByName("TestNet");
dotenv.config();

const wallet: wallet = await reach.newAccountFromMnemonic(
  process?.env?.MNEMONIC_ESCROW || ""
);
const assetId = 157503707;
const arc3AssetId = 98604220;

const Provider: Provider = await reach.getProvider();

/**
 *
 * ?FETCH ASSETS
 */

const { fetchARC3AssetData, fetchARC69AssetData } = FetchAsset();

// const arc69Data = await fetchARC69AssetData(assetId, {
//   testnet: true,
// });
// const arc3Data = await fetchARC3AssetData(arc3AssetId, {
//   testnet: true,
// });

// console.log({ arc69Data, arc3Data });

/**
 * !End
 */

/**
 *
 * !MINT BLOCK
 */

const { ARC_3, ARC_69 } = Mint({ testnet: true });

/**
 *
 * ?ARC69 mint
 */

// const file = await pinFileToIPFS("img.jpg").catch((err) => {
//   console.error(err);
//   process.exit(0);
// });

// await ARC_69(wallet, {
//   name: "GREENHOUSE TOKEN",
//   symbol: "GHT",
//   image_url: file?.IpfsHash || "",
//   metadata: {
//     standard: "arc69",
//     description: "Green house NFT",
//     properties: {
//       color: "Green",
//       shirt: "red",
//     },
//   },
// });

// await ARC_3(wallet, {
//   symbol: "GHT",
//   name: "GREENHOUSE TOKEN",
//   metadata: {
//     decimals: 1,
//     image: file?.IpfsHash || "",
//     name: "GREENHOUSE TOKEN",
//     image_mimetype: "image/*",
//     description: "Green house NFT",
//     properties: {
//       color: "Green",
//       shirt: "red",
//     },
//   },
// });

/**
 * !End
 */

/**
 *
 * ?CONFIG BLOCK
 */
const { Bulk_ARC_69_Config, ARC_69_Config } = Config({ testnet: true });

/**
 *
 * ?Single Config
 */

// const before = await fetchARC69AssetData(assetId, {
//   testnet: true,
// });

// await ARC_69_Config(wallet, Provider, {
//   assetId,
//   metadata: {
//     standard: "arc69",
//     properties: {
//       race: "African",
//       color: "Yellow",
//     },
//     media_url: "https://google.com",
//     description: "Nothing Wrong with this config",
//   },
// });

// const after = await fetchARC69AssetData(assetId, {
//   testnet: true,
// });

// console.log({ before, after });

/**
 *
 * - - - - - - - - - End
 */

/**
 *
 * ?Bulk Config
 */

const file = readFileSync("configureData.json").toString();

const jsonData = JSON.parse(file);

await Bulk_ARC_69_Config(wallet, Provider, {
  type: "json",
  jsonData,
});

/**
 *
 * !END
 */
