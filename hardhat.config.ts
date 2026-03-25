import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    horizenEON: {
      url: "https://rpc.ankr.com/horizen_eon",
      chainId: 7332,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY!],
    },
    horizenEONTestnet: {
      url: "https://gobi-rpc.horizenlabs.io/ethv1",
      chainId: 1663,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY!],
    },
  },
};

export default config;
