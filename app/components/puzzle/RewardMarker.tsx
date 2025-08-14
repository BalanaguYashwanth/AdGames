import React from 'react';
import { RewardMarkerProps } from '@/app/types/puzzle';

export const RewardMarker = ({ position, isUnlocked }: RewardMarkerProps) => (
  <div
    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
    style={{ left: position }}
  >
    <div
      className={`w-2.5 h-2.5 rounded-full ${
        isUnlocked ? 'bg-yellow-400' : 'bg-white/50'
      } border border-white`}
    />
  </div>
);