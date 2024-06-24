import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AddLinkIcon from "@mui/icons-material/AddLink";
import ApiIcon from "@mui/icons-material/Api";
import { Button, Paper, Typography, TextField, Container } from "@mui/material";

import initializeWeb3 from "../scripts/initializeWeb3";

const Connect = () => {
	const [walletConnected, setWalletConnected] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [address, setAddress] = useState("");
	const [isRegistered, setIsRegistered] = useState(false);
	const navigate = useNavigate();

	const handleConnectWallet = async () => {
		console.log("Connecting to wallet..."); // debugging log

		try {
			const web3 = initializeWeb3();
			if (!web3) {
				console.error("Web3 not initialized");
				return;
			}

			console.log("Requesting account access..."); // debugging log
			const addresses = await window.ethereum.request({
				method: "eth_requestAccounts",
			});

			if (addresses.length === 0) {
				console.error("No address provided.");
				return;
			}

			console.log("Connected to address:", addresses[0]); // debugging log

			// Check if student is already registered
			const isRegistered = await checkStudentRegistration(addresses[0]);

			if (isRegistered) {
				console.log("User is already registered");
				setIsRegistered(true);
				navigate("/homepage");
			} else {
				console.log("User is not registered");
				setIsRegistered(false);
				setWalletConnected(true);
				setAddress(addresses[0]);
			}
		} catch (error) {
			console.error("Error connecting to MetaMask:", error);
		}
	};

	const handleSubmit = async () => {
		if (!firstName || !lastName) {
			alert("Please enter both first and last names.");
			return;
		}

		try {
			await registerStudentOnBlockchain(address, firstName, lastName);
			alert("Student registered successfully!");
			navigate("/homepage");
		} catch (error) {
			console.error("Error registering student:", error);
			alert("Failed to register student.");
		}
	};

	return (
		<Paper sx={{ p: 2, margin: "auto", flexGrow: 1 }}>
			<ApiIcon sx={{ fontSize: 70, m: 1 }} color="primary" />
			<Typography variant="h4" color="primary" sx={{ fontWeight: "bold" }}>
				Welcome to EduChain
			</Typography>
			{!walletConnected ? (
				<Container>
					<Typography variant="h6">
						Please connect your wallet to continue
					</Typography>
					<Button
						variant="contained"
						color="primary"
						sx={{ mt: 4, p: 1, fontSize: "18px" }}
						onClick={handleConnectWallet}
					>
						<AddLinkIcon sx={{ fontSize: 30, mr: 1 }} />
						Connect Wallet
					</Button>
				</Container>
			) : isRegistered ? (
				<Typography variant="h4">Redirecting to homepage...</Typography>
			) : (
				<Container>
					<Container sx={{ width: "100%" }}>
						<TextField
							label="First Name"
							variant="outlined"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							sx={{ mt: 2 }}
						/>
						<TextField
							label="Last Name"
							variant="outlined"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							sx={{ mt: 2, ml: 2 }}
						/>
					</Container>

					<Button
						variant="contained"
						color="primary"
						sx={{ mt: 4, p: 1, fontSize: "23px", width: "90%", mb: 2 }}
						onClick={handleSubmit}
					>
						Submit
					</Button>
				</Container>
			)}
		</Paper>
	);
};

export default Connect;