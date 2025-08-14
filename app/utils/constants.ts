export const PUZZLE_CONFIG = {
  GRID_SIZE: 3,
  PIECE_SIZE: 80,
  TAB_HEIGHT_RATIO: 0.2,
  TAB_WIDTH_RATIO: 0.3,
  NECK_WIDTH_RATIO: 0.15,
  CURVE_STRENGTH_RATIO: 0.8,
} as const;

export const PIECE_COUNT = PUZZLE_CONFIG.GRID_SIZE * PUZZLE_CONFIG.GRID_SIZE;

export const PUZZLE_PATHS = {
  PREVIEW: '/puzzle/preview.png',
  COMPLETE: '/puzzle/complete.png',
} as const;

export const DRAG_ACTIVATION = {
  TOUCH_DELAY: 250,
  TOUCH_TOLERANCE: 5,
} as const;

export const PUZZLE_DIMENSIONS = {
  get TAB_HEIGHT() {
    return PUZZLE_CONFIG.PIECE_SIZE * PUZZLE_CONFIG.TAB_HEIGHT_RATIO;
  },
  get SVG_SIZE() {
    return PUZZLE_CONFIG.PIECE_SIZE + 2 * this.TAB_HEIGHT;
  },
  get BOARD_GRID_SIZE() {
    return PUZZLE_CONFIG.GRID_SIZE * PUZZLE_CONFIG.PIECE_SIZE;
  },
  get TOTAL_BOARD_SIZE() {
    return this.BOARD_GRID_SIZE + 2 * this.TAB_HEIGHT;
  }
} as const;