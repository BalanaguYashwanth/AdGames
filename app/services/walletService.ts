import { baseSepolia } from 'wagmi/chains';
import { EthereumProvider, FarcasterWallet, WalletInfo } from '../types/puzzle';

export class WalletService {
  static async findFarcasterWallet(wallets: FarcasterWallet[]): Promise<FarcasterWallet> {
    const farcasterWallet = wallets.find((wallet) => wallet.walletClientType === "farcaster");
    if (!farcasterWallet) {
      throw new Error("Farcaster wallet not found. Please open inside Farcaster.");
    }

    return farcasterWallet;
  }

  static async getWalletProvider(wallet: FarcasterWallet): Promise<{provider: EthereumProvider; chainId: string;}> {
    const provider = await wallet.getEthereumProvider();  

    const chainId = await provider.request({ method: 'eth_chainId' }) as string;
    
    return { provider, chainId };
  }

  static async ensureCorrectNetwork(provider: EthereumProvider, chainId: string): Promise<void> {
    if (parseInt(chainId, 16) !== baseSepolia.id) {
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${baseSepolia.id.toString(16)}` }]
        });
      } catch (switchErr) {
        console.error("Chain switch failed:", switchErr);
        throw new Error("Please manually switch your network to Base Sepolia.");
      }
    }
  }

  static extractWalletInfo(wallet: FarcasterWallet): WalletInfo {
    return {
      address: wallet.address,
      provider: null,
    };
  }
}