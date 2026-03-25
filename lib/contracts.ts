import { ethers } from "ethers";
import { DRUG_REGISTRY_ADDRESS, HORIZEN_EON_RPC } from "./constants";

export const DRUG_REGISTRY_ABI = [
  "function registerEntity(bytes32 entityIdHash, string calldata name, uint8 entityType, address wallet) external",
  "function registerBatch(bytes32 batchId, string calldata drugName, string calldata batchNumber, uint256 expiryDate) external",
  "function recordCustodyTransfer(bytes32 batchId, bytes32 toEntityHash, bytes32 zkProofLeafDigest, bytes32 batchCommitment, uint8 chainStep, uint256 aggregationId, bytes32[] calldata merklePath, bool[] calldata leafSide) external",
  "function getFullCustodyChain(bytes32 batchId) external view returns (tuple(bytes32 fromEntityHash, bytes32 toEntityHash, bytes32 batchId, bytes32 zkProofLeafDigest, bytes32 batchCommitment, uint8 chainStep, uint256 timestamp, bool zkVerified)[])",
  "function verifyBatchAtPharmacy(bytes32 batchId) external view returns (bool isAuthentic, uint256 chainLength, uint256 lastVerifiedTimestamp)",
  "function entities(bytes32) external view returns (bytes32 entityIdHash, string name, uint8 entityType, bool isActive, address wallet)",
  "function batches(bytes32) external view returns (bytes32 batchId, bytes32 manufacturerEntityHash, string drugName, string batchNumber, uint256 manufactureDate, uint256 expiryDate, bool isActive)",
  "function walletToEntity(address) external view returns (bytes32)",
  "event EntityRegistered(bytes32 indexed entityIdHash, string name, uint8 entityType, address wallet)",
  "event BatchRegistered(bytes32 indexed batchId, bytes32 manufacturerHash, string drugName)",
  "event CustodyTransferred(bytes32 indexed batchId, bytes32 from, bytes32 to, uint8 chainStep)",
  "event CustodyVerified(bytes32 indexed batchId, bytes32 zkProofLeafDigest, uint8 chainStep)"
];

const getValidRegistryAddress = () => {
  const envAddr = process.env.NEXT_PUBLIC_DRUG_REGISTRY_ADDRESS?.trim();
  const fallback = DRUG_REGISTRY_ADDRESS?.trim();
  const addr = envAddr || fallback;
  
  if (!addr || !ethers.isAddress(addr)) {
    console.warn("Invalid or missing DRUG_REGISTRY_ADDRESS. Falling back to zero address to prevent ENS resolution errors.");
    return ethers.ZeroAddress;
  }
  return addr;
};

export async function getRegistryContract(providerOrSigner: ethers.Provider | ethers.Signer) {
  return new ethers.Contract(getValidRegistryAddress(), DRUG_REGISTRY_ABI, providerOrSigner);
}

export function getReadOnlyRegistryContract() {
  const provider = new ethers.JsonRpcProvider(HORIZEN_EON_RPC, undefined, { staticNetwork: true });
  return new ethers.Contract(getValidRegistryAddress(), DRUG_REGISTRY_ABI, provider);
}
