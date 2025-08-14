import Confetti from 'react-confetti';
import { usePuzzleGameContext } from '@/app/context/PuzzleGameContext';
import { RewardTrack } from './RewardTrack';
import { PUZZLE_PATHS } from '@/app/utils/constants';
import { getButtonText } from '@/app/utils/puzzleHelpers';

export const CongratsScreen = () => {
  const {
    startPuzzleGame,
    isClaiming,
    hasClaimedForLevel,
    handleRewardClaim,
    playerLevel,
  } = usePuzzleGameContext();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 text-center overflow-hidden">
      {<Confetti recycle={false} numberOfPieces={200} />}
      <div className="max-w-md w-full bg-white/10 backdrop-blur-sm rounded-2xl p-6 z-10">
        <h1 className="text-3xl font-bold mb-3">🎉 Congratulations!</h1>
        <p className="text-lg mb-6">You solved the puzzle!</p>

        <img 
          src={PUZZLE_PATHS.COMPLETE}
          alt="Puzzle Solved" 
          className="w-full h-auto mb-6 rounded-lg border-2 border-white/20"
          loading='eager'
        />

        <div className="mb-6 sm:mb-8">
          <RewardTrack 
              playerLevel={playerLevel}
              onClaim={handleRewardClaim}
              isClaiming={isClaiming}
              hasClaimedForLevel={hasClaimedForLevel}
          />
        </div>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={startPuzzleGame}
            className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
          >
            {getButtonText(playerLevel)}
          </button>
        </div>
      </div>
    </div>
  );
};