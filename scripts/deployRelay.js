const { ethers } = require("hardhat");

async function main() {
    const Relay = await ethers.getContractFactory("Relay1");
    console.log("Deploying Relay...");
    
    const contract = await Relay.deploy();
    await contract.waitForDeployment();

    console.log("Relay address: ", contract.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
});
