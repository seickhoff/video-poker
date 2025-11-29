import { GameType, GameSequence, HandType } from "../types/game";

export const getInstructionText = (
  sequence: GameSequence,
  gameType: GameType,
  payout: number,
  currentHand: HandType
): string => {
  if (sequence === 0) {
    return "Select your bet amount, then click SHOW CARDS to begin.";
  }

  if (sequence === 1) {
    if (gameType === "Pick-a-Pair Poker") {
      return "First 2 cards are kept. Choose ONE card from the two stacks, then click DRAW.";
    }
    return "Click cards to hold them, then click DRAW.";
  }

  if (sequence === 2) {
    if (payout > 0) {
      return `You won ${payout} credits with ${currentHand}! Click DOUBLE DOWN to try to double your winnings, or click CONTINUE.`;
    }
    if (currentHand !== "") {
      return `You lost. Your hand was ${currentHand}. Click CONTINUE to play again.`;
    }
    return "Click CONTINUE to play again.";
  }

  if (sequence === "d") {
    return "Double Down: Click a card to compare with the dealer's card. Higher card wins.";
  }

  if (sequence === "e") {
    return "Double Down result shown. Click CONTINUE to play again.";
  }

  return "";
};
