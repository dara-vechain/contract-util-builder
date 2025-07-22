// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const B3trRoundModule = buildModule("B3trRoundModule", (m) => {
  // Get the required contract addresses as parameters
  const xAllocationPoolAddress = m.getParameter(
    "xAllocationPoolAddress",
    "0x1a98db0a37b040c00be156ef2fc81983f65a7fbc" // Default placeholder address
  );

  const xAllocationVotingAddress = m.getParameter(
    "xAllocationVotingAddress",
    "0xe5b2794c12432459d1a2739d7020e75a54caa930" // Default placeholder address
  );

  const x2EarnAppsAddress = m.getParameter(
    "x2EarnAppsAddress",
    "0x5a08024dccf4bd6a77a22e9fad2e7da3c307b01e" // Default placeholder address
  );

  const emissionsAddress = m.getParameter(
    "emissionsAddress",
    "0x475936657ed1c6da36880218662fd6feb362fe3c" // Default placeholder address
  );

  // Deploy the implementation contract
  const implementation = m.contract("B3trRound");

  // Deploy the ERC1967Proxy (for UUPS pattern)
  const proxy = m.contract("ERC1967Proxy", [
    implementation,
    m.encodeFunctionCall(implementation, "initialize", [
      xAllocationPoolAddress,
      xAllocationVotingAddress,
      x2EarnAppsAddress,
      emissionsAddress,
    ]),
  ]);

  // Create a contract instance that points to the implementation through the proxy
  const b3trRound = m.contractAt("B3trRound", proxy, {
    id: "B3trRoundProxyInstance",
  });

  return {
    implementation,
    proxy,
    b3trRound,
  };
});

export default B3trRoundModule;
