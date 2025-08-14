import React from 'react';
import { ProgressBarProps } from '@/app/types/puzzle';

export const ProgressBar = ({ width }: ProgressBarProps) => (
  <div
    className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full rounded-full transition-all duration-[4000ms] ease-out"
    style={{ width }}
  />
);