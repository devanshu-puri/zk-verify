import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const ZKVERIFY_PROXY_HORIZEN = "0xCb47A3C3B9Eb2E549a3F2EA4729De28CafbB2b69";

  console.log("Deploying DrugChainRegistry...");
  const DrugChainRegistry = await ethers.getContractFactory("DrugChainRegistry");
  const registry = await DrugChainRegistry.deploy(ZKVERIFY_PROXY_HORIZEN);

  await registry.waitForDeployment();
  const address = await registry.getAddress();
  console.log("DrugChainRegistry deployed to:", address);

  // Write the address to lib/constants.ts automatically
  const constantsPath = path.join(__dirname, "..", "lib", "constants.ts");
  
  if (!fs.existsSync(path.dirname(constantsPath))) {
    fs.mkdirSync(path.dirname(constantsPath), { recursive: true });
  }

  let constantsContent = "";
  if (fs.existsSync(constantsPath)) {
    constantsContent = fs.readFileSync(constantsPath, "utf-8");
    if (constantsContent.includes("export const DRUG_REGISTRY_ADDRESS")) {
      constantsContent = constantsContent.replace(
        /export const DRUG_REGISTRY_ADDRESS = ".*";/,
        `export const DRUG_REGISTRY_ADDRESS = "${address}";`
      );
    } else {
      constantsContent += `\nexport const DRUG_REGISTRY_ADDRESS = "${address}";\n`;
    }
  } else {
    constantsContent = `export const HORIZEN_EON_CHAIN_ID = 26514;
export const HORIZEN_EON_RPC = "https://eon-rpc.horizenlabs.io/ethv1";
export const ZKVERIFY_PROXY_HORIZEN = "0xCb47A3C3B9Eb2E549a3F2EA4729De28CafbB2b69";
export const ZKVERIFY_MAINNET_WS = "wss://mainnet.zkverify.io";
export const DRUG_REGISTRY_ADDRESS = "${address}";
`;
  }

  fs.writeFileSync(constantsPath, constantsContent);
  console.log("✅ Wrote deployed address to lib/constants.ts");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
