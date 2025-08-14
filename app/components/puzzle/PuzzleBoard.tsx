import { useMemo } from 'react';
import { DragOverlay } from '@dnd-kit/core';
import { usePuzzleGameContext } from '@/app/context/PuzzleGameContext';
import { PuzzleSlot } from './PuzzleSlot';
import { SvgJigsawPiece } from './SvgJigsawPiece';
import { PUZZLE_CONFIG, PUZZLE_DIMENSIONS } from '../../utils/constants';
import { createActivePieceDetails } from '@/app/utils/puzzleHelpers';

export const PuzzleBoard = () => {
  const {
    puzzleState,
    puzzleBoardSlots,
    activePiece
  } = usePuzzleGameContext();
  
  const activePieceDetails = useMemo(() => 
    createActivePieceDetails(activePiece, puzzleState.boardSlots),
    [activePiece, puzzleState.boardSlots]
  );

  return (
    <>
      <div
        className="bg-white rounded-xl shadow-md mb-6 relative overflow-hidden"
        style={{
          width: PUZZLE_DIMENSIONS.TOTAL_BOARD_SIZE,
          height: PUZZLE_DIMENSIONS.TOTAL_BOARD_SIZE,
          padding: PUZZLE_DIMENSIONS.TAB_HEIGHT
        }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${PUZZLE_CONFIG.GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${PUZZLE_CONFIG.GRID_SIZE}, 1fr)`,
            gap: '0px',
            width: PUZZLE_DIMENSIONS.BOARD_GRID_SIZE,
            height: PUZZLE_DIMENSIONS.BOARD_GRID_SIZE,
          }}
        >
          {puzzleBoardSlots.map((slotId, index) => (
            <PuzzleSlot
              key={slotId}
              slotId={slotId}
              index={index}
              placedPiece={puzzleState.boardSlots[index]}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activePieceDetails ? (
          <SvgJigsawPiece
            piece={activePieceDetails.piece}
            rowIndex={activePieceDetails.rowIndex}
            colIndex={activePieceDetails.colIndex}
          />
        ) : null}
      </DragOverlay>
    </>
  );
};