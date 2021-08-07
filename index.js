const {default: axios} = require("axios");
const apikey = "Dr4IsuWSqqvtEsstHC6AdiF7cG7ZeMOSOYxRS0V233Ae215pURElvv3B2FvZJnPv";
const baseURL = "https://deep-index.moralis.io/api";

/**
 * Get all Nfts given address
 * @param {*} address 
 * @returns 
 */
async function getAllNfts(address) {
    const endpoint = `/nft/wallet/${address}`;
    const response = await axios.get(endpoint, {
        baseURL,
        params: {
            chain: "eth",
            chain_name: "mainnet",
            format: "decimal",
            direction: "both",
        },
        headers: {
            "X-API-Key": apikey
        }
    });
    if(response.status !== 200) {
        return { error: response.statusText };
    }
    return { data: response.data.result };
}

/**
 * Run the script
 */
async function main() {
    const testAddress = "0x10ccd4136471c7c266a9fc4569622989fb4cab99";
    const nfts = await getAllNfts(testAddress);
    console.log("nfts: " + JSON.stringify(nfts.data, null, 2));
    console.log("number of nfts: " + nfts.data.length);
}

main().catch((err) => {
    console.log('err: ' + err);
})
