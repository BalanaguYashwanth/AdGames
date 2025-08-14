import { useState } from 'react';
import { useSensors, useSensor, PointerSensor, TouchSensor, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { JigsawPiece } from '../types/puzzle';
import { DRAG_ACTIVATION } from '../utils/constants';
import { findPieceSlotIndex } from '../utils/puzzleHelpers';

interface UsePuzzleDragAndDropProps {
  boardSlots: (JigsawPiece | null)[];
  onPieceDrop: (sourceSlotId: number, targetSlotId: number) => void;
}

export const usePuzzleDragAndDrop = ({ boardSlots, onPieceDrop }: UsePuzzleDragAndDropProps) => {
  const [activePiece, setActivePiece] = useState<JigsawPiece | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: DRAG_ACTIVATION.TOUCH_DELAY,
        tolerance: DRAG_ACTIVATION.TOUCH_TOLERANCE,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const piece = boardSlots.find(p => p?.id === event.active.id) || null;
    setActivePiece(piece);
  };

  const handleDragCancel = () => setActivePiece(null);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    handleDragCancel();
    if (!over) return;
    
    const sourcePieceId = active.id as number;
    const targetSlotId = over.id as number;

    const sourceSlotIndex = findPieceSlotIndex(boardSlots, sourcePieceId);
    if (sourceSlotIndex === -1 || sourceSlotIndex + 1 === targetSlotId) return;

    onPieceDrop(sourcePieceId, targetSlotId);
  };

  return {
    sensors,
    activePiece,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
};