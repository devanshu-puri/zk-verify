use std::hash::pedersen_hash;

fn main(
    // Public inputs (revealed on-chain, max 10)
    batch_id: pub Field,
    entity_id_hash: pub Field,
    prev_entity_id_hash: pub Field,
    handoff_timestamp: pub Field,
    batch_commitment: pub Field,
    chain_step: pub Field,
    is_valid_chain: pub Field,
    
    // Private inputs
    entity_secret: Field,
    batch_data: [Field; 8],
    prev_custodian_secret: Field
) {
    // 1. Assert entity_secret hashes to entity_id_hash
    let computed_entity_id_hash = pedersen_hash([entity_secret]);
    assert(computed_entity_id_hash == entity_id_hash);

    // 2. Assert prev_custodian_secret hashes to prev_entity_id_hash
    let computed_prev_entity_id_hash = pedersen_hash([prev_custodian_secret]);
    assert(computed_prev_entity_id_hash == prev_entity_id_hash);

    // 3. Assert batch_commitment is a valid Pedersen commitment of batch_data
    let computed_batch_commitment = pedersen_hash(batch_data);
    assert(computed_batch_commitment == batch_commitment);

    // 4. Assert chain_step is in range [0, 3]
    assert((chain_step == 0) | (chain_step == 1) | (chain_step == 2) | (chain_step == 3));

    // 5. Assert is_valid_chain == 1
    assert(is_valid_chain == 1);

    // 6. Assert handoff_timestamp > 0
    assert(handoff_timestamp as u64 > 0);
}
