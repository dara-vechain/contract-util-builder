import { ethers } from "hardhat";

async function main() {
  console.log("Deploying VetDomainsVerifyMock contract...");

  const verifyMock = await ethers.deployContract("VetDomainsVerifyMock");

  await verifyMock.waitForDeployment();

  const deployedAddress = await verifyMock.getAddress();
  console.log(`VetDomainsVerifyMock contract deployed to ${deployedAddress}`);

  const deployer = (await ethers.getSigners())[0];
  console.log(
    `Deployer address (with DEFAULT_ADMIN_ROLE and ADMIN_ROLE): ${deployer.address}`
  );

  // You can verify contract on Etherscan if needed
  console.log("To verify the contract on Etherscan, run:");
  console.log(`npx hardhat verify --network <network_name> ${deployedAddress}`);

  return { verifyMock, deployedAddress };
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
