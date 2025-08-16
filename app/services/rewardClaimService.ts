import { ClaimTransactionData, SendTransaction } from '../types/puzzle';

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

  static async executeClaimTransaction(
    sendTransactionAsync: SendTransaction,
    transactionData: ClaimTransactionData
  ): Promise<string> {
    const txParams = transactionData.params[0];

    try {
      const txHash = await sendTransactionAsync({
        to: txParams.to,
        data: txParams.data,
        value: BigInt(txParams.value || '0'),
      });
      
      return txHash;
    } catch (error) {
      console.error("Failed to send transaction:", error);
      throw new Error("Transaction execution failed");
    }
  }
}