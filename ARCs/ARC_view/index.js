/** Attribute following Open Sea's attributes format (https://docs.opensea.io/docs/metadata-standards#attributes). */
/** Fetches and parses ARC69 metadata for Algorand NFTs. */
const FetchAsset = () => {
    const algoExplorerApiBaseUrlMainnet = "https://algoindexer.algoexplorerapi.io";
    const algoExplorerApiBaseUrlTestnet = "https://algoindexer.testnet.algoexplorerapi.io/";
    async function fetchARC69AssetData(assetId, options) {
        // Fetch `acfg` transactions.
        const { testnet: isTestnet } = options || { testnet: false };
        const url = `${isTestnet ? algoExplorerApiBaseUrlTestnet : algoExplorerApiBaseUrlMainnet}/v2/transactions?asset-id=${assetId}&tx-type=acfg`;
        let transactions;
        try {
            transactions = (await fetch(url).then((res) => res.json())).transactions;
        }
        catch (err) {
            console.error(err);
            return null;
        }
        // Sort the most recent `acfg` transactions first.
        transactions.sort((a, b) => b["round-time"] - a["round-time"]);
        // console.log("sorting...");
        // Attempt to parse each `acf` transaction's note for ARC69 metadata.
        for (const transaction of transactions) {
            try {
                const noteBase64 = transaction.note;
                const note = Buffer.from(noteBase64, "base64").toString("utf8");
                const noteString = note.trim().replace(/[^ -~]+/g, "");
                const noteObject = JSON.parse(noteString);
                if (noteObject.standard.toLocaleLowerCase() === "arc69".toLocaleLowerCase()) {
                    return noteObject;
                }
            }
            catch (err) {
                console.error(err);
                // Oh well...
            }
        }
        return null;
    }
    async function fetchARC3AssetData(assetId, options) {
        // Fetch `acfg` transactions.
        const { testnet: isTestnet } = options || { testnet: false };
        const url = `${isTestnet ? algoExplorerApiBaseUrlTestnet : algoExplorerApiBaseUrlMainnet}/v2/transactions?asset-id=${assetId}&tx-type=acfg`;
        let transactions;
        try {
            transactions = (await fetch(url).then((res) => res.json())).transactions;
        }
        catch (err) {
            console.error(err);
            return null;
        }
        // Sort the most recent `acfg` transactions first.
        transactions.sort((a, b) => b["round-time"] - a["round-time"]);
        // Attempt to parse each `acf` transaction's note for ARC69 metadata.
        for (const transaction of transactions) {
            try {
                const possibleIpfsURL = transaction["asset-config-transaction"].params.url;
                const json = await getJsonFromUrl(possibleIpfsURL);
                return json;
            }
            catch (err) {
                console.error(err);
                // Oh well...
            }
        }
        return null;
    }
    async function getJsonFromUrl(url) {
        const isIpfsString = url.startsWith("ipfs://");
        if (isIpfsString) {
            const ipfsHash = url.replace("ipfs://", "");
            const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
            const ipfsRes = await fetch(ipfsUrl);
            const ipfsJson = await ipfsRes.json();
            return ipfsJson;
        }
    }
    return {
        fetchARC3AssetData,
        fetchARC69AssetData,
        getJsonFromUrl,
    };
};
export default FetchAsset;
