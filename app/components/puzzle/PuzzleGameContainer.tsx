'use client';

import { usePuzzleGameContext } from '@/app/context/PuzzleGameContext';
import { PreviewScreen } from './PreviewScreen';
import { PuzzleScreen } from './PuzzleScreen';
import { CongratsScreen } from './CongratsScreen';

export const PuzzleGameContainer = () => {
  const { currentScreen } = usePuzzleGameContext();

  if (currentScreen === 'preview') return <PreviewScreen />;

  if (currentScreen === 'puzzle') return <PuzzleScreen />

  if (currentScreen === 'congrats') return <CongratsScreen />

  return null;
};