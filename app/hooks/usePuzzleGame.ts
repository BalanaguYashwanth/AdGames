import { useState, useEffect, useCallback } from 'react';
import { GameScreen } from '../types/puzzle';
import { usePuzzleState } from './usePuzzleState';
import { usePuzzleDragAndDrop } from './usePuzzleDragAndDrop';
import { useRewardClaim } from './useRewardClaim';
import { isPuzzleComplete, trackUsersAnalytics } from '../utils/puzzleHelpers';
import { useAccount } from 'wagmi';
import { readContract } from '@wagmi/core';
import { config } from '@/lib/wagmiConfig';
import { PUZZLE_REWARDS_ABI } from '@/lib/abi';
import { preloadPuzzleImages } from '../utils/imagePreloader';
import { NEYNAR_API } from '../utils/constants';

const PUZZLE_REWARDS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PUZZLE_REWARDS_CONTRACT_ADDRESS as `0x${string}`;

export const usePuzzleGame = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('preview');
  const [playerLevel, setPlayerLevel] = useState(0);
  const [isFetchingLevel, setIsFetchingLevel] = useState(true);

  const { address } = useAccount();
  const { puzzleState, puzzleBoardSlots, dropPiece, resetPuzzle } = usePuzzleState();

  const dragAndDropHandlers = usePuzzleDragAndDrop({
    boardSlots: puzzleState.boardSlots,
    onPieceDrop: dropPiece
  });

  const { isClaiming, hasClaimedForLevel, executeRewardClaim, resetClaimStatus } = useRewardClaim();

  const fetchPlayerLevel = useCallback(async () => {
    if (address) {
      setIsFetchingLevel(true);
      try {
        const level = await readContract(config, {
          address: PUZZLE_REWARDS_CONTRACT_ADDRESS,
          abi: PUZZLE_REWARDS_ABI,
          functionName: 'getPlayerLevel',
          args: [address],
        });
        setPlayerLevel(Number(level));
      } catch (error) {
        console.error("Failed to fetch player level:", error);
        setPlayerLevel(0);
      } finally {
        setIsFetchingLevel(false);
      }
    } else {
      setPlayerLevel(0);
      setIsFetchingLevel(false);
    }
  }, [address]);

  useEffect(() => {
    fetchPlayerLevel();
  }, [fetchPlayerLevel]);

  useEffect(() => {
    preloadPuzzleImages()
  }, []);

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
    logUser();
    resetClaimStatus();
    resetPuzzle();
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
      await executeRewardClaim();
      await fetchPlayerLevel();
    } catch (error: unknown) {
      console.log(`${error instanceof Error ? error.message : 'An unknown error occurred during minting.'}`);
    }
  };

  return {
    currentScreen,
    playerLevel,
    isFetchingLevel,
    puzzleState,
    puzzleBoardSlots,
    isClaiming,
    hasClaimedForLevel,

    ...dragAndDropHandlers,

    startPuzzleGame,
    validatePuzzleCompletion,
    handleRewardClaim
  };
};