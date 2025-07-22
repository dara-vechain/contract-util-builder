import { ethers, network } from "hardhat";

async function main() {
  console.log("Deploying B3trRound contract using proxy pattern...");
  let env = network.name || "vechain_solo";
  console.log("Network:", env);

  // Get signers
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Get contract factory for implementation
  const B3trRound = await ethers.getContractFactory("B3trRound", deployer);

  // Deploy implementation contract
  console.log("Deploying implementation contract...");
  const implementation = await B3trRound.deploy();
  await implementation.waitForDeployment();

  const implementationAddress = await implementation.getAddress();
  console.log("Implementation deployed to:", implementationAddress);

  let xAllocationPoolAddress = "";
  let xAllocationVotingAddress = "";
  let x2EarnAppsAddress = "";
  let emissionsAddress = "";

  switch (env) {
    case "vechain_mainnet":
      xAllocationPoolAddress = "0x6Bee7DDab6c99d5B2Af0554EaEA484CE18F52631";
      xAllocationVotingAddress = "0x89A00Bb0947a30FF95BEeF77a66AEdE3842Fe5B7";
      x2EarnAppsAddress = "0x8392B7CCc763dB03b47afcD8E8f5e24F9cf0554D";
      emissionsAddress = "0xDf94739bd169C84fe6478D8420Bb807F1f47b135";
      break;
    case "vechain_testnet":
      xAllocationPoolAddress = "0x6f7b4bc19b4dc99005b473b9c45ce2815bbe7533";
      xAllocationVotingAddress = "0x8800592c463f0b21ae08732559ee8e146db1d7b2";
      x2EarnAppsAddress = "0x0b54a094b877a25bdc95b4431eaa1e2206b1ddfe";
      emissionsAddress = "0x66898f98409db20ed6a1bf0021334b7897eb0688";
      break;
    case "vechain_solo":
      xAllocationPoolAddress = "0x1a98db0a37b040c00be156ef2fc81983f65a7fbc";
      xAllocationVotingAddress = "0xe5b2794c12432459d1a2739d7020e75a54caa930";
      x2EarnAppsAddress = "0x5a08024dccf4bd6a77a22e9fad2e7da3c307b01e";
      emissionsAddress = "0x475936657ed1c6da36880218662fd6feb362fe3c";
      break;
    default:
      throw new Error("Invalid network");
  }

  // Get the ERC1967Proxy contract factory
  const ERC1967Proxy = await ethers.getContractFactory(
    "ERC1967Proxy",
    deployer
  );

  // Encode the initialize function call for the proxy
  const initializeData = B3trRound.interface.encodeFunctionData("initialize", [
    xAllocationPoolAddress,
    xAllocationVotingAddress,
    x2EarnAppsAddress,
    emissionsAddress,
  ]);

  // Deploy the proxy contract
  console.log("Deploying proxy contract...");
  const proxy = await ERC1967Proxy.deploy(
    implementationAddress,
    initializeData
  );
  await proxy.waitForDeployment();

  const proxyAddress = await proxy.getAddress();
  console.log("Proxy deployed to:", proxyAddress);

  // Create a contract instance pointing to the proxy but using the ABI of the implementation
  console.log("Creating contract instance through proxy...");
  const b3trRoundProxy = await ethers.getContractAt("B3trRound", proxyAddress);
  console.log("B3trRound (through proxy) initialized!");

  // Verify that the contract is working by calling its methods
  try {
    const currentRoundId = await b3trRoundProxy.getCurrentRoundId();
    console.log("Current round ID:", currentRoundId);

    // Get the previous round ID
    const previousRoundId = await b3trRoundProxy.getPreviousRoundId();
    console.log("Previous round ID:", previousRoundId);

    // Get unclaimed apps for the previous round
    const unclaimedApps =
      await b3trRoundProxy.getUnclaimedXAppsForPreviousRound();
    console.log("Unclaimed apps for previous round:", unclaimedApps);
  } catch (error) {
    console.error("Error calling contract methods:", error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
