import Web3 from "web3";

let web3;

const initializeWeb3 = () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    window.ethereum.enable();
    return web3;
  } else {
    alert("Please install MetaMask!");
  }
};

export default initializeWeb3;
