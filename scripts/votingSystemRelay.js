const { ethers } = require("hardhat");

console.log("Relaying transactions...");

const relayAddress = "0x6cE199461b100B5E781273474DA88Ba6275cbDAC";
const contractAddress = "0xbd51b509558e8a983CF7BD3021De377884ec08d0";

// initialize contract 
const abi = [
    "function registerVoter(address)",
    "function vote(uint, address)",
    "function startElection()",
    "function endElection()",
    "function getAllCandidates() view returns (tuple(string,uint)[])", 
    "function winnerName() view returns (string)",
];

const contractInterface = new ethers.Interface(abi);
const provider = new ethers.AlchemyProvider(network = "sepolia", process.env.ALCHEMY_API_KEY);
const signer = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);

// generic relay function
async function relayTransaction(methodName, args) {
    console.log(`Relaying transaction for method: ${methodName}`);

    // to encode function data
    const fnParams = contractInterface.encodeFunctionData(methodName, args);

    console.log(`Calldata: ${fnParams}`);

    // to get relay contract
    const relayContract = await ethers.getContractAt("Relay1", relayAddress, signer);

    // to prepare transaction details
    let nonce; 
    try {
        nonce = await relayContract.getNonce(signer.address);
    } catch (error) {
        console.error("Error getting nonce: ", error);
        return;
    }

    const abiCoder = new ethers.AbiCoder();

    const rawData = abiCoder.encode(
        ["address", "bytes", "uint256"],
        [contractAddress, fnParams, nonce]
    );

    let hash = ethers.solidityPackedKeccak256(["bytes"], [rawData])
    console.log("Data hash:", hash)

    let signature = await signer.signMessage(ethers.getBytes(hash))

    console.log("Signature:", signature)

    const isWhiteListed = await relayContract.isInWhitelist(signer.address);

    if (!isWhiteListed) {
        console.log("Whitelisting signer address...");

        await relayContract.addToWhitelist(signer.address);
    }

    const relayTx = await relayContract.forward(contractAddress, fnParams, nonce, signature);

    await relayTx.wait();

    console.log("Transaction successfully relayed.", relayTx.hash);
}

async function main() {
    try {
        await relayTransaction("vote", [0, "0xe2F553E3Ae2B7F6F63bFe4a7c95AADb43cc76Af5"]);
    } catch (error) {
        console.error("Error during transactions: ", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
});
