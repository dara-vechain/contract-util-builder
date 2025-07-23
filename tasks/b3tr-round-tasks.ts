import { task, types } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { B3trRound } from "../typechain-types";

// Contract addresses for different networks
const CONTRACT_ADDRESSES: Record<string, string> = {
  vechain_mainnet: "0x0000000000000000000000000000000000000000",
  vechain_testnet: "0x3aaeCeb6702A5D3999399437B601e8D04d70dD6E",
  vechain_solo: "0xe32f25c825b8515ade62541cf6cc195c0e211855",
};

// Helper function to get contract instance
async function getContract(hre: HardhatRuntimeEnvironment): Promise<B3trRound> {
  const env = hre.network.name || "vechain_solo";
  const contractAddress = CONTRACT_ADDRESSES[env];

  if (!contractAddress) {
    throw new Error(`No contract address configured for network: ${env}`);
  }

  console.log(`Network: ${env}`);
  console.log(`Using contract address: ${contractAddress}`);

  const contract = await hre.ethers.getContractAt("B3trRound", contractAddress);
  return contract as unknown as B3trRound;
}

// Format bytes32 array for display
function formatBytes32Array(array: string[]): string {
  if (array.length === 0) return "[]";
  return `[\n  ${array.join(",\n  ")}\n]`;
}

// Task to check the contract dependencies
task("round:check-dependencies", "Check the contract dependencies").setAction(
  async (_, hre) => {
    const contract = await getContract(hre);

    // Check emissions address
    const emissionsAddress = await contract.emissions();
    console.log(`Emissions contract address: ${emissionsAddress}`);

    // Check other dependencies
    const xAllocationPoolAddress = await contract.xAllocationPool();
    console.log(`XAllocationPool contract address: ${xAllocationPoolAddress}`);

    const xAllocationVotingAddress = await contract.xAllocationVoting();
    console.log(
      `XAllocationVoting contract address: ${xAllocationVotingAddress}`
    );

    const x2EarnAppsAddress = await contract.x2EarnApps();
    console.log(`X2EarnApps contract address: ${x2EarnAppsAddress}`);
  }
);

// Task to get current round ID
task("round:current", "Get the current round ID").setAction(async (_, hre) => {
  const contract = await getContract(hre);
  const roundId = await contract.getCurrentRoundId();
  console.log(`Current Round ID: ${roundId}`);
});

// Task to get previous round ID
task("round:previous", "Get the previous round ID").setAction(
  async (_, hre) => {
    const contract = await getContract(hre);
    const roundId = await contract.getPreviousRoundId();
    console.log(`Previous Round ID: ${roundId}`);
  }
);

// Task to get all X-Apps for a specific round
task("apps:all", "Get all X-Apps for a specific round")
  .addParam("roundId", "The round ID", undefined, types.string)
  .setAction(async (args, hre) => {
    const contract = await getContract(hre);
    const apps = await contract.getAllXAppsForRound(args.roundId);
    console.log(`All X-Apps for Round ${args.roundId}:`);
    console.log(formatBytes32Array(apps));
    console.log(`Total: ${apps.length} apps`);
  });

// Task to get unclaimed X-Apps for a specific round
task("apps:unclaimed", "Get unclaimed X-Apps for a specific round")
  .addParam("roundId", "The round ID", undefined, types.string)
  .setAction(async (args, hre) => {
    const contract = await getContract(hre);
    const apps = await contract.getUnclaimedXAppsForRound(args.roundId);
    console.log(`Unclaimed X-Apps for Round ${args.roundId}:`);
    console.log(formatBytes32Array(apps));
    console.log(`Total: ${apps.length} unclaimed apps`);
  });

