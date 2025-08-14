import { usePuzzleGame } from "../hooks/usePuzzleGame";

export type EdgeType = 'flat' | 'tab' | 'blank';

export interface Piece {
  id: number;
}

export interface JigsawPiece extends Piece {
  top: EdgeType;
  right: EdgeType;
  bottom: EdgeType;
  left: EdgeType;
}

export interface DroppedItem {
  id: number;
  origin: 'unplaced' | number;
}

export enum ItemTypes {
  PIECE = 'piece',
}

export interface PuzzleState {
  boardSlots: (JigsawPiece | null)[];
}

export type PuzzleAction =
  | { type: 'DROP_PIECE'; payload: { targetSlotId: number; sourceSlotId: number } }
  | { type: 'RESET_PUZZLE' };

export type GameScreen = 'preview' | 'puzzle' | 'congrats';

export interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

export interface WalletInfo {
  address: string;
  provider: EthereumProvider | null;
}

export interface ClaimTransactionData {
  params: Array<{
    to: `0x${string}`;
    data: `0x${string}`; 
    value: string;
  }>;
}

export type SendTransaction = (args: {
  to: `0x${string}`;
  data: `0x${string}`;
  value: bigint;
}) => Promise<string>;

export type PuzzleGameContextType = ReturnType<typeof usePuzzleGame>;

export interface FarcasterWallet {
  walletClientType: string;
  address: string;
  getEthereumProvider: () => Promise<EthereumProvider>;
}

export interface RewardTrackProps {
  playerLevel: number;
}

export interface RewardLabelProps {
  label: string;
  position: string;
  isUnlocked: boolean;
}

export interface RewardMarkerProps {
  position: string;
  isUnlocked: boolean;
}

export interface ProgressBarProps {
  width: string;
}