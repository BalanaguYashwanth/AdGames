import { usePrivy } from '@privy-io/react-auth';
import { usePuzzleGameContext } from '@/app/context/PuzzleGameContext';
import { WalletConnectButton } from '../ui/WalletConnectButton';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { PUZZLE_PATHS } from '../../utils/constants';

export const PreviewScreen = () => {
  const { startPuzzleGame, isLoadingLevel } = usePuzzleGameContext();
  const { authenticated } = usePrivy();

  const isWalletConnected = authenticated;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center relative">
      <WalletConnectButton />

      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Jigsaw Puzzle Challenge</h1>
        <p className="text-gray-600 mb-6">Complete the puzzle to win an exclusive NFT!</p>
        <img 
          src={PUZZLE_PATHS.PREVIEW}
          alt="Puzzle Preview" 
          className="w-full h-auto mb-6 rounded-lg border-2 border-gray-200"
        />
        <button 
          onClick={startPuzzleGame}
          disabled={!isWalletConnected || isLoadingLevel}
          className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${
            !isWalletConnected
              ? "bg-gray-400 cursor-not-allowed"
              : isLoadingLevel
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {!isWalletConnected
            ? "Connect Wallet to Start"
            : isLoadingLevel
              ? <LoadingSpinner />
              : "Start Puzzle"}  
        </button>
      </div>
    </div>
  );
};