async function main() {
    const Voting = await ethers.getContractFactory("VotingSystem");
    console.log("Deploying VotingSystem...");

    const voting = await Voting.deploy(["Aldijana Čulezović", "Lejla Muratović", "John Doe", "Jane Doe"]);

    console.log("Voting deployed to: ", voting.target);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exitCode = 1;
});

