import React from 'react';
import { PUZZLE_CONFIG, PUZZLE_DIMENSIONS, PUZZLE_PATHS } from '../../utils/constants';
import { generatePiecePath } from '../../utils/svgPathGenerator';
import { calculateImagePosition } from '@/app/utils/puzzleHelpers';
import { JigsawPiece } from '../../types/puzzle';

interface SvgJigsawPieceProps {
  piece: JigsawPiece; 
  rowIndex: number;
  colIndex: number;
}

export const SvgJigsawPiece = React.memo(({ piece, rowIndex, colIndex }: SvgJigsawPieceProps) => {
  const clipPathId = `clip-${piece.id}`;

  const { imageX, imageY } = calculateImagePosition(rowIndex, colIndex);

  const piecePath = generatePiecePath(
    piece.top, 
    piece.right, 
    piece.bottom, 
    piece.left, 
    PUZZLE_CONFIG.PIECE_SIZE
  );

  return (
    <svg
      width={PUZZLE_DIMENSIONS.SVG_SIZE}
      height={PUZZLE_DIMENSIONS.SVG_SIZE}
      viewBox={`0 0 ${PUZZLE_DIMENSIONS.SVG_SIZE} ${PUZZLE_DIMENSIONS.SVG_SIZE}`}
      style={{ 
        display: 'block', 
        overflow: 'visible' 
      }}
    >
      <defs>
        <clipPath id={clipPathId}>
          <path d={piecePath} />
        </clipPath>
      </defs>

      <image
        href={PUZZLE_PATHS.COMPLETE}
        width={PUZZLE_DIMENSIONS.BOARD_GRID_SIZE}
        height={PUZZLE_DIMENSIONS.BOARD_GRID_SIZE}
        x={imageX}
        y={imageY}
        clipPath={`url(#${clipPathId})`}
        style={{ imageRendering: 'pixelated' }}
      />
    </svg>
  );
});

SvgJigsawPiece.displayName = 'SvgJigsawPiece';