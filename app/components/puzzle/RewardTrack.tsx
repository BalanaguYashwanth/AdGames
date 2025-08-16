import React, { useEffect, useState } from 'react';
import { RewardLabel } from './RewardLabel';
import { RewardMarker } from './RewardMarker';
import { ProgressBar } from './ProgressBar';
import { rewards } from '@/app/utils/constants';
import { getTargetProgressWidth } from '@/app/utils/puzzleHelpers';
import { RewardTrackProps } from '@/app/types/puzzle';

export const RewardTrack = ({ playerLevel }: RewardTrackProps) => {
  const [progressWidth, setProgressWidth] = useState('0%');
  
  useEffect(() => {
    const prevWidth = getTargetProgressWidth(playerLevel - 1);
    setProgressWidth(prevWidth);

    const timeout = setTimeout(() => {
      const targetWidth = getTargetProgressWidth(playerLevel);
      setProgressWidth(targetWidth);
    }, 200);
    return () => clearTimeout(timeout);
  }, [playerLevel]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full relative mb-4" style={{ height: '3.5rem' }}>
        <div className="relative w-full h-8 mb-2">
          {rewards.map((item) => (
            <RewardLabel
              key={item.level}
              label={item.label}
              position={item.position}
              isUnlocked={playerLevel >= item.level}
            />
          ))}
        </div>

        <div className="w-full relative bg-black/30 rounded-full h-2">
          <ProgressBar width={progressWidth} />
          {rewards.map((item) => (
            <RewardMarker
              key={item.level}
              position={item.position}
              isUnlocked={playerLevel >= item.level}
            />
          ))}
        </div>
      </div>
    </div>
  );
};