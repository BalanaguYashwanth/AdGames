import { useState } from 'react';
import Confetti from 'react-confetti';
import { usePuzzleGameContext } from '@/app/context/PuzzleGameContext';
import { RewardTrack } from './RewardTrack';
import { GOOGLE_FORM, PUZZLE_PATHS } from '@/app/utils/constants';
import { getButtonText } from '@/app/utils/puzzleHelpers';

export const CongratsScreen = () => {
  const {
    startPuzzleGame,
    isClaiming,
    hasClaimedForLevel,
    handleRewardClaim,
    playerLevel
  } = usePuzzleGameContext();

  const [completedLevel] = useState(hasClaimedForLevel ? playerLevel - 1 : playerLevel);

  const handlePartnerClick = () => {
    window.open(GOOGLE_FORM.LINK, '_blank');
  }

  const buttonLevel = hasClaimedForLevel ? playerLevel : completedLevel;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 text-center overflow-hidden">
      {<Confetti recycle={false} numberOfPieces={200} />}

      <button
        onClick={handlePartnerClick}
        className="fixed sm:absolute top-4 right-4 sm:top-6 sm:right-6 py-2 px-3 sm:px-4 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors z-20 text-sm sm:text-base"
      >
        Partner With Us
      </button>

      <div className="max-w-md w-full bg-white/10 backdrop-blur-sm rounded-2xl p-6 z-10">
        <h1 className="text-3xl font-bold mb-3">🎉 Congratulations!</h1>
        <p className="text-lg mb-6">You solved the puzzle!</p>

        <img 
          src={PUZZLE_PATHS.LEVELS[completedLevel] ?? PUZZLE_PATHS.LEVELS[0]}
          alt="Puzzle Solved" 
          className="w-full h-auto mb-6 rounded-lg border-2 border-white/20"
          loading='eager'
        />

        <div className="mb-4">
          {!hasClaimedForLevel ? (
            <button
              onClick={handleRewardClaim}
              disabled={isClaiming}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-semibold transition-colors"
            >
              {isClaiming ? 'Claiming...' : 'Claim Rewards'}
            </button>
          ) : (
            <RewardTrack playerLevel={playerLevel} />
          )}
        </div>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={startPuzzleGame}
            className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
          >
            {getButtonText(buttonLevel)}
          </button>
        </div>
      </div>
    </div>
  );
};