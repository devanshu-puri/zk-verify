import { zkVerifySession, ZkVerifyEvents } from "zkverifyjs";

export async function submitCustodyProof(
  proof: Uint8Array,
  publicInputs: string[],
  verificationKey: Uint8Array
): Promise<{ leafDigest: string; aggregationId: number }> {
    // @ts-ignore - Assuming browser wallet injected via window.ethereum
    const session = await zkVerifySession.start().Mainnet().withWallet(window.ethereum);
    
    const { events, transactionResult } = await session
      .verify()
      .ultraHonk()
      .execute(proof, publicInputs, verificationKey);
  
    return new Promise((resolve, reject) => {
      events.on(ZkVerifyEvents.ProofVerified, (data: any) => {
        resolve({
          leafDigest: data.statement,
          aggregationId: data.aggregationId,
        });
      });
      events.on(ZkVerifyEvents.ErrorEvent, reject);
    });
}
