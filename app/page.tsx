"use client";

import { useEffect } from 'react';
import { MiniKitProvider, useMiniKit } from '@coinbase/onchainkit/minikit';
import { baseSepolia } from 'wagmi/chains';
import { PrivyProvider } from '@privy-io/react-auth';
import { PuzzleGameContainer } from './components/puzzle/PuzzleGameContainer';
import { PuzzleGameProvider } from './context/PuzzleGameContext';

function MainApp() {
  const { setFrameReady } = useMiniKit();

  useEffect(() => {
    setFrameReady({ disableNativeGestures: true });
  }, [setFrameReady]);

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
        loginMethods: ['wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#676FFF'
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        }
      }}
    >
      <PuzzleGameProvider>
        <PuzzleGameContainer />
      </PuzzleGameProvider>
    </PrivyProvider>
  );
}

export default function App() {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY!}
      chain={baseSepolia}
      config={{ appearance: { theme: 'dark' } }}
    >
      <MainApp />
    </MiniKitProvider>
  );
}
