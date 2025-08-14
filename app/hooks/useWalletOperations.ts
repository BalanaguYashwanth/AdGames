import { useWallets } from '@privy-io/react-auth';
import { WalletService } from '../services/walletService';

export const useWalletOperations = () => {
  const { wallets } = useWallets();

  const prepareFarcasterWallet = async () => {
    const wallet = await WalletService.findFarcasterWallet(wallets);
    const { provider, chainId } = await WalletService.getWalletProvider(wallet);
    
    await WalletService.ensureCorrectNetwork(provider, chainId);

    return WalletService.extractWalletInfo(wallet);
  };

  return {
    prepareFarcasterWallet,
  };
};