// Task to get unclaimed X-Apps with amounts for a specific round
task(
  "apps:unclaimed-with-amounts",
  "Get unclaimed X-Apps with their claimable amounts"
)
  .addParam("roundId", "The round ID", undefined, types.string)
  .setAction(async (args, hre) => {
    const contract = await getContract(hre);
    const [appIds, amounts] = await contract.getUnclaimedXAppsWithAmounts(
      args.roundId
    );

    console.log(`Unclaimed X-Apps with Amounts for Round ${args.roundId}:`);
    console.log(
      "AppID                                                                  | Amount"
    );
    console.log(
      "-----------------------------------------------------------------------|-----------------"
    );

    for (let i = 0; i < appIds.length; i++) {
      console.log(`${appIds[i]} | ${hre.ethers.formatEther(amounts[i])} B3TR`);
    }

    console.log(`\nTotal: ${appIds.length} unclaimed apps`);
  });

// Task to get unclaimed X-Apps with non-zero amounts for a specific round
task("apps:unclaimed-non-zero", "Get unclaimed X-Apps with non-zero amounts")
  .addParam("roundId", "The round ID", undefined, types.string)
  .setAction(async (args, hre) => {
    const contract = await getContract(hre);
    const apps = await contract.getUnclaimedXAppsWithNonZeroAmounts(
      args.roundId
    );
    console.log(
      `Unclaimed X-Apps with Non-Zero Amounts for Round ${args.roundId}:`
    );
    console.log(formatBytes32Array(apps));
    console.log(`Total: ${apps.length} unclaimed apps with non-zero amounts`);
  });

// Task to check if a specific X-App has claimed its allocation
task("apps:has-claimed", "Check if a specific X-App has claimed its allocation")
  .addParam("roundId", "The round ID", undefined, types.string)
  .addParam("appId", "The X-App ID", undefined, types.string)
  .setAction(async (args, hre) => {
    const contract = await getContract(hre);
    const claimed = await contract.hasXAppClaimed(args.roundId, args.appId);
    console.log(
      `Has App ${args.appId} claimed for Round ${args.roundId}: ${claimed}`
    );
  });

// Task to claim allocations for a specific round
task(
  "claim:round",
  "Claim allocations for all unclaimed X-Apps for a specific round"
)
  .addParam("roundId", "The round ID", undefined, types.string)
  .setAction(async (args, hre) => {
    const contract = await getContract(hre);
    console.log(`Claiming allocations for Round ${args.roundId}...`);

    try {
      const tx = await contract.claimAllocationsForRound(args.roundId);
      console.log(`Transaction hash: ${tx.hash}`);
      await tx.wait();
      console.log("Transaction confirmed!");

      // Get the claimed app IDs from the transaction receipt
      const receipt = await hre.ethers.provider.getTransactionReceipt(tx.hash);
      if (receipt && receipt.logs) {
        console.log("Successfully claimed allocations for Round", args.roundId);
      }
    } catch (error) {
      console.error("Error claiming allocations:", error);
    }
  });

// Task to claim allocations for the previous round
task(
  "claim:previous-round",
  "Claim allocations for the previous round"
).setAction(async (_, hre) => {
  const contract = await getContract(hre);
  const prevRoundId = await contract.getPreviousRoundId();
  console.log(`Claiming allocations for previous round (${prevRoundId})...`);

  try {
    const tx = await contract.claimAllocationsForPreviousRound();
    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log("Transaction confirmed!");
    console.log("Successfully claimed allocations for the previous round");
  } catch (error) {
    console.error("Error claiming allocations for previous round:", error);
  }
});

// Task to start a new round and distribute allocations
task(
  "round:start-new",
  "Start a new round and distribute allocations"
).setAction(async (_, hre) => {
  const contract = await getContract(hre);
  console.log("Starting new round and distributing allocations...");

  try {
    const tx = await contract.startNewRoundAndDistributeAllocations();
    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log("Transaction confirmed!");

    const currentRound = await contract.getCurrentRoundId();
    console.log(`New round started. Current round is now: ${currentRound}`);
  } catch (error) {
    console.error("Error starting new round:", error);
  }
});
