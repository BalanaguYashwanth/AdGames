import { DndContext, closestCenter } from '@dnd-kit/core';
import { usePuzzleGameContext } from '@/app/context/PuzzleGameContext';
import { PuzzleBoard } from './PuzzleBoard';

export const PuzzleScreen = () => {
  const {
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    validatePuzzleCompletion
  } = usePuzzleGameContext();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex flex-col min-h-screen bg-gray-100 p-4">
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Swap the pieces here</h2>
          <PuzzleBoard />
          <button 
            onClick={validatePuzzleCompletion}
            className="mt-6 w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-semibold transition-colors"
          >
            Check My Puzzle
          </button>
        </div>
      </div>
    </DndContext>
  );
};