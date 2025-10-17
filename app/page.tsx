"use client";

import { useEffect } from 'react';
import { MiniKitProvider, useMiniKit } from '@coinbase/onchainkit/minikit';
import { baseSepolia } from 'wagmi/chains';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PuzzleGameContainer } from './components/puzzle/PuzzleGameContainer';
import { PuzzleGameProvider } from './context/PuzzleGameContext';

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

function MainApp() {
  const { setFrameReady } = useMiniKit();

  useEffect(() => {
    setFrameReady({ disableNativeGestures: true });
  }, [setFrameReady]);

  return (
    <PuzzleGameProvider>
      <PuzzleGameContainer />
    </PuzzleGameProvider>
  );
}

export default function App() {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
        loginMethods: ['wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#676FFF',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <MiniKitProvider
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY!}
            chain={baseSepolia}
            config={{ appearance: { theme: 'dark' } }}
          >
            <MainApp />
          </MiniKitProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}