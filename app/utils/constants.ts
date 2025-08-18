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
  LEVELS: [
    "/puzzle/level-1.png",
    "/puzzle/level-2.png",
    "/puzzle/level-3.png",
  ]
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

export const rewards = [
  { level: 0, label: 'NFT', position: '25%' },
  { level: 1, label: 'NFT', position: '75%' },
  { level: 2, label: 'ETH', position: '100%' },
];

export const GOOGLE_FORM = {
  LINK: "https://forms.gle/W9g18zdK3PDBNcEC7"
};

export const NEYNAR_API ={
  FETCH_USER: 'https://api.neynar.com/v2/farcaster/user/bulk-by-address'
}

export const FIREBASE_DB_API = "https://communityhouse-b50a0-default-rtdb.firebaseio.com";

export const METADATA_URIS: Record<number, string> = {
  0: "ipfs://bafkreiawzuycdu3su4g5hz3r2s5ycahctkqqa2qdzhxlmtwgy25nsodbw4", // Level 1
  1: "ipfs://bafkreiaol6abf7cysemjkarfou3i2dibp4sffzbgwtup5tjrssnicmtaue", // Level 2
  2: "ipfs://hard-level-placeholder", // Level 3
};