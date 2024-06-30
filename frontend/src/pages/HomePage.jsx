import React, { useState, useEffect } from "react";

import { CustomAlert, LoadingIndicator, ElectionResults } from "../components";

import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Paper, Typography } from "@mui/material";

import { getCandidates, vote, getElectionStatus, getWinnerName, getElectionEndDate } from "../scripts/contractInteraction";

const HomePage = () => {
  const [candidates, setCandidates] = useState([]);
  const [electionStatus, setElectionStatus] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [winnerName, setWinnerName] = useState("");

  useEffect(() => {
    const fetchElectionStatusAndWinner = async () => {
        const status = await getElectionStatus();
        const endDate = await getElectionEndDate();
        const now = Math.floor(Date.now() / 1000);

        setElectionStatus(status ? "In Progress" : "Not Started");

        if (!status && endDate && now > parseInt(endDate)) {
            const name = await getWinnerName();
            setWinnerName(name);
        }
    };

    fetchElectionStatusAndWinner();
  }, []);

  useEffect(() => {
    if (alert.show) {
        const timer = setTimeout(() => {
            setAlert({ ...alert, show: false });
        }, 5000);

        return () => clearTimeout(timer);
    }
  }, [alert]);

  const getCandidatesData = async () => {
    try {
      const candidatesData = await getCandidates();

      setCandidates(candidatesData);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  useEffect(() => {
    getCandidatesData();
  }, []);

  const handleRadioChange = (event) => {
    setSelectedCandidate(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (selectedCandidate === "") {
        setAlert({ show: true, message: "Please select a candidate to vote.", type: "error" });

        setLoading(false);

        return;
    }

    try {
        const transaction = await vote(selectedCandidate);

        setAlert({ show: true, message: "Your vote has been cast successfully.", type: "success" });
    } catch (error) {
        console.error(error);

        setAlert({ show: true, message: "Failed to cast your vote.", type: "error" });
    }

    setLoading(false);
  };

  if (winnerName) {
    return <ElectionResults />;
  }

  return (
    <>
    {alert.show && <CustomAlert message={alert.message} type={alert.type} />}
    {electionStatus === "Not Started" ? 
      <CustomAlert message="The election has not started yet." type="info" /> : ( 
        <Paper sx={{ p: 5, margin: "auto", minWidth: "300px" }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: "bold", mb: 3 }}>
            Cast Your Vote
          </Typography>
          <FormControl component="fieldset">
            <FormLabel component="legend">Please select a candidate: </FormLabel>
            <RadioGroup
              name="candidates"
              value={selectedCandidate}
              onChange={handleRadioChange}
              sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2, mb: 2 }}
            >
              {candidates.map((candidate, index) => (
                <FormControlLabel
                  key={index}
                  value={index.toString()}
                  control={<Radio />}
                  label={`${candidate.name} (Votes: ${candidate.voteCount})`}
                />
              ))}
            </RadioGroup>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {loading ? <LoadingIndicator /> : "Submit"}
            </Button>
          </FormControl>
      </Paper>
    )}	
  </>
  );
};

export default HomePage
