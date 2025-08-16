import { JigsawPiece, EdgeType } from '../types/puzzle';
import { PUZZLE_CONFIG, PIECE_COUNT, PUZZLE_DIMENSIONS, FIREBASE_DB_API } from './constants';

const getInverseEdge = (edge: EdgeType): EdgeType => {
  if (edge === 'tab') return 'blank';
  if (edge === 'blank') return 'tab';
  return 'flat';
};

const getRandomInnerEdge = (): EdgeType => {
  return Math.random() > 0.5 ? 'tab' : 'blank';
};

export const createShuffledPuzzlePieces = (): JigsawPiece[] => {
  const pieces: JigsawPiece[] = [];
  const { GRID_SIZE } = PUZZLE_CONFIG;

  const edgeMap = new Map<string, EdgeType>();
  for (let i = 0; i < PIECE_COUNT; i++) {
    const row = Math.floor(i / GRID_SIZE);
    const col = i % GRID_SIZE;

    // Top Edge: If not the first row, it's the inverse of the piece above's bottom edge.
    const top = row === 0 
      ? 'flat' 
      : getInverseEdge(edgeMap.get(`b${row - 1}-c${col}`)!);

    // Left Edge: If not the first column, it's the inverse of the piece to the left's right edge.
    const left = col === 0
      ? 'flat'
      : getInverseEdge(edgeMap.get(`r${row}-c${col - 1}`)!);

    // Right Edge: If not the last column, generate a random shape and store it.
    const right = col === GRID_SIZE - 1
      ? 'flat'
      : getRandomInnerEdge();
    if (right !== 'flat') {
      edgeMap.set(`r${row}-c${col}`, right);
    }

    // Bottom Edge: If not the last row, generate a random shape and store it.
    const bottom = row === GRID_SIZE - 1
      ? 'flat'
      : getRandomInnerEdge();
    if (bottom !== 'flat') {
        edgeMap.set(`b${row}-c${col}`, bottom);
    }
    
    pieces.push({
      id: i + 1,
      top,
      right,
      bottom,
      left,
    });
  }

  return shuffleArray(pieces);
};

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const isPuzzleComplete = (boardSlots: (JigsawPiece | null)[]): boolean => {
  return boardSlots.every((piece, index) => piece?.id === index + 1);
};

export const createPuzzleBoardSlots = (): number[] => {
  return Array.from({ length: PIECE_COUNT }, (_, i) => i + 1);
};

export const findPieceSlotIndex = (boardSlots: (JigsawPiece | null)[], pieceId: number): number => {
  return boardSlots.findIndex(piece => piece?.id === pieceId);
};

export const isValidSlotTransition = (sourceIndex: number, targetIndex: number, maxSlots: number): boolean => {
  return sourceIndex !== -1 && targetIndex >= 0 && targetIndex < maxSlots;
};

export const getPieceRowCol = (pieceId: number): { rowIndex: number; colIndex: number } => {
  const originalIndex = pieceId - 1;
  return {
    rowIndex: Math.floor(originalIndex / PUZZLE_CONFIG.GRID_SIZE),
    colIndex: originalIndex % PUZZLE_CONFIG.GRID_SIZE,
  };
};

export const calculateImagePosition = (rowIndex: number, colIndex: number): { imageX: number; imageY: number } => {
  const { PIECE_SIZE } = PUZZLE_CONFIG;
  const { TAB_HEIGHT } = PUZZLE_DIMENSIONS;
  
  return {
    imageX: -(colIndex * PIECE_SIZE) + TAB_HEIGHT,
    imageY: -(rowIndex * PIECE_SIZE) + TAB_HEIGHT,
  };
};

export const createPieceWrapperStyle = (pieceSize: number) => {
  const tabHeight = PUZZLE_DIMENSIONS.TAB_HEIGHT;
  
  return {
    position: 'absolute' as const,
    top: -tabHeight,
    left: -tabHeight,
    width: pieceSize + 2 * tabHeight,
    height: pieceSize + 2 * tabHeight
  };
};

export const createActivePieceDetails = (
  activePiece: JigsawPiece | null, 
  placedPieces: (JigsawPiece | null)[]
) => {
  if (!activePiece) return null;

  const index = findPieceSlotIndex(placedPieces, activePiece.id);
  if (index === -1) return null;

  const { rowIndex, colIndex } = getPieceRowCol(activePiece.id);

  return {
    piece: activePiece,
    rowIndex,
    colIndex,
  };
};

export const getButtonText = (playerLevel: number) => {
  if (playerLevel === 1) return 'Play Medium';
  if (playerLevel === 2) return 'Play Hard';
};

export const getTargetProgressWidth = (level: number): string => {
  if (level === 0) return '25%'; 
  if (level === 1) return '75%'; 
  if (level === 2) return '100%';
  return '0%';
};

export const trackUsersAnalytics = async (payload: any) => {
    const timestamp = new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'UTC'
        }).replace(/[, ]/g, '-').replace(/:/g, '-');

    await fetch(`${FIREBASE_DB_API}/puzzle/${timestamp}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload })
    })
  }