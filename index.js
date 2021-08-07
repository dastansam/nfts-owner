const {default: axios} = require("axios");
const Contract = require("web3-eth-contract");
const apikey = "3DUZ4XUB4PXHDBUEC183HEM84INP6BJP6I";
const baseURL = "https://api.etherscan.io";

/**
 * Get transfer events for the given address
 * @param {*} address 
 * @returns list of 
 */
async function getTransferEvents(address) {
    const response = await axios.get('/api', {
        baseURL,
        params: {
            module: "account",
            action: "tokennfttx",
            address,
            startBlock: 0,
            endBlock: 999999999,
            sort: 'asc',
            apikey
        }
    });
    if(response.status !== 200) {
        return { error: response.statusText }
    }
    return { data: response.data.result };
}
/**
 * Get unique NFT token info from list of transfer events
 * @param {*} events 
 * @returns list of Nfts in format { tokenId, contractAddress, tokenName}
 */
function getUniqueNfts(events) {
    let tokenIds = [];
    let uniqueNfts = [];
    events.forEach((event, i) => {
        if(!tokenIds.includes(event.tokenID)) {
            // console.log("tokenId: " + event.tokenID);
            tokenIds.push(event.tokenID);
            uniqueNfts.push({
                tokenID: event.tokenID,
                contractAddress: event.contractAddress,
                tokenName: event.tokenName,
            });
        }
    });
    return uniqueNfts;
}

/**
 * Check if address owns given nft
 * @param {*} contractAddress - address for the contract
 * @param {*} address - wallet address, string
 * @param {*} nft - Nft info object in format { tokenId, contractAddress, tokenName}
 */
async function checkOwns(contractAddress, address, nftId) {
    let abiRequest = await getContractAbi(address);
    let contractAbi = {};
    if (abiRequest.error) {
        contractAbi = JSON.parse(abiRequest.data);
    }
    else {
        contractAbi = require("./default_abi.json").abi;
    }
    Contract.setProvider("https://mainnet.infura.io/v3/bfa70a4ec6eb4a69bdd3866b685abfeb");
    const contract = new Contract(contractAbi, contractAddress);
    
    const actualOwner = await contract.methods.ownerOf(nftId).call();
    return { value: actualOwner.toLowerCase() === address };
}

/**
 * Gets Abi of the contract given address
 * @param {*} address
 * @returns 
 */
async function getContractAbi(address) {
    const response = await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${key}`)
    if (response.status !== 200) {
        return { error: response.statusText };
    }
    return { data: response.data.result };
}

/**
 * Get all owned Nfts from the transfer events
 * @param {*} address 
 * @returns list of owned Nfts in format - { tokenId, contractAddress, tokenName}
 */
async function getOwnedNfts(address) {
    const transferEvents = await getTransferEvents(address);
    if(transferEvents.error) {
        return { error: transferEvents.error };
    }
    const uniqueNfts = await getUniqueNfts(transferEvents.data);
    let ownedNfts = await Promise.all(uniqueNfts.filter(async (nft) => {
        const owns = await checkOwns(nft.contractAddress, address, nft.tokenID);
        if(owns.value) {
            return nft;
        }
    }));
    return ownedNfts;
}

/**
 * Runs the script
 */
async function main() {
    const testAddress = "0x10ccd4136471c7c266a9fc4569622989fb4cab99";
    const nfts = await getOwnedNfts(testAddress);
    console.log("length: " + nfts.length);
    console.log("nfts: " + JSON.stringify(nfts, null, 2));
}

main().catch((err) => {
    console.log('err: ' + err);
})
