export type Card = string;

const ranks = [
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
const suits = ["h", "d", "c", "s"];

export function createDeck(jokers: number = 0): Card[] {
  const deck: Card[] = [];

  for (const rank of ranks) {
    for (const suit of suits) {
      deck.push(`${rank}${suit}`);
    }
  }

  for (let i = 0; i < jokers; i++) {
    deck.push(i % 2 === 0 ? "O1" : "O2");
  }

  return deck;
}

export async function shuffleDeck(deck: Card[]): Promise<Card[]> {
  const shuffled = [...deck];

  for (let shuffle = 0; shuffle < 5; shuffle++) {
    if (shuffle > 0) {
      await new Promise((resolve) => setTimeout(resolve, shuffle));
    }

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  }

  return shuffled;
}

export function getCardValue(card: Card): number {
  if (card === "O1" || card === "O2") return 15;

  const rank = card.slice(0, -1);
  const values: Record<string, number> = {
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
