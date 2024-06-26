import initializeWeb3 from "./initializeWeb3";

const web3 = initializeWeb3();

const contractABI = [{"inputs":[{"internalType":"string[]","name":"candidateNames","type":"string[]"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"voter","type":"address"}],"name":"VoteCast","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"voter","type":"address"}],"name":"VoterRegistered","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"candidates","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"voteCount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"electionInProgress","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"electionOfficial","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"endElection","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllCandidates","outputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"voteCount","type":"uint256"}],"internalType":"struct VotingSystem.Candidate[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"voter","type":"address"}],"name":"registerVoter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startElection","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"candidateIndex","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"voters","outputs":[{"internalType":"bool","name":"eligible","type":"bool"},{"internalType":"bool","name":"voted","type":"bool"},{"internalType":"uint256","name":"voteIndex","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"winnerName","outputs":[{"internalType":"string","name":"winnerName_","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"winningCandidate","outputs":[{"internalType":"uint256","name":"winningCandidate_","type":"uint256"}],"stateMutability":"view","type":"function"}];

const contractAddress = "0x79A2D8B10AbD0a56FA62B43cb45244eB5D7a1695";

const contract = new web3.eth.Contract(contractABI, contractAddress);

export const getCandidates = async () => {
    try {
        const candidates = await contract.methods.getAllCandidates().call();

        return candidates.map(candidate => ({
            name: candidate.name,
            voteCount: parseInt(candidate.voteCount)
        }));
    } catch (error) {
        console.error(error);
    }
};

export const vote = async (candidateIndex) => {
    try {
        const accounts = await web3.eth.getAccounts();
        const voter = accounts[0];

        await contract.methods.vote(candidateIndex).send({ from: voter });
    } catch (error) {
        console.error(error);
    }
};

export const isElectionOfficial = async () => {
    try {
        const accounts = await web3.eth.getAccounts();
        const currentAccount = accounts[0];
        const electionOfficialAddress = await contract.methods.electionOfficial().call();

        return currentAccount.toLowerCase() === electionOfficialAddress.toLowerCase();
    } catch (error) {
        console.error(error);
    }
};

export const startElection = async () => {
    try {
        const accounts = await web3.eth.getAccounts();
        const adminAccount = accounts[0];

        const transaction = await contract.methods.startElection().send({ from: adminAccount });
        console.log("Election started successfully: ", transaction);
    } catch (error) {
        console.error(error);
    }
};

export const endElection = async () => {
    try {
        const accounts = await web3.eth.getAccounts();
        const adminAccount = accounts[0];

        const transaction = await contract.methods.endElection().send({ from: adminAccount });
        console.log("Election ended successfully: ", transaction);
    } catch (error) {
        console.error(error);
    }
};

export const registerVoter = async (voterAddress) => {
    try {
        const accounts = await web3.eth.getAccounts();
        const adminAccount = accounts[0];

        const transaction = await contract.methods.registerVoter(voterAddress).send({ from: adminAccount });
        console.log("Voter registered successfully: ", transaction);
    } catch (error) {
        console.error(error);
    }
};

export const registerCandidate = async (candidateName) => {
    try {
        const accounts = await web3.eth.getAccounts();
        const adminAccount = accounts[0];

        const transaction = await contract.methods.addCandidate(candidateName).send({ from: adminAccount });
        console.log("Candidate added successfully: ", transaction);
    } catch (error) {
        console.error(error);
    }
};

export const getElectionStatus = async () => {
    try {
        const status = await contract.methods.electionInProgress().call();

        return status;
    } catch (error) {
        console.error(error);
    }
};
