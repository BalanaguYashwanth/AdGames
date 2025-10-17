import { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { RewardClaimService } from '../services/rewardClaimService';
import { baseSepolia } from 'viem/chains';

export const useRewardClaim = () => {
  const [isClaiming, setIsClaiming] = useState(false);
  const [hasClaimedForLevel, setHasClaimedForLevel] = useState(false);
  
  const { sendTransaction } = usePrivy(); 
  const { wallets } = useWallets();

  const executeRewardClaim = async (playerLevel: number): Promise<string> => {
    setIsClaiming(true);
    setHasClaimedForLevel(false);

    try {
      const connectedWallet = wallets[0];
      if (!connectedWallet) {
          throw new Error('Wallet not connected or address not found.');
      }
        
      const transactionData = await RewardClaimService.prepareClaimTransaction(
        connectedWallet.address,
        playerLevel
      );
      const txParams = transactionData.params[0];

      const txReceipt = await sendTransaction(
        {
          to: txParams.to,
          data: txParams.data,
          value: BigInt(txParams.value || '0'),
          chainId: baseSepolia.id,
        },
        {
          address: connectedWallet.address,
        }
      );
      const txHash = txReceipt.hash;
      
      setHasClaimedForLevel(true);
      return txHash;

    } catch (error) {
      console.error("Minting process failed:", error);
      throw error;
    } finally {
      setIsClaiming(false);
    }
  };

  const resetClaimStatus = () => setHasClaimedForLevel(false);

  return {
    isClaiming,
    hasClaimedForLevel,
    executeRewardClaim,
    resetClaimStatus,
  };
};