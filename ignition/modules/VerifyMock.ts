// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VerifyMockModule = buildModule("VerifyMockModule", (m) => {
  // Deploy the VetDomainsVerifyMock contract with no constructor arguments
  const verifyMock = m.contract("VetDomainsVerifyMock", []);

  return { verifyMock };
});

export default VerifyMockModule;
