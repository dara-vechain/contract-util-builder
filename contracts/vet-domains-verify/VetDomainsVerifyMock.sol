// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title VetDomainsVerifyMock
 * @dev A contract that allows an admin to verify addresses using OpenZeppelin AccessControl
 */
contract VetDomainsVerifyMock is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    mapping(address => bool) private verifiedAddresses;

    event VerificationStatusChanged(address indexed user, bool status);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Set verification status for an address
     * @param user Address to verify or unverify
     * @param status New verification status
     */
    function setVerification(address user, bool status) external onlyRole(ADMIN_ROLE) {
        require(user != address(0), "Cannot verify zero address");
        verifiedAddresses[user] = status;
        emit VerificationStatusChanged(user, status);
    }

    /**
     * @dev Check if an address is verified
     * @param user Address to check
     * @return Whether the address is verified
     */
    function isVerified(address user) external view returns (bool) {
        return verifiedAddresses[user];
    }
}

