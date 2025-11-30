import { Card, Rank, Suit } from "../types/game";
import { mockHand } from "./mockHand";
// import { mockHand } from "./mockHand";

const ranks: Rank[] = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];
const suits: Suit[] = ["h", "d", "c", "s"];

export function createDeck(jokers: number = 0): Card[] {
  const deck: Card[] = [];

  for (const rank of ranks) {
    for (const suit of suits) {
      deck.push(`${rank}${suit}` as Card);
    }
  }

  for (let i = 0; i < jokers; i++) {
    deck.push(i % 2 === 0 ? "O1" : "O2");
  }

  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function dealCards(
  deck: Card[],
  count: number
): { hand: Card[]; remainingDeck: Card[] } {
  // const hand = deck.slice(0, count);
  const hand = mockHand("2s", "2h", "3d", "5d", "9d");

  const remainingDeck = deck.slice(count);
  return { hand, remainingDeck };
}

export function replaceCards(
  hand: Card[],
  deck: Card[],
  heldCards: boolean[]
): { newHand: Card[]; remainingDeck: Card[] } {
  const newHand = [...hand];
  let remainingDeck = [...deck];

  for (let i = 0; i < heldCards.length; i++) {
    if (!heldCards[i] && remainingDeck.length > 0) {
      newHand[i] = remainingDeck[0];
      remainingDeck = remainingDeck.slice(1);
    }
  }

  return { newHand, remainingDeck };
}

export function getCardValue(card: Card): number {
  if (card === "O1" || card === "O2") return 15;

  const rank = card.slice(0, -1) as Rank;
  const values: Record<Rank, number> = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    "10": 10,
    "9": 9,
    "8": 8,
    "7": 7,
    "6": 6,
    "5": 5,
    "4": 4,
    "3": 3,
    "2": 2,
  };

  return values[rank];
}

export function getCardRank(card: Card): string {
  if (card === "O1" || card === "O2") return "O";
  return card.slice(0, -1);
}

export function getCardSuit(card: Card): string {
  if (card === "O1" || card === "O2") return "";
  return card.slice(-1);
}
