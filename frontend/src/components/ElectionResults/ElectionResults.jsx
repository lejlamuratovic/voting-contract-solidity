import { useEffect, useState } from "react";

import { Container, Paper, Typography } from "@mui/material";

import { getWinnerName, getCandidates } from "../../scripts/contractInteraction";

const ElectionResults = () => {
    const [candidates, setCandidates] = useState([]);
    const [winnerName, setWinnerName] = useState("");

    useEffect(() => {
        const fetchElectionResults = async () => {
            const candidatesData = await getCandidates();
            setCandidates(candidatesData);
    
            const name = await getWinnerName();
            setWinnerName(name);
        }
    
        fetchElectionResults();
    }, []);

    return (
        <Container maxWidth="sm">
        <Paper sx={{ p: 4 }}> 
        <Typography variant="h4" gutterBottom>
        Winner of the Election
        </Typography>
        <Typography variant="h5" color="green">{winnerName}</Typography>
        </Paper>
        <Typography sx={{ mt: 2 }} variant="h6">
        Final Election Results:
        </Typography>
        {candidates.map((candidate, index) => (
        <Typography key={index} sx={{ pt: 1 }}>
            {candidate.name}: {candidate.voteCount} votes
        </Typography>
        ))}
    </Container>
    )
}

export default ElectionResults
