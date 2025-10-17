import { ClaimTransactionData } from '../types/puzzle';

export class RewardClaimService {
  static async prepareClaimTransaction(userAddress: string, playerLevel: number): Promise<ClaimTransactionData> {
    const response = await fetch("/api/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        untrustedData: { 
          address: userAddress,
          level: playerLevel
        } 
      }),
    });

    const transactionData = await response.json();

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${errorText}`);
    }

    return transactionData;
  }
}