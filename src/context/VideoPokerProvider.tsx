import { useState, ReactNode, useCallback } from "react";
import { VideoPokerContext } from "./VideoPokerContext";
import {
  Card,
  GameType,
  type GameType as GameTypeType,
  GameSequence,
  HandType,
} from "../types/game";
import {
  createDeck,
  shuffleDeck,
  dealCards as dealCardsUtil,
  replaceCards,
  getCardValue,
} from "../utils/deck";
import { evaluateHand } from "../utils/handEvaluator";
import { getJokerCount } from "../utils/gameConfigs";
import { getGameStats, updateGameStats } from "../utils/statistics";
import { SessionStats } from "../types/statistics";
import { GAME_SETTINGS } from "../config/gameSettings";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useHandResult } from "../hooks/useHandResult";
import { usePlayTimeTracking } from "../hooks/usePlayTimeTracking";

export const VideoPokerProvider = ({ children }: { children: ReactNode }) => {
  const [gameType, setGameType] = useState<GameTypeType | null>(null);
  const [credits, setCredits] = useLocalStorage<number>(
    "videoPoker_credits",
    GAME_SETTINGS.DEFAULT_STARTING_CREDITS
  );
  const [lastWagers, setLastWagers] = useLocalStorage<Record<string, number>>(
    "videoPoker_lastWagers",
    {}
  );
  const [sequence, setSequence] = useState<GameSequence>(0);
  const [hand, setHand] = useState<Card[]>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [wager, setWager] = useState<number>(5);
  const [heldCards, setHeldCards] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [currentHand, setCurrentHand] = useState<HandType>(HandType.None);
  const [payout, setPayout] = useState<number>(0);
  const [originalCredits, setOriginalCredits] = useState<number>(0);
  const [doubleDownHand, setDoubleDownHand] = useState<Card[]>([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(-1);
  const [doubleDownChain, setDoubleDownChain] = useState<number>(0);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    handsPlayed: 0,
    netProfit: 0,
    biggestWin: 0,
    currentDoubleDownChain: 0,
    startingCredits: GAME_SETTINGS.DEFAULT_STARTING_CREDITS,
  });

  // Use the hand result hook for statistics tracking
  const { recordHandResult, recordDoubleDownAttempt } = useHandResult();

  // Track session play time
  const { startTracking, stopTracking, pauseTracking, resumeTracking, getCurrentElapsedSeconds } = usePlayTimeTracking(gameType);

  // Helper function to get best available wager based on credits
  const getBestAvailableWager = useCallback(
    (preferredWager: number, availableCredits: number): number => {
      if (availableCredits >= preferredWager) {
        return preferredWager;
      }
      for (
        let wager = GAME_SETTINGS.MAX_BET;
        wager >= GAME_SETTINGS.MIN_BET;
        wager--
      ) {
        if (availableCredits >= wager) {
          return wager;
        }
      }
      return GAME_SETTINGS.MIN_BET;
    },
    []
  );

  // Helper function to save last wager for a game type
  const saveLastWager = useCallback(
    (gameTypeKey: GameType, wagerAmount: number) => {
      setLastWagers((prev) => ({
        ...prev,
        [gameTypeKey]: wagerAmount,
      }));
    },
    [setLastWagers]
  );

  // Helper function to restore last wager for a game type
  const restoreLastWager = useCallback(
    (gameTypeKey: GameType, availableCredits: number): number => {
      const lastWager = lastWagers[gameTypeKey] || GAME_SETTINGS.DEFAULT_WAGER;
      return getBestAvailableWager(lastWager, availableCredits);
    },
    [lastWagers, getBestAvailableWager]
  );

  const startNewGame = useCallback(
    async (newGameType: GameTypeType, initialCredits?: number) => {
      setGameType(newGameType);

      // Only reset credits if explicitly provided or if current credits are 0
      const creditsToUse =
        initialCredits !== undefined
          ? initialCredits
          : credits === 0
            ? GAME_SETTINGS.DEFAULT_STARTING_CREDITS
            : credits;

      if (credits === 0 || initialCredits !== undefined) {
        setCredits(creditsToUse);
      }

      // Restore last wager for this game type, or use default
      const restoredWager = restoreLastWager(newGameType, creditsToUse);

      setSequence(0);
      setHand([]);
      setDeck([]);
      setWager(restoredWager);
      setHeldCards([false, false, false, false, false]);
      setCurrentHand(HandType.None);
      setPayout(0);
      setOriginalCredits(0);
      setDoubleDownHand([]);
      setSelectedCardIndex(-1);
      setDoubleDownChain(0);
      setSessionStats({
        handsPlayed: 0,
        netProfit: 0,
        biggestWin: 0,
        currentDoubleDownChain: 0,
        startingCredits: creditsToUse,
      });

      // Increment session counter for this game type
      const stats = getGameStats(newGameType);
      updateGameStats(newGameType, {
        sessionsPlayed: stats.sessionsPlayed + 1,
      });

      // Start tracking session time
      startTracking();
    },
    [credits, restoreLastWager, startTracking]
  );

  const setBet = useCallback((newWager: number) => {
    setWager(newWager);
  }, []);

  const dealCards = useCallback(async () => {
    if (!gameType) return;

    // Save the wager for this game type
    saveLastWager(gameType, wager);

    const jokers = getJokerCount(gameType);
    const newDeck = await shuffleDeck(createDeck(jokers));

    // Pick-a-Pair Poker: Deal 4 cards initially, with gap for display
    if (gameType === GameType.PickAPairPoker) {
      const { hand: fourCards, remainingDeck } = dealCardsUtil(newDeck, 4);
      // Create 5-card array with gap: [card1, card2, gap, card3, card4]
      const newHand: Card[] = [
        fourCards[0],
        fourCards[1],
        null as any,
        fourCards[2],
        fourCards[3],
      ];

      setHand(newHand);
      setDeck(remainingDeck);
      // First 2 cards auto-held, gap is false, last 2 are selectable
      setHeldCards([true, true, false, false, false]);
      setCredits((prev) => prev - wager);
      setSequence(1);
      setCurrentHand(HandType.None);
      return;
    }

    // Standard games: Deal 5 cards
    const { hand: newHand, remainingDeck } = dealCardsUtil(newDeck, 5);
    setHand(newHand);
    setDeck(remainingDeck);
    setHeldCards([false, false, false, false, false]);
    setCredits((prev) => prev - wager);
    setSequence(1);

    const evaluation = evaluateHand(newHand, gameType, wager);
    setCurrentHand(evaluation.handType);
  }, [gameType, wager, saveLastWager]);

  const toggleHoldCard = useCallback(
    (index: number) => {
      // Pick-a-Pair Poker: Select card 3 or 4 (indices 3 or 4) and auto-draw
      if (gameType === GameType.PickAPairPoker && sequence === 1) {
        if (index === 3 || index === 4) {
          const selectedCard = hand[index];

          // Deal 2 more cards
          const { hand: newCards, remainingDeck } = dealCardsUtil(deck, 2);

          // Build final 5-card hand: [card1, card2, selectedCard, newCard1, newCard2]
          const finalHand: Card[] = [
            hand[0], // First auto-kept card
            hand[1], // Second auto-kept card
            selectedCard, // Player's choice from card 3 or 4
            newCards[0], // New card 1
            newCards[1], // New card 2
          ];

          setHand(finalHand);
          setDeck(remainingDeck);
          setSequence(2);

          const evaluation = evaluateHand(finalHand, gameType, wager);
          setCurrentHand(evaluation.handType);
          setPayout(evaluation.payout);
          setOriginalCredits(credits);
          setCredits((prev) => prev + evaluation.payout);

          // Track statistics using hook
          recordHandResult(gameType, evaluation, wager, credits);

          // Update session stats
          setSessionStats((prev) => ({
            ...prev,
            handsPlayed: prev.handsPlayed + 1,
            netProfit: prev.netProfit + evaluation.payout - wager,
            biggestWin: Math.max(prev.biggestWin, evaluation.payout),
          }));

          setDoubleDownChain(0);
        }
        return;
      }

      // Standard games: Toggle hold
      setHeldCards((prev) => {
        const newHeld = [...prev];
        newHeld[index] = !newHeld[index];
        return newHeld;
      });
    },
    [gameType, sequence, hand, deck, wager, credits, recordHandResult]
  );

  const drawCards = useCallback(() => {
    if (!gameType) return;

    // Pick-a-Pair Poker: Deal 2 more cards to complete the hand
    if (gameType === GameType.PickAPairPoker) {
      // Find which card was selected (index 3 or 4)
      const selectedIndex = heldCards[3] ? 3 : 4;
      const selectedCard = hand[selectedIndex];

      // Deal 2 more cards
      const { hand: newCards, remainingDeck } = dealCardsUtil(deck, 2);

      // Build final 5-card hand: [card1, card2, selectedCard, newCard1, newCard2]
      const finalHand: Card[] = [
        hand[0], // First auto-kept card
        hand[1], // Second auto-kept card
        selectedCard, // Player's choice from card 3 or 4
        newCards[0], // New card 1
        newCards[1], // New card 2
      ];

      setHand(finalHand);
      setDeck(remainingDeck);
      setSequence(2);

      const evaluation = evaluateHand(finalHand, gameType, wager);
      setCurrentHand(evaluation.handType);
      setPayout(evaluation.payout);
      setOriginalCredits(credits);
      setCredits((prev) => prev + evaluation.payout);

      // Track statistics using hook
      recordHandResult(gameType, evaluation, wager, credits);

      // Update session stats
      setSessionStats((prev) => ({
        ...prev,
        handsPlayed: prev.handsPlayed + 1,
        netProfit: prev.netProfit + evaluation.payout - wager,
        biggestWin: Math.max(prev.biggestWin, evaluation.payout),
      }));

      setDoubleDownChain(0);
      return;
    }

    // Standard games: Replace unheld cards
    const { newHand, remainingDeck } = replaceCards(hand, deck, heldCards);
    setHand(newHand);
    setDeck(remainingDeck);
    setSequence(2);

    const evaluation = evaluateHand(newHand, gameType, wager);
    setCurrentHand(evaluation.handType);
    setPayout(evaluation.payout);
    setOriginalCredits(credits);
    setCredits((prev) => prev + evaluation.payout);

    // Track statistics using hook
    recordHandResult(gameType, evaluation, wager, credits);

    // Update session stats
    setSessionStats((prev) => ({
      ...prev,
      handsPlayed: prev.handsPlayed + 1,
      netProfit: prev.netProfit + evaluation.payout - wager,
      biggestWin: Math.max(prev.biggestWin, evaluation.payout),
    }));

    setDoubleDownChain(0);
  }, [gameType, hand, deck, heldCards, wager, credits, recordHandResult]);

  const startDoubleDown = useCallback(async () => {
    if (!gameType) return;

    const jokers = 0;
    const newDeck = await shuffleDeck(createDeck(jokers));
    const { hand: ddHand } = dealCardsUtil(newDeck, 5);

    setDoubleDownHand(ddHand);
    setHand(ddHand);
    setSelectedCardIndex(-1);
    setSequence("d");
  }, [gameType]);

  const selectDoubleDownCard = useCallback(
    (index: number) => {
      if (index === 0 || doubleDownHand.length === 0 || !gameType) return;

      const dealerCard = doubleDownHand[0];
      const playerCard = doubleDownHand[index];

      const dealerValue = getCardValue(dealerCard);
      const playerValue = getCardValue(playerCard);

      // Store which card was selected
      setSelectedCardIndex(index);

      const won = playerValue > dealerValue;
      const tie = playerValue === dealerValue;

      // Calculate and apply result immediately
      if (won) {
        const winAmount = 2 * payout;
        setCredits(originalCredits + winAmount);
        setPayout(winAmount);

        // Track double down success
        const newChain = doubleDownChain + 1;
        setDoubleDownChain(newChain);

        // Record double down win using hook
        recordDoubleDownAttempt(
          gameType,
          true,
          winAmount,
          newChain,
          originalCredits
        );

        setSessionStats((prev) => ({
          ...prev,
          currentDoubleDownChain: newChain,
          biggestWin: Math.max(prev.biggestWin, winAmount),
        }));
      } else if (tie) {
        // Tie - keep current payout, just record attempt
        recordDoubleDownAttempt(gameType, false);
      } else {
        setCredits(originalCredits);
        setPayout(0);
        setDoubleDownChain(0);

        // Record double down loss
        recordDoubleDownAttempt(gameType, false);

        setSessionStats((prev) => ({
          ...prev,
          currentDoubleDownChain: 0,
        }));
      }

      // Move to sequence "e" to show double down results
      setSequence("e");
    },
    [
      doubleDownHand,
      payout,
      originalCredits,
      gameType,
      doubleDownChain,
      recordDoubleDownAttempt,
    ]
  );

  const returnToMenu = useCallback(() => {
    // Update play time before leaving
    stopTracking();

    setGameType(null);
    setSequence(0);
  }, [stopTracking]);

  const continueGame = useCallback(() => {
    // Restore last wager for current game type
    if (gameType) {
      const restoredWager = restoreLastWager(gameType, credits);
      setWager(restoredWager);
    }

    setSequence(0);
    setHand([]);
    setHeldCards([false, false, false, false, false]);
    setCurrentHand(HandType.None);
    setPayout(0);
    setDoubleDownHand([]);
    setSelectedCardIndex(-1);
  }, [gameType, credits, restoreLastWager]);

  const value = {
    gameType,
    credits,
    sequence,
    hand,
    deck,
    wager,
    heldCards,
    currentHand,
    payout,
    originalCredits,
    doubleDownHand,
    selectedCardIndex,
    sessionStats,
    startNewGame,
    setBet,
    dealCards,
    toggleHoldCard,
    drawCards,
    startDoubleDown,
    selectDoubleDownCard,
    returnToMenu,
    continueGame,
    pausePlayTimeTracking: pauseTracking,
    resumePlayTimeTracking: resumeTracking,
    getCurrentElapsedSeconds,
  };

  return (
    <VideoPokerContext.Provider value={value}>
      {children}
    </VideoPokerContext.Provider>
  );
};
