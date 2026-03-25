import { Noir } from '@noir-lang/noir_js';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';

// This file path will exist after running `nargo compile` in circuits/custody_proof
import circuit from '../circuits/custody_proof/target/custody_proof.json';

export async function generateCustodyProof(inputs: any) {
  // @ts-ignore
  const backend = new BarretenbergBackend(circuit);
  // @ts-ignore
  const noir = new Noir(circuit);

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
