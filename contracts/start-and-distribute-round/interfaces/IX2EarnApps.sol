// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
 * @title IX2EarnApps
 * @notice Interface for the X2EarnApps contract.
 * @dev The contract inheriting this interface should be able to manage the x2earn apps and their Eligibility for allocation voting.
 */
interface IX2EarnApps {
    /**
     * @dev return true if an app is pending for endorsement.
     */
    function isAppUnendorsed(bytes32 appId) external view returns (bool);

    /**
     * @notice Gets the ids of all apps that are looking for endorsement.
     * @return the ids of the apps that are pending for endorsement
     */
    function unendorsedAppIds() external view returns (bytes32[] memory);

    /**
     * @notice Get the version of the contract.
     * @dev This should be updated every time a new version of implementation is deployed.
     */
    function version() external view returns (string memory);
}
