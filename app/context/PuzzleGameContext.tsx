import { createContext, useContext } from 'react';
import { usePuzzleGame } from '../hooks/usePuzzleGame';
import { PuzzleGameContextType } from '../types/puzzle';

const PuzzleGameContext = createContext<PuzzleGameContextType | null>(null);

export const PuzzleGameProvider = ({ children }: { children: React.ReactNode }) => {
  const game = usePuzzleGame();
  return (
    <PuzzleGameContext.Provider value={game}>
      {children}
    </PuzzleGameContext.Provider>
  );
};

export const usePuzzleGameContext = () => {
  const context = useContext(PuzzleGameContext);
  if (!context) {
    throw new Error('usePuzzleGameContext must be used within a PuzzleGameProvider');
  }
  return context;
} 