import React, { useEffect, useState } from 'react';
import { ClaimButton } from './ClaimButton';
import { getTargetProgressWidth } from '@/app/utils/puzzleHelpers';
import { RewardTrackProps } from '@/app/types/puzzle';

export const RewardTrack = ({
  playerLevel,
  onClaim,
  isClaiming,
  hasClaimedForLevel
}: RewardTrackProps) => {
  const [progressWidth, setProgressWidth] = useState('0%');

  useEffect(() => {
    const targetWidth = getTargetProgressWidth(playerLevel);
    setProgressWidth(targetWidth);
  }, [playerLevel]);

  const renderTrackItem = (level: number, rewardType: string, position: string) => (
    <div className={`absolute top-0 -translate-x-1/2 ${position}`}>
      {playerLevel >= level && (
        <div className="flex flex-col items-center gap-1">
          <ClaimButton
            level={level}
            rewardType={rewardType}
            playerLevel={playerLevel}
            isClaiming={isClaiming}
            hasClaimedForLevel={hasClaimedForLevel}
            onClaim={onClaim}
          />
          <span className="text-xs text-white/80">
            {level === 0 ? 'Easy' : level === 1 ? 'Medium' : 'Hard'}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full relative h-16 mb-2">
        {renderTrackItem(0, "NFT", "left-1/4")}
        {renderTrackItem(1, "NFT", "left-3/4")}
        {renderTrackItem(2, "0.01 BASE", "left-full")}
      </div>

      <div className="w-full relative h-4">
        <div className="w-full absolute top-1/2 -translate-y-1/2 bg-black/30 rounded-full h-2 sm:h-3">
          <div
            className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: progressWidth, transform: 'translateZ(0)' }}
          />
        </div>
        
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-full flex items-center pointer-events-none">
          {[
            { level: 0, position: 'left-1/4' }, 
            { level: 1, position: 'left-3/4' }, 
            { level: 2, position: 'left-full' }
          ].map(item => {
            const isUnlocked = playerLevel >= item.level;
            return (
              <div key={item.level} className={`absolute -translate-x-1/2 ${item.position}`}>
                  <div 
                      className={`
                          w-3 h-3 rounded-full border-2 transition-colors duration-500
                          ${isUnlocked ? 'bg-amber-500 border-white/80' : 'bg-black/40 border-white/30'}
                      `}
                  />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};