// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IZkVerify {
    function verifyProofAttestation(
        uint256 aggregationId,
        bytes32 leafDigest,
        bytes32[] calldata merklePath,
        bool[] calldata leafSide
    ) external view returns (bool);
}

contract DrugChainRegistry {
    address public owner;
    IZkVerify public zkVerifyProxy;

    struct Entity {
        bytes32 entityIdHash;
        string name;
        uint8 entityType; // 0=manufacturer, 1=distributor, 2=wholesaler, 3=pharmacy
        bool isActive;
        address wallet;
    }

    struct Batch {
        bytes32 batchId;
        bytes32 manufacturerEntityHash;
        string drugName;
        string batchNumber;
        uint256 manufactureDate;
        uint256 expiryDate;
        bool isActive;
    }

    struct CustodyRecord {
        bytes32 fromEntityHash;
        bytes32 toEntityHash;
        bytes32 batchId;
        bytes32 zkProofLeafDigest;   // from zkVerify
        bytes32 batchCommitment;     // from ZK public inputs
        uint8 chainStep;
        uint256 timestamp;
        bool zkVerified;
    }

    mapping(bytes32 => Entity) public entities;
    mapping(bytes32 => Batch) public batches;
    mapping(bytes32 => CustodyRecord[]) public custodyChain;
    mapping(bytes32 => bool) public verifiedProofs;

    mapping(address => bytes32) public walletToEntity;

    event EntityRegistered(bytes32 indexed entityIdHash, string name, uint8 entityType, address wallet);
    event BatchRegistered(bytes32 indexed batchId, bytes32 manufacturerHash, string drugName);
    event CustodyTransferred(bytes32 indexed batchId, bytes32 from, bytes32 to, uint8 chainStep);
    event CustodyVerified(bytes32 indexed batchId, bytes32 zkProofLeafDigest, uint8 chainStep);
    event BatchFlaggedSuspicious(bytes32 indexed batchId, string reason);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyRegisteredEntity() {
        bytes32 entityIdHash = walletToEntity[msg.sender];
        require(entities[entityIdHash].isActive, "Caller is not an active entity");
        _;
    }

    constructor(address _zkVerifyProxy) {
        owner = msg.sender;
        zkVerifyProxy = IZkVerify(_zkVerifyProxy);
    }

    // Owner registers an entity and sets their wallet address
    function registerEntity(bytes32 entityIdHash, string calldata name, uint8 entityType, address wallet) external onlyOwner {
        require(!entities[entityIdHash].isActive, "Entity already registered");
        require(entityType <= 3, "Invalid entity type");
        require(wallet != address(0), "Invalid wallet address");
        require(walletToEntity[wallet] == bytes32(0), "Wallet already linked to an entity");

        entities[entityIdHash] = Entity({
            entityIdHash: entityIdHash,
            name: name,
            entityType: entityType,
            isActive: true,
            wallet: wallet
        });

        walletToEntity[wallet] = entityIdHash;

        emit EntityRegistered(entityIdHash, name, entityType, wallet);
    }

    // Manufacturer registers a new batch
    function registerBatch(bytes32 batchId, string calldata drugName, string calldata batchNumber, uint256 expiryDate) external onlyRegisteredEntity {
        bytes32 entityIdHash = walletToEntity[msg.sender];
        require(entities[entityIdHash].entityType == 0, "Only manufacturers can register batches");
        require(!batches[batchId].isActive, "Batch already active");

        batches[batchId] = Batch({
            batchId: batchId,
            manufacturerEntityHash: entityIdHash,
            drugName: drugName,
            batchNumber: batchNumber,
            manufactureDate: block.timestamp,
            expiryDate: expiryDate,
            isActive: true
        });

        emit BatchRegistered(batchId, entityIdHash, drugName);
    }

    // Custodian records transfer, verifying Noir proof on Horizen EON via zkVerify proxy
    function recordCustodyTransfer(
        bytes32 batchId,
        bytes32 toEntityHash,
        bytes32 zkProofLeafDigest,
        bytes32 batchCommitment,
        uint8 chainStep,
        uint256 aggregationId,
        bytes32[] calldata merklePath,
        bool[] calldata leafSide
    ) external onlyRegisteredEntity {
        require(batches[batchId].isActive, "Batch not active");
        require(entities[toEntityHash].isActive, "Receiving entity not active");
        require(!verifiedProofs[zkProofLeafDigest], "Proof already used");

        // Verify attestation via ZkVerify Proxy
        bool isValid = zkVerifyProxy.verifyProofAttestation(
            aggregationId,
            zkProofLeafDigest,
            merklePath,
            leafSide
        );
        require(isValid, "ZK Proof Attestation failed");

        bytes32 fromEntityHash = walletToEntity[msg.sender];
        
        uint256 chainLength = custodyChain[batchId].length;
        if (chainLength > 0) {
            CustodyRecord memory lastRecord = custodyChain[batchId][chainLength - 1];
            require(lastRecord.toEntityHash == fromEntityHash, "Not the current custodian");
            require(chainStep > lastRecord.chainStep, "Invalid chain step progression");
        } else {
            require(batches[batchId].manufacturerEntityHash == fromEntityHash, "First transfer must be from manufacturer");
        }

        CustodyRecord memory record = CustodyRecord({
            fromEntityHash: fromEntityHash,
            toEntityHash: toEntityHash,
            batchId: batchId,
            zkProofLeafDigest: zkProofLeafDigest,
            batchCommitment: batchCommitment,
            chainStep: chainStep,
            timestamp: block.timestamp,
            zkVerified: true
        });

        custodyChain[batchId].push(record);
        verifiedProofs[zkProofLeafDigest] = true;

        emit CustodyTransferred(batchId, fromEntityHash, toEntityHash, chainStep);
        emit CustodyVerified(batchId, zkProofLeafDigest, chainStep);
    }

    // View full custody list
    function getFullCustodyChain(bytes32 batchId) external view returns (CustodyRecord[] memory) {
        return custodyChain[batchId];
    }

    // Verify batch at pharmacy
    function verifyBatchAtPharmacy(bytes32 batchId) external view returns (bool isAuthentic, uint256 chainLength, uint256 lastVerifiedTimestamp) {
        require(batches[batchId].isActive, "Batch not found/active");

        CustodyRecord[] memory chain = custodyChain[batchId];
        chainLength = chain.length;

        if (chainLength == 0) {
            return (false, 0, 0);
        }

        CustodyRecord memory lastRecord = chain[chainLength - 1];
        lastVerifiedTimestamp = lastRecord.timestamp;

        bool endsAtPharmacy = entities[lastRecord.toEntityHash].entityType == 3;
        isAuthentic = endsAtPharmacy && lastRecord.zkVerified;
    }
}
