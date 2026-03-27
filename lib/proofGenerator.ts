import { Noir } from '@noir-lang/noir_js';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';

// This file path will exist after running `nargo compile` in circuits/custody_proof
import circuit from '../circuits/custody_proof/target/custody_proof.json';

export async function generateCustodyProof(inputs: any) {
  // @ts-ignore
  const backend = new BarretenbergBackend(circuit);
  // @ts-ignore
  const noir = new Noir(circuit);

  // Diagnostic logging
  console.log("Proof Generator Inputs:", {
    batch_id: inputs.batch_id,
    entity_id_hash: inputs.entity_id_hash,
    prev_entity_id_hash: inputs.prev_entity_id_hash,
    handoff_timestamp: inputs.handoff_timestamp,
    batch_commitment: inputs.batch_commitment,
    chain_step: inputs.chain_step,
    is_valid_chain: inputs.is_valid_chain,
    entity_secret: inputs.entity_secret,
    batch_data: inputs.batch_data,
    prev_custodian_secret: inputs.prev_custodian_secret
  });

  // Note: in browser environment, @noir-lang handles WASM init automatically
  const witness = await noir.execute(inputs);
  
  const proofPayload = await backend.generateProof(witness.witness);
  
  // zkverify handles proof byte verification using the verification key
  // BarretenbergBackend exposes getVerificationKey
  // The vk needs to be returned to submit to zkVerify
  const vkey = await backend.getVerificationKey();

  return {
    proof: proofPayload.proof, 
    publicInputs: proofPayload.publicInputs, 
    vk: vkey
  };
}
