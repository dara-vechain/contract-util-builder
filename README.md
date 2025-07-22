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

The `B3trRound` contract provides essential functionality for managing allocation rounds and distributing rewards. It offers several utility functions to streamline the process of starting new rounds and handling allocations.

Key functions include:

```
function getUnclaimedXAppsWithNonZeroAmounts(uint256 roundId) public view returns (bytes32[] memory)

function getUnclaimedXAppsWithNonZeroAmountsForPreviousRound() public view returns (bytes32[] memory)
```

These functions return an array of application IDs that have pending, non-zero rewards based on the specified round ID. The second function specifically targets the previous round for convenience after a new round has started.
