import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Container, Paper, Typography, TextField, Button, Box, FormGroup } from "@mui/material";

import { LoadingIndicator, CustomAlert, ElectionResults } from "../components";

import { 
    startElection, 
    endElection, 
    registerVoter, 
    getElectionStatus, 
    getWinnerName, 
    getElectionEndDate
} from "../scripts/contractInteraction";

const AdminPage = () => {
    const [voterAddress, setVoterAddress] = useState("");
    const [electionStatus, setElectionStatus] = useState("");
    const [winnerName, setWinnerName] = useState("");
    const [loadingElection, setLoadingElection] = useState(false);
    const [loadingVoter, setLoadingVoter] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: "", type: "" });

    const navigate = useNavigate();

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

    const handleStartElection = async () => {
      setLoadingElection(true);
  
      try {
          await startElection();

          setAlert({ show: true, message: "Election has started successfully.", type: "success" });
      } catch (error) {
          console.error(error);

          setAlert({ show: true, message: "Failed to start the election.", type: "error" });
      }
  
      setLoadingElection(false);
  };
  
  const handleEndElection = async () => {
      setLoadingElection(true);
  
      try {
          await endElection();

          setAlert({ show: true, message: "Election has ended successfully.", type: "success" });
      } catch (error) {
          console.error(error);

          setAlert({ show: true, message: "Failed to end the election.", type: "error" });
      }
  
      setLoadingElection(false);
  };
  
  const handleRegisterVoter = async () => {
      if (!voterAddress) {
          setAlert({ show: true, message: "Please provide a valid Ethereum address.", type: "warning" });

          return;
      }
  
      setLoadingVoter(true);
  
      try {
          await registerVoter(voterAddress);

          setAlert({ show: true, message: "Voter registered successfully", type: "success" });

          setVoterAddress("");
      } catch (error) {
          console.error(error);

          setAlert({ show: true, message: "Failed to register voter.", type: "error" });
      }
  
      setLoadingVoter(false);
  };  

  if (winnerName) {
    return <ElectionResults />;
  }

  return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            {alert.show && <CustomAlert message={alert.message} type={alert.type} />}
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>

            {/* voter registration form */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6">Register Voter</Typography>
                <Box component="form" noValidate autoComplete="off">
                    <TextField
                        fullWidth
                        label="Voter Address"
                        value={voterAddress}
                        onChange={(e) => setVoterAddress(e.target.value)}
                        margin="normal"
                    />
                    <Button variant="contained" sx={{ mt: 1 }} onClick={handleRegisterVoter} disabled={loadingVoter}>
                        {loadingVoter ? <LoadingIndicator /> : "Register Voter"}
                    </Button>
                </Box>
            </Paper>

            {/* election control panel */}
            <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Election Control</Typography>
                <FormGroup>
                    <Button variant="contained" color="primary" sx={{ mt: 2, mb: 1 }} onClick={handleStartElection} disabled={loadingElection}>
                        {loadingElection ? <LoadingIndicator /> : "Start Election"}
                    </Button>
                    <Button variant="contained" color="error" sx={{ mb: 2 }} onClick={handleEndElection} disabled={loadingElection}>
                        {loadingElection ? <LoadingIndicator /> : "End Election"}
                    </Button>
                </FormGroup>
                <Typography variant="subtitle1">
                    Election Status: {electionStatus}
                </Typography>
            </Paper>
        </Container>
  );
};

export default AdminPage;
