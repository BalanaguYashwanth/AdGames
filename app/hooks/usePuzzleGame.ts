import { useState, useEffect, useCallback } from 'react';
import { useReadContract } from 'wagmi';
import { useWallets } from '@privy-io/react-auth';
import { usePuzzleState } from './usePuzzleState';
import { usePuzzleDragAndDrop } from './usePuzzleDragAndDrop';
import { useRewardClaim } from './useRewardClaim';
import { PUZZLE_REWARDS_ABI } from '@/lib/abi';
import { isPuzzleComplete } from '../utils/puzzleHelpers';
import { preloadPuzzleImages } from '../utils/imagePreloader';
import { GameScreen } from '../types/puzzle';

const PUZZLE_REWARDS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PUZZLE_REWARDS_CONTRACT_ADDRESS as `0x${string}`;

export const usePuzzleGame = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('preview');
  const [playerLevel, setPlayerLevel] = useState(0);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [hasClaimedAll, setHasClaimedAll] = useState(false);

  const { wallets } = useWallets();
  const connectedWallet = wallets[0];
  const address = connectedWallet?.address as `0x${string}` | undefined;

  const { puzzleState, puzzleBoardSlots, dropPiece, resetPuzzle } = usePuzzleState();

  const dragAndDropHandlers = usePuzzleDragAndDrop({
    boardSlots: puzzleState.boardSlots,
    onPieceDrop: dropPiece
  });

  const { isClaiming, hasClaimedForLevel, executeRewardClaim, resetClaimStatus } = useRewardClaim();

  const { data: onChainLevel, isLoading: isLoadingLevel } = useReadContract({
    address: PUZZLE_REWARDS_CONTRACT_ADDRESS,
    abi: PUZZLE_REWARDS_ABI,
    functionName: 'getPlayerLevel',
    args: [address!],
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    updatePlayerLevelFromChain(onChainLevel)
  }, [onChainLevel, address])

  useEffect(() => {
    preloadPuzzleImages()
  }, []);

  const handlePopupClose = useCallback(() => {
    if (playerLevel >= 3) {
      setHasClaimedAll(true);
      setCurrentScreen('completed');
    }
  }, [playerLevel]);

  const updatePlayerLevelFromChain = (onChainLevel: unknown) => {
    const localLevel = localStorage.getItem('playerLevel');
    const parsedLocalLevel = localLevel ? parseInt(localLevel, 10) : 0;

    if (onChainLevel !== undefined && onChainLevel !== null) {
      const levelFromChain = Number(onChainLevel);

      if (levelFromChain >= 3) { 
        setHasClaimedAll(true);
        setPlayerLevel(levelFromChain);
        setCurrentScreen('completed');
      } else {
        setHasClaimedAll(false);
        setPlayerLevel(Math.max(levelFromChain, parsedLocalLevel));
      }
    } else if (parsedLocalLevel > 0) {
      setPlayerLevel(parsedLocalLevel);
    }
  }

  const startPuzzleGame = () => {
    if (hasClaimedAll) {
      setCurrentScreen('completed');
      return;
    }
    resetClaimStatus();
    resetPuzzle();
    setClaimError(null);
    setCurrentScreen('puzzle');
  };

  const validatePuzzleCompletion = () => {
    const isComplete = isPuzzleComplete(puzzleState.boardSlots);
    
    if (isComplete) {
      setCurrentScreen('congrats');
    } else {
      alert('Not quite right, keep trying!');
    }
  };

  const handleRewardClaim = async () => {
    try {
      setClaimError(null);
      await executeRewardClaim(playerLevel);

      const nextLevel = playerLevel + 1;
      setPlayerLevel(nextLevel);

      localStorage.setItem('playerLevel', nextLevel.toString());
    } catch (error: unknown) {
      const msg = error instanceof Error 
      ? error.message 
      : 'We’re not able to process the reward at this time. Sorry for the inconvenience.';
      setClaimError(msg);
    }
  };

  return {
    currentScreen,
    playerLevel,
    puzzleState,
    puzzleBoardSlots,
    isClaiming,
    hasClaimedForLevel,
    ...dragAndDropHandlers,
    startPuzzleGame,
    validatePuzzleCompletion,
    handleRewardClaim,
    claimError,
    hasClaimedAll,
    isLoadingLevel,
    handlePopupClose,
  };
};
