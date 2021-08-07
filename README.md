# Get all NFTs

## Setup

First of all, to run this script you will need API keys from `Infura` and `Etherscan`. Save them as an environmental variables:

```bash
export ETHERSCAN_KEY=<api-key>
export INFURA_KEY=<api-key>
```

Clone this repo and install dependencies:
```bash
git clone https://github.com/dastansam/nfts-owner.git
cd nfts-owner
npm install
```

## Run
Inside the `index.js`, replace `testAddress` variable value with any address you want to check. Ideally, you have to have 
Run the script
```bash
node index.js
```

This should print number of NFTs and list of NFT objects in the following format:

```js
{
  tokenId: number, 
  contractAddress: string | address, 
  tokenName: string
}
```
