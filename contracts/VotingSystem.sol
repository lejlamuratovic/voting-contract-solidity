// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    struct Voter {
        bool eligible; // eligibility of the voter
        bool voted; // if the voter has already voted
        uint voteIndex; // index of the candidate voted for
    }

    struct Candidate {
        string name;
        uint voteCount;
    }

    address public electionOfficial; // election official that manages voting
    mapping(address => Voter) public voters; // mapping of voter addresses to their voting status
    Candidate[] public candidates;
    bool public electionInProgress; // tracks if the election is currently active

    event VoterRegistered(address voter);
    event VoteCast(address voter);

    // initialize the list of candidates by providing names
    constructor(string[] memory candidateNames) {
        electionOfficial = msg.sender;

        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({
                name: candidateNames[i],
                voteCount: 0
            }));
        }

        electionInProgress = false;  // election not active initially until specified explicity later
    }

    modifier onlyOfficial() {
        require(msg.sender == electionOfficial, "Only the election official can perform this action.");
        _;
    }

    modifier isEligible() {
        require(voters[msg.sender].eligible && !voters[msg.sender].voted, "Voter must be eligible and not have voted.");
        require(electionInProgress, "Voting is not possible while election is not active.");
        _;
    }

    // to start the election
    function startElection() public onlyOfficial {
        electionInProgress = true;
    }

    // to end the election
    function endElection() public onlyOfficial {
        electionInProgress = false;
    }

    // to register a voter
    function registerVoter(address voter) public onlyOfficial {
        require(!voters[voter].eligible, "Voter is already registered.");

        voters[voter] = Voter(true, false, 0);

        emit VoterRegistered(voter);
    }

    // to vote for a candidate
    function vote(uint candidateIndex) public isEligible {
        require(candidateIndex < candidates.length, "Invalid candidate.");

        voters[msg.sender].voted = true;
        voters[msg.sender].voteIndex = candidateIndex;

        candidates[candidateIndex].voteCount += 1;
        
        emit VoteCast(msg.sender);
    }

    // to determine the candidate with the most votes
    function winningCandidate() public view returns (uint winningCandidate_) {
        require(!electionInProgress, "Election results are not available until the election ends.");

        uint winningVoteCount = 0;

        for (uint p = 0; p < candidates.length; p++) {
            if (candidates[p].voteCount > winningVoteCount) {
                winningVoteCount = candidates[p].voteCount;
                winningCandidate_ = p;
            }
        }
    }

    // to retrieve the name of the winning candidate
    function winnerName() public view returns (string memory winnerName_) {
        require(!electionInProgress, "Election results are not available until the election ends.");

        winnerName_ = candidates[winningCandidate()].name;
    }
}
