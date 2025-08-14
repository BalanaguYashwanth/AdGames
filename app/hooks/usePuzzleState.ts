import { useReducer } from 'react';
import { puzzleStateReducer, createInitialPuzzleState } from '../reducers/puzzleReducer';
import { createPuzzleBoardSlots } from '../utils/puzzleHelpers';

export const usePuzzleState = () => {
  const [puzzleState, dispatch] = useReducer(puzzleStateReducer, createInitialPuzzleState());

  const puzzleBoardSlots = createPuzzleBoardSlots();

  const dropPiece = (sourceSlotId: number, targetSlotId: number) => {
    dispatch({
      type: 'DROP_PIECE',
      payload: { sourceSlotId, targetSlotId },
    });
  };

  const resetPuzzle = () => {
    dispatch({ type: 'RESET_PUZZLE' });
  };

  return {
    puzzleState,
    puzzleBoardSlots,
    dropPiece,
    resetPuzzle
  };
};