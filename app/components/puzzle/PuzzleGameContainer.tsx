'use client';

import { usePuzzleGameContext } from '@/app/context/PuzzleGameContext';
import { PreviewScreen } from './PreviewScreen';
import { PuzzleScreen } from './PuzzleScreen';
import { CongratsScreen } from './CongratsScreen';
import { CompletedScreen } from './CompletedScreen';

export const PuzzleGameContainer = () => {
  const { currentScreen } = usePuzzleGameContext();

  if (currentScreen === 'preview') return <PreviewScreen />;

  if (currentScreen === 'puzzle') return <PuzzleScreen />

  if (currentScreen === 'congrats') return <CongratsScreen />

  if (currentScreen === 'completed') return <CompletedScreen />

  return null;
};