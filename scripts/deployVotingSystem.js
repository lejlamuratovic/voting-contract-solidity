async function main() {
    const Voting = await ethers.getContractFactory("VotingSystem");
    console.log("Deploying VotingSystem...");

    const candidates = ["Aldijana Čulezović", "Lejla Muratović", "John Doe", "Jane Doe"];
    const endDate = new Date('2024-06-30T15:20:00Z').getTime() / 1000;
    
    const voting = await Voting.deploy(candidates, endDate);

    console.log("Voting deployed to: ", voting.target);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exitCode = 1;
});

