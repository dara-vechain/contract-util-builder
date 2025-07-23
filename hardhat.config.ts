import "@nomicfoundation/hardhat-toolbox";
import "@vechain/sdk-hardhat-plugin";

import "@vechain/hardhat-vechain";
import { HardhatUserConfig } from "hardhat/config";
import * as dotenv from "dotenv";

// Import tasks
import "./tasks/b3tr-round-tasks";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
};

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          evmVersion: "paris",
        },
      },
    ],
  },
  networks: {
    vechain_solo: {
      url: "http://localhost:8669",
      accounts: {
        mnemonic: process.env.MNEMONIC || "",
        path: "m/44'/818'/0'/0",
        count: 20,
      },
      restful: true,
      gas: 10000000,
    },
    vechain_testnet: {
      url: "https://testnet.vechain.org",
      chainId: 100010,
      accounts: {
        mnemonic: process.env.TESTNET_MNEMONIC || "",
        count: 20,
        path: "m/44'/818'/0'/0",
      },
      restful: true,
      gas: 10000000,
    },
  },
};

export default config;
