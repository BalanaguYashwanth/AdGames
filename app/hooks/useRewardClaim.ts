import { useState } from 'react';
import { useSendTransaction } from 'wagmi';
import { useWalletOperations } from './useWalletOperations';
import { RewardClaimService } from '../services/rewardClaimService';

export const useRewardClaim = () => {
  const [isClaiming, setIsClaiming] = useState(false);
  const [hasClaimedForLevel, setHasClaimedForLevel] = useState(false);
  
  const { sendTransactionAsync } = useSendTransaction();
  const { prepareFarcasterWallet } = useWalletOperations();

  const executeRewardClaim = async (): Promise<string> => {
    setIsClaiming(true);
    setHasClaimedForLevel(false);
    
    try {
      const walletInfo = await prepareFarcasterWallet();
      const transactionData = await RewardClaimService.prepareClaimTransaction(walletInfo.address);
      const txHash = await RewardClaimService.executeClaimTransaction(sendTransactionAsync, transactionData);
      
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