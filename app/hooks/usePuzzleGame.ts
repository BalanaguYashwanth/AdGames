import { useState, useEffect } from 'react';
import { GameScreen } from '../types/puzzle';
import { usePuzzleState } from './usePuzzleState';
import { usePuzzleDragAndDrop } from './usePuzzleDragAndDrop';
import { useRewardClaim } from './useRewardClaim';
import { isPuzzleComplete } from '../utils/puzzleHelpers';
import { useAccount } from 'wagmi';
import { readContract } from '@wagmi/core';
import { config } from '@/lib/wagmiConfig';
import { PUZZLE_REWARDS_ABI } from '@/lib/abi';

const PUZZLE_REWARDS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PUZZLE_REWARDS_CONTRACT_ADDRESS as `0x${string}`;

export const usePuzzleGame = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('preview');
  const [playerLevel, setPlayerLevel] = useState(0);

  const { address } = useAccount();
  const { puzzleState, puzzleBoardSlots, dropPiece, resetPuzzle } = usePuzzleState();

  const dragAndDropHandlers = usePuzzleDragAndDrop({
    boardSlots: puzzleState.boardSlots,
    onPieceDrop: dropPiece
  });

  const { isClaiming, hasClaimedForLevel, executeRewardClaim, resetClaimStatus } = useRewardClaim();

  useEffect(() => {
    fetchPlayerLevel();
  }, [address, currentScreen]);

  const fetchPlayerLevel = async () => {
      if (address) {
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
        }
      }
    };

  const startPuzzleGame = () => {
    if (playerLevel === 0 && hasClaimedForLevel) {
        fetchPlayerLevel();
    }
    resetClaimStatus();
    setCurrentScreen('puzzle');
    resetPuzzle();
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