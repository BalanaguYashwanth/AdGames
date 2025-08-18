import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { usePuzzleState } from './usePuzzleState';
import { usePuzzleDragAndDrop } from './usePuzzleDragAndDrop';
import { useRewardClaim } from './useRewardClaim';
import { PUZZLE_REWARDS_ABI } from '@/lib/abi';
import { isPuzzleComplete, trackUsersAnalytics } from '../utils/puzzleHelpers';
import { preloadPuzzleImages } from '../utils/imagePreloader';
import { NEYNAR_API } from '../utils/constants';
import { GameScreen } from '../types/puzzle';

const PUZZLE_REWARDS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PUZZLE_REWARDS_CONTRACT_ADDRESS as `0x${string}`;

export const usePuzzleGame = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('preview');
  const [playerLevel, setPlayerLevel] = useState(0);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [hasClaimedAll, setHasClaimedAll] = useState(false);

  const { address } = useAccount();
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
  });

  useEffect(() => {
     updatePlayerLevelFromChain(onChainLevel)
  }, [onChainLevel, address])

  useEffect(() => {
    preloadPuzzleImages()
  }, []);

  const updatePlayerLevelFromChain = (onChainLevel: unknown) => {
    const localLevel = localStorage.getItem('playerLevel');
    const parsedLocalLevel = localLevel ? parseInt(localLevel, 10) : 0;

    if (onChainLevel !== undefined && onChainLevel !== null) {
      const levelFromChain = Number(onChainLevel);

      if (levelFromChain >= 3) { 
        setHasClaimedAll(true);
        setCurrentScreen('completed');
      } else {
        setHasClaimedAll(false);
        setPlayerLevel(Math.max(levelFromChain, parsedLocalLevel));
      }
    } else if (parsedLocalLevel > 0) {
      setPlayerLevel(parsedLocalLevel);
    }
  }

  const logUser = useCallback(async () => {
    if (!address) return;
    
    try {
      const response = await fetch(`${NEYNAR_API.FETCH_USER}?addresses=${address}`,
        { headers: { 
          'api_key': process.env.NEXT_PUBLIC_NEYNAR_API_KEY! 
        }}
      );

      const userData = await response.json();
      await trackUsersAnalytics(userData);

    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  }, [address]);

  const startPuzzleGame = () => {
    if (hasClaimedAll) {
      setCurrentScreen('completed');
      return;
    }
    logUser();
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
      setCurrentScreen('preview');
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
    isLoadingLevel
  };
};