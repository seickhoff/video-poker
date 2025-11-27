import { useState, ReactNode, useCallback } from "react";
import { VideoPokerContext } from "./VideoPokerContext";
import { Card, GameType, GameSequence, HandType } from "../types/game";
import {
  createDeck,
  shuffleDeck,
  dealCards as dealCardsUtil,
  replaceCards,
  getCardValue,
} from "../utils/deck";
import { evaluateHand } from "../utils/handEvaluator";
import { getJokerCount } from "../utils/gameConfigs";

export const VideoPokerProvider = ({ children }: { children: ReactNode }) => {
  const [gameType, setGameType] = useState<GameType | null>(null);
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
  const [currentHand, setCurrentHand] = useState<HandType>("");
  const [payout, setPayout] = useState<number>(0);
  const [originalCredits, setOriginalCredits] = useState<number>(0);
  const [doubleDownHand, setDoubleDownHand] = useState<Card[]>([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(-1);

  const startNewGame = useCallback(
    (newGameType: GameType, initialCredits: number = 100) => {
      setGameType(newGameType);
      setCredits(initialCredits);
      setSequence(0);
      setHand([]);
      setDeck([]);
      setWager(5);
      setHeldCards([false, false, false, false, false]);
      setCurrentHand("");
      setPayout(0);
      setOriginalCredits(0);
      setDoubleDownHand([]);
    },
    []
  );

  const setBet = useCallback((newWager: number) => {
    setWager(newWager);
  }, []);

  const dealCards = useCallback(() => {
    if (!gameType) return;

    const jokers = getJokerCount(gameType);
    const newDeck = shuffleDeck(createDeck(jokers));
    const { hand: newHand, remainingDeck } = dealCardsUtil(newDeck, 5);

    setHand(newHand);
    setDeck(remainingDeck);
    setHeldCards([false, false, false, false, false]);
    setCredits((prev) => prev - wager);
    setSequence(1);

    const evaluation = evaluateHand(newHand, gameType, wager);
    setCurrentHand(evaluation.handType);
  }, [gameType, wager]);

  const toggleHoldCard = useCallback((index: number) => {
    setHeldCards((prev) => {
      const newHeld = [...prev];
      newHeld[index] = !newHeld[index];
      return newHeld;
    });
  }, []);

  const drawCards = useCallback(() => {
    if (!gameType) return;

    const { newHand, remainingDeck } = replaceCards(hand, deck, heldCards);
    setHand(newHand);
    setDeck(remainingDeck);
    setSequence(2);

    const evaluation = evaluateHand(newHand, gameType, wager);
    setCurrentHand(evaluation.handType);
    setPayout(evaluation.payout);
    setOriginalCredits(credits);
    setCredits((prev) => prev + evaluation.payout);
  }, [gameType, hand, deck, heldCards, wager, credits]);

  const startDoubleDown = useCallback(() => {
    if (!gameType) return;

    const jokers = 0;
    const newDeck = shuffleDeck(createDeck(jokers));
    const { hand: ddHand } = dealCardsUtil(newDeck, 5);

    setDoubleDownHand(ddHand);
    setHand(ddHand);
    setSelectedCardIndex(-1);
    setSequence("d");
  }, [gameType]);

  const selectDoubleDownCard = useCallback(
    (index: number) => {
      if (index === 0 || doubleDownHand.length === 0) return;

      const dealerCard = doubleDownHand[0];
      const playerCard = doubleDownHand[index];

      const dealerValue = getCardValue(dealerCard);
      const playerValue = getCardValue(playerCard);

      // Store which card was selected
      setSelectedCardIndex(index);

      // Calculate and apply result immediately
      if (playerValue > dealerValue) {
        const winAmount = 2 * payout;
        setCredits(originalCredits + winAmount);
        setPayout(winAmount);
      } else if (playerValue === dealerValue) {
        // Tie - keep current payout
      } else {
        setCredits(originalCredits);
        setPayout(0);
      }

      // Move to sequence 2 to show results
      setSequence(2);
    },
    [doubleDownHand, payout, originalCredits]
  );

  const returnToMenu = useCallback(() => {
    setGameType(null);
    setSequence(0);
  }, []);

  const continueGame = useCallback(() => {
    setSequence(0);
    setHand([]);
    setHeldCards([false, false, false, false, false]);
    setCurrentHand("");
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
