import { useDraggable } from "@dnd-kit/core";
import { JigsawPiece } from "../../types/puzzle";
import { SvgJigsawPiece } from "./SvgJigsawPiece";

interface DraggablePieceProps {
  piece: JigsawPiece;
  rowIndex: number;
  colIndex: number;
}

export const DraggablePiece = ({ piece, rowIndex, colIndex }: DraggablePieceProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: piece.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        zIndex: transform ? 100 : undefined,
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none',
      }}
      {...listeners}
      {...attributes}
      className="w-full h-full cursor-grab active:cursor-grabbing"
    >
      <SvgJigsawPiece
        piece={piece}
        rowIndex={rowIndex}
        colIndex={colIndex}
      />
    </div>
  );
};