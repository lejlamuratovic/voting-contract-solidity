// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Relay1 is Ownable(msg.sender) {
   
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    mapping(address => bool) private isWhitelisted;
    mapping(address => uint) private nonces;

    function forward(
        address _to,
        bytes calldata _data,
        uint _nonce,
        bytes memory _signature
    ) external returns (bytes memory _result) {
        bool success;

        address signerAddress = verifySignature(_to, _data, _nonce, _signature);
        nonces[signerAddress]++;

        (success, _result) = _to.call(_data);

        if (!success) {
            assembly {
                returndatacopy(0, 0, returndatasize())
                revert(0, returndatasize())
            }
        }
    }

    function verifySignature(
        address _to,
        bytes calldata _data,
        uint _nonce,
        bytes memory signature
    ) private view returns (address) {
        require(_to != address(0), "Invalid target address!");

        bytes memory payload = abi.encode(_to, _data, _nonce);
        
        address signerAddress = keccak256(payload)
            .toEthSignedMessageHash()
            .recover(signature);

        require(
            isWhitelisted[signerAddress] && nonces[signerAddress] == _nonce,
            "Signature validation failed!"
        );
        return signerAddress;
    }


    function addToWhitelist(address _signer) external onlyOwner {
        isWhitelisted[_signer] = true;
    }


    function isInWhitelist(address _signer) external view onlyOwner returns (bool) {
        return isWhitelisted[_signer];
    }

    function getNonce(address _signer) external view returns (uint) {
        return nonces[_signer];
    }
}
