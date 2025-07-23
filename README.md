# Smart Contract Util Builder

## Setup

```shell
# Copy env and fill in your env values
cp .env.example .env

# Install dependencies
yarn install

# Deploy B3trRound to VeChain Thor Solo
yarn deploy:local:b3tr-round

# Deploy B3trRound to VeChain Testnet
yarn deploy:testnet:b3tr-round
```

### `B3trRound` Contract

Testnet Contract Address: `0xbc2a439075ec290fffcf082ac4baaf841f45a4db`

The **B3trRound** contract provides some utils for managing allocation rounds and distributing rewards.

Key functions include:

```shell
# This return an array of application IDs that have pending claim and non-zero rewards based on the specified round ID.
function getUnclaimedXAppsWithNonZeroAmounts(uint256 roundId) public view returns (bytes32[] memory)

# This specifically targets the previous round for convenience after a new round has started.
function getUnclaimedXAppsWithNonZeroAmountsForPreviousRound() public view returns (bytes32[] memory)
```

Main function include:

```shell
function startNewRoundAndDistributeAllocations()
```

This function starts a new round and distribute allocations for the previous round.

## Contract Interactions

### Hardhat Tasks

The project includes Hardhat tasks for interacting with the B3trRound contract:

```shell
# Get the current round ID
npx hardhat round:current --network vechain_solo

# Get unclaimed X-Apps for a specific round
npx hardhat apps:unclaimed --round-id 5 --network vechain_solo

# Claim allocations for a specific round
npx hardhat claim:round --round-id 5 --network vechain_solo
```

For more details, see the [tasks README](./tasks/README.md).

### Bugs

1. Any write function that calls another contract is failing **silently**: Try `startNewRoundAndDistributeAllocations` and `getUnclaimedXAppsWithNonZeroAmounts`
2. Both `getUnclaimedXAppsWithNonZeroAmounts` and `getUnclaimedXAppsWithNonZeroAmountsForPreviousRound` are not working but **only** the second one is reverting
