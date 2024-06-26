import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AddLinkIcon from "@mui/icons-material/AddLink";
import ApiIcon from "@mui/icons-material/Api";
import { Button, Paper, Typography, Container } from "@mui/material";

import initializeWeb3 from "../scripts/initializeWeb3";
import { isElectionOfficial } from "../scripts/contractInteraction";

const Connect = () => {
	const [walletConnected, setWalletConnected] = useState(false);
	const navigate = useNavigate();

	const handleConnectWallet = async () => {
		console.log("Connecting to wallet...");

		try {
			const web3 = initializeWeb3();
			if (!web3) {
				console.error("Web3 not initialized");
				return;
			}

			console.log("Requesting account access...");

			const addresses = await window.ethereum.request({
				method: "eth_requestAccounts",
			});

			if (addresses.length === 0) {
				console.error("No address provided.");
				return;
			} else {
				console.log("Connected to wallet:", addresses[0]);
				setWalletConnected(true);
				
				const official = await isElectionOfficial();
				
				if (official) {
                    navigate("/admin");
                } else {
                    navigate("/home");
                }
			}
		} catch (error) {
			console.error("Error connecting to MetaMask:", error);
		}
	};

	return (
		<Paper sx={{ p: 5, margin: "auto", flexGrow: 1 }}>
			<Typography variant="h4" color="primary" sx={{ fontWeight: "bold" }}>
				Welcome to our E-Voting System
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
			) : (
				<Typography variant="h4">Redirecting to homepage...</Typography>
			)}
		</Paper>
	);
};

export default Connect;