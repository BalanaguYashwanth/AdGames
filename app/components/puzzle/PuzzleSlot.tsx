import { useDroppable } from "@dnd-kit/core";
import { DraggablePiece } from "./DraggablePiece";
import { JigsawPiece } from "../../types/puzzle";
import { PUZZLE_CONFIG } from "@/app/utils/constants";
import { createPieceWrapperStyle, getPieceRowCol } from "@/app/utils/puzzleHelpers";

interface PuzzleSlotProps {
  slotId: number;
  index: number;
  placedPiece: JigsawPiece | null;
}

export const PuzzleSlot = ({ slotId, placedPiece }: PuzzleSlotProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: slotId });

  const { rowIndex, colIndex } = placedPiece 
    ? getPieceRowCol(placedPiece.id)
    : { rowIndex: 0, colIndex: 0 };

  const wrapperStyle = createPieceWrapperStyle(PUZZLE_CONFIG.PIECE_SIZE);

  return (
    <div
      ref={setNodeRef}
      style={{
        width: `${PUZZLE_CONFIG.PIECE_SIZE}px`,
        height: `${PUZZLE_CONFIG.PIECE_SIZE}px`
      }}
      className={`relative 
        ${isOver ? 'bg-green-900/50' : ''}
        ${!placedPiece ? 'border border-dashed border-gray-500/50' : 'border border-transparent'}
      `}
    >
      {placedPiece && 
       <div style={wrapperStyle}>
        <DraggablePiece 
          piece={placedPiece}
          rowIndex={rowIndex}
          colIndex={colIndex}
        />
        </div>
      }
    </div>
  );
};