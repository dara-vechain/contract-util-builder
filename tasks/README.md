# Hardhat Tasks

This directory contains Hardhat tasks for interacting with the smart contracts.

## B3trRound Tasks

The following tasks are available for interacting with the B3trRound contract:

### Round Management

- `round:current` - Get the current round ID

  ```bash
  npx hardhat round:current --network vechain_testnet
  ```

- `round:previous` - Get the previous round ID

  ```bash
  npx hardhat round:previous --network vechain_testnet
  ```

- `round:start-new` - Start a new round and distribute allocations
  ```bash
  npx hardhat round:start-new --network vechain_testnet
  ```

### X-Apps Information

- `apps:all` - Get all X-Apps for a specific round

  ```bash
  npx hardhat apps:all --round-id 5 --network vechain_testnet
  ```

- `apps:unclaimed` - Get unclaimed X-Apps for a specific round

  ```bash
  npx hardhat apps:unclaimed --round-id 5 --network vechain_solo
  ```

- `apps:unclaimed-with-amounts` - Get unclaimed X-Apps with their claimable amounts

  ```bash
  npx hardhat apps:unclaimed-with-amounts --round-id 5 --network vechain_solo
  ```

- `apps:unclaimed-non-zero` - Get unclaimed X-Apps with non-zero amounts

  ```bash
  npx hardhat apps:unclaimed-non-zero --round-id 5 --network vechain_solo
  ```

- `apps:has-claimed` - Check if a specific X-App has claimed its allocation
  ```bash
  npx hardhat apps:has-claimed --round-id 5 --app-id 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef --network vechain_solo
  ```

### Claiming Allocations

- `claim:round` - Claim allocations for all unclaimed X-Apps for a specific round

  ```bash
  npx hardhat claim:round --round-id 5 --network vechain_testnet
  ```

- `claim:previous-round` - Claim allocations for the previous round
  ```bash
  npx hardhat claim:previous-round --network vechain_testnet
  ```

## Configuration

Before using these tasks, make sure to update the contract addresses in the task file for each network:

```typescript
// Contract addresses for different networks
const CONTRACT_ADDRESSES: Record<string, string> = {
  vechain_mainnet: "0x...", // Replace with actual mainnet address
  vechain_testnet: "0x...", // Testnet address
  vechain_solo: "0x...", // Replace with actual local address after deployment
};
```
