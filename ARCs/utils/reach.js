import { loadStdlib } from "@reach-sh/stdlib";
export let stdlibOpts = false;
export const setStdlibOpts = (bool) => {
    stdlibOpts = bool;
};
const reachTestnet = loadStdlib(process.env.REACH_CONNECTOR_MODE);
reachTestnet.setProviderByName("TestNet");
const reachMainnet = loadStdlib(process.env.REACH_CONNECTOR_MODE);
reachMainnet.setProviderByName("MainNet");
const reach = () => (stdlibOpts ? reachMainnet : reachTestnet);
export default reach;
