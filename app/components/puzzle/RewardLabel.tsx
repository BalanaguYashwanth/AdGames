import React from 'react';
import { RewardLabelProps } from '@/app/types/puzzle';

export const RewardLabel = ({ label, position, isUnlocked }: RewardLabelProps) => (
  <div
    className="absolute -translate-x-1/2 flex flex-col items-center"
    style={{ left: position, bottom: 0 }}
  >
    {isUnlocked && <span className="text-lg text-yellow-400 mb-1">✓</span>}
    <span
      className={`text-xs font-medium ${
        isUnlocked ? 'text-white' : 'text-white/50'
      }`}
    >
      {label}
    </span>
  </div>
);