import React from 'react';
import { ClaimButtonProps } from '@/app/types/puzzle';

export const ClaimButton: React.FC<ClaimButtonProps> = ({
  level,
  rewardType,
  playerLevel,
  isClaiming,
  hasClaimedForLevel,
  onClaim
}) => {
  const isCurrentLevel = playerLevel === level;
  const isClaimable = isCurrentLevel && !hasClaimedForLevel && !isClaiming;
  
  return (
    <button
      onClick={onClaim}
      disabled={!isClaimable}
      className={`
        px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-gray-900 
        transition-all duration-300 transform text-sm sm:text-base
        ${isClaimable ? 
          'bg-yellow-400 hover:bg-yellow-500 scale-105 sm:scale-110 shadow-md' : 
          hasClaimedForLevel ? 
            'bg-green-400 hover:bg-green-500' : 
            'bg-gray-400 text-gray-600'
        }
        ${isClaiming ? 'animate-pulse' : ''}
      `}
    >
      {isClaiming ? 'Claiming...' : 
       hasClaimedForLevel ? '✓ Claimed' : 
       `Claim ${rewardType.split(' ')[0]}`}
      {rewardType.includes(' ') && <br className="sm:hidden" />}
      {rewardType.includes(' ') && <span className="text-xs sm:text-base"> {rewardType.split(' ')[1]}</span>}
    </button>
  );
};