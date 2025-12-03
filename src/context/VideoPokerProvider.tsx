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

export const VideoPokerProvider = ({ children }: { children: ReactNode }) => {
  const [gameType, setGameType] = useState<GameTypeType | null>(null);
  const [credits, setCredits] = useState<number>(10);
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
    startingCredits: 100,
  });

  const startNewGame = useCallback(
    async (newGameType: GameTypeType, initialCredits: number = 100) => {
      setGameType(newGameType);
      setCredits(initialCredits);
      setSequence(0);
      setHand([]);
      setDeck([]);
      setWager(5);
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
        startingCredits: initialCredits,
      });

      // Increment session counter for this game type
      const stats = getGameStats(newGameType);
      updateGameStats(newGameType, {
        sessionsPlayed: stats.sessionsPlayed + 1,
      });
    },
    []
  );

  const setBet = useCallback((newWager: number) => {
    setWager(newWager);
  }, []);

  const dealCards = useCallback(async () => {
    if (!gameType) return;

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
  }, [gameType, wager]);

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

          // Track statistics
          const stats = getGameStats(gameType);
          const handFreq = { ...stats.handFrequency };
          if (evaluation.handType !== HandType.None) {
            handFreq[evaluation.handType] =
              (handFreq[evaluation.handType] || 0) + 1;
          }

          // Track win/loss streaks
          const won = evaluation.payout > 0;
          const newWinStreak = won ? stats.currentWinStreak + 1 : 0;
          const newLossStreak = !won ? stats.currentLossStreak + 1 : 0;

          updateGameStats(gameType, {
            totalHandsPlayed: stats.totalHandsPlayed + 1,
            totalWins: stats.totalWins + (won ? 1 : 0),
            totalLosses: stats.totalLosses + (!won ? 1 : 0),
            totalCreditsWon: stats.totalCreditsWon + evaluation.payout,
            totalCreditsLost: stats.totalCreditsLost + wager,
            biggestHandWin: Math.max(stats.biggestHandWin, evaluation.payout),
            highestCredits: Math.max(
              stats.highestCredits,
              credits + evaluation.payout
            ),
            handFrequency: handFreq,
            currentWinStreak: newWinStreak,
            currentLossStreak: newLossStreak,
            longestWinStreak: Math.max(stats.longestWinStreak, newWinStreak),
            longestLossStreak: Math.max(stats.longestLossStreak, newLossStreak),
          });

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
    [gameType, sequence, hand, deck, wager, credits]
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

      // Track statistics
      const stats = getGameStats(gameType);
      const handFreq = { ...stats.handFrequency };
      if (evaluation.handType !== HandType.None) {
        handFreq[evaluation.handType] =
          (handFreq[evaluation.handType] || 0) + 1;
      }

      // Track win/loss streaks
      const won = evaluation.payout > 0;
      const newWinStreak = won ? stats.currentWinStreak + 1 : 0;
      const newLossStreak = !won ? stats.currentLossStreak + 1 : 0;

      updateGameStats(gameType, {
        totalHandsPlayed: stats.totalHandsPlayed + 1,
        totalWins: stats.totalWins + (won ? 1 : 0),
        totalLosses: stats.totalLosses + (!won ? 1 : 0),
        totalCreditsWon: stats.totalCreditsWon + evaluation.payout,
        totalCreditsLost: stats.totalCreditsLost + wager,
        biggestHandWin: Math.max(stats.biggestHandWin, evaluation.payout),
        highestCredits: Math.max(
          stats.highestCredits,
          credits + evaluation.payout
        ),
        handFrequency: handFreq,
        currentWinStreak: newWinStreak,
        currentLossStreak: newLossStreak,
        longestWinStreak: Math.max(stats.longestWinStreak, newWinStreak),
        longestLossStreak: Math.max(stats.longestLossStreak, newLossStreak),
      });

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

    // Track statistics
    const stats = getGameStats(gameType);
    const handFreq = { ...stats.handFrequency };
    if (evaluation.handType !== HandType.None) {
      handFreq[evaluation.handType] = (handFreq[evaluation.handType] || 0) + 1;
    }

    // Track win/loss streaks
    const won = evaluation.payout > 0;
    const newWinStreak = won ? stats.currentWinStreak + 1 : 0;
    const newLossStreak = !won ? stats.currentLossStreak + 1 : 0;

    updateGameStats(gameType, {
      totalHandsPlayed: stats.totalHandsPlayed + 1,
      totalWins: stats.totalWins + (won ? 1 : 0),
      totalLosses: stats.totalLosses + (!won ? 1 : 0),
      totalCreditsWon: stats.totalCreditsWon + evaluation.payout,
      totalCreditsLost: stats.totalCreditsLost + wager,
      biggestHandWin: Math.max(stats.biggestHandWin, evaluation.payout),
      highestCredits: Math.max(
        stats.highestCredits,
        credits + evaluation.payout
      ),
      handFrequency: handFreq,
      currentWinStreak: newWinStreak,
      currentLossStreak: newLossStreak,
      longestWinStreak: Math.max(stats.longestWinStreak, newWinStreak),
      longestLossStreak: Math.max(stats.longestLossStreak, newLossStreak),
    });

    setSessionStats((prev) => ({
      ...prev,
      handsPlayed: prev.handsPlayed + 1,
      netProfit: prev.netProfit + evaluation.payout - wager,
      biggestWin: Math.max(prev.biggestWin, evaluation.payout),
    }));

    setDoubleDownChain(0);
  }, [gameType, hand, deck, heldCards, wager, credits]);

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

      const stats = getGameStats(gameType);
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

        updateGameStats(gameType, {
          totalDoubleDownsAttempted: stats.totalDoubleDownsAttempted + 1,
          totalDoubleDownsWon: stats.totalDoubleDownsWon + 1,
          longestDoubleDownChain: Math.max(
            stats.longestDoubleDownChain,
            newChain
          ),
          biggestDoubleDownWin: Math.max(stats.biggestDoubleDownWin, winAmount),
          highestCredits: Math.max(
            stats.highestCredits,
            originalCredits + winAmount
          ),
        });

        setSessionStats((prev) => ({
          ...prev,
          currentDoubleDownChain: newChain,
          biggestWin: Math.max(prev.biggestWin, winAmount),
        }));
      } else if (tie) {
        // Tie - keep current payout
        updateGameStats(gameType, {
          totalDoubleDownsAttempted: stats.totalDoubleDownsAttempted + 1,
        });
      } else {
        setCredits(originalCredits);
        setPayout(0);
        setDoubleDownChain(0);

        updateGameStats(gameType, {
          totalDoubleDownsAttempted: stats.totalDoubleDownsAttempted + 1,
        });

        setSessionStats((prev) => ({
          ...prev,
          currentDoubleDownChain: 0,
        }));
      }

      // Move to sequence "e" to show double down results
      setSequence("e");
    },
    [doubleDownHand, payout, originalCredits, gameType, doubleDownChain]
  );

  const returnToMenu = useCallback(() => {
    setGameType(null);
    setSequence(0);
  }, []);

  const continueGame = useCallback(() => {
    setSequence(0);
    setHand([]);
    setHeldCards([false, false, false, false, false]);
    setCurrentHand(HandType.None);
    setPayout(0);
    setDoubleDownHand([]);
    setSelectedCardIndex(-1);
  }, []);

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
  };

  return (
    <VideoPokerContext.Provider value={value}>
      {children}
    </VideoPokerContext.Provider>
  );
};
