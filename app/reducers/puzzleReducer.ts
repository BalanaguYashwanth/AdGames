import { PuzzleState, PuzzleAction } from '../types/puzzle';
import { createShuffledPuzzlePieces, isValidSlotTransition } from '../utils/puzzleHelpers';

export const createInitialPuzzleState = (): PuzzleState => ({ 
  boardSlots: createShuffledPuzzlePieces() 
});

export const puzzleStateReducer = (state: PuzzleState, action: PuzzleAction): PuzzleState => {
  switch (action.type) {
    case 'DROP_PIECE': {
      return handlePieceDropAction(state, action.payload);
    }
    case 'RESET_PUZZLE': {
      return handlePuzzleResetAction();
    }
    default:
      return state;
  }
};

const handlePieceDropAction = (
  state: PuzzleState, 
  payload: { targetSlotId: number; sourceSlotId: number }
): PuzzleState => {
  const { targetSlotId, sourceSlotId } = payload;
  const newBoardSlots = [...state.boardSlots];
  
  const sourceIndex = newBoardSlots.findIndex(piece => piece?.id === sourceSlotId);
  const targetIndex = targetSlotId - 1;

  if (
    !isValidSlotTransition(sourceIndex, targetIndex, newBoardSlots.length) || 
    sourceIndex + 1 === targetSlotId
  ) {
    return state;
  }

  const sourcePiece = newBoardSlots[sourceIndex];
  const targetPiece = newBoardSlots[targetIndex];

  newBoardSlots[targetIndex] = sourcePiece;
  newBoardSlots[sourceIndex] = targetPiece;

  return { ...state, boardSlots: newBoardSlots };
};

const handlePuzzleResetAction = (): PuzzleState => ({
  boardSlots: createShuffledPuzzlePieces(),
});