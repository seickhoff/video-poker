import { useState, useEffect, useMemo } from "react";
import { Button } from "react-bootstrap";
import { Card, GameType } from "../types/game";
import { evaluateHand } from "../utils/handEvaluator";

interface PickAPairHelperProps {
  hand: Card[]; // [card1, card2, null, card3, card4]
  deck: Card[];
  wager: number;
}

interface CardChoice {
  index: number;
  card: Card;
  expectedValue: number;
  bestHandFrequency: Record<string, number>;
}

/**
 * Calculate expected value for picking a specific card in Pick-a-Pair
 * We simulate all possible 2-card draws from the remaining deck
 */
function calculateExpectedValue(
  baseCards: Card[], // First 2 cards that are auto-kept
  chosenCard: Card,
  deck: Card[],
  wager: number
): { expectedValue: number; handFrequency: Record<string, number> } {
  // Generate all possible 2-card combinations from the deck
  const combinations: Card[][] = [];
  for (let i = 0; i < deck.length; i++) {
    for (let j = i + 1; j < deck.length; j++) {
      combinations.push([deck[i], deck[j]]);
    }
  }

  let totalPayout = 0;
  const handFrequency: Record<string, number> = {};

  for (const [card1, card2] of combinations) {
    const finalHand: Card[] = [
      baseCards[0],
      baseCards[1],
      chosenCard,
      card1,
      card2,
    ];

    const { handType, payout } = evaluateHand(
      finalHand,
      GameType.PickAPairPoker,
      wager
    );
    totalPayout += payout;

    const handName = handType.toString();
    handFrequency[handName] = (handFrequency[handName] || 0) + 1;
  }

  const expectedValue = totalPayout / combinations.length;

  return { expectedValue, handFrequency };
}

/**
 * Format a card for display
 */
function formatCard(card: Card): string {
  if (!card || card === (null as any)) return "?";
  if (card === "O1" || card === "O2") return "Joker";

  const rank = card.slice(0, -1);
  const suit = card.slice(-1);
  const suitSymbols: Record<string, string> = {
    h: "♥",
    d: "♦",
    c: "♣",
    s: "♠",
  };

  return `${rank}${suitSymbols[suit] || suit}`;
}

export const PickAPairHelper = ({
  hand,
  deck,
  wager,
}: PickAPairHelperProps) => {
  const [showHint, setShowHint] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<{
    card3EV: number;
    card4EV: number;
    recommendation: 3 | 4;
  } | null>(null);

  // Reset when hand changes
  useEffect(() => {
    setShowHint(false);
    setResult(null);
  }, [hand]);

  // Calculate when hint is requested
  useEffect(() => {
    if (!showHint || result) return;

    // Validate we have the right structure
    if (hand.length !== 5 || !hand[0] || !hand[1] || !hand[3] || !hand[4]) {
      return;
    }

    setIsCalculating(true);

    // Use setTimeout to allow UI to update
    const timer = setTimeout(() => {
      try {
        const baseCards = [hand[0], hand[1]];
        const card3 = hand[3];
        const card4 = hand[4];

        // Filter out the choice cards from the deck for accurate calculation
        const availableDeck = deck.filter((c) => c !== card3 && c !== card4);

        const result3 = calculateExpectedValue(
          baseCards,
          card3,
          availableDeck,
          wager
        );
        const result4 = calculateExpectedValue(
          baseCards,
          card4,
          availableDeck,
          wager
        );

        setResult({
          card3EV: result3.expectedValue,
          card4EV: result4.expectedValue,
          recommendation:
            result3.expectedValue >= result4.expectedValue ? 3 : 4,
        });
      } catch (e) {
        console.error("Pick-a-Pair calculation error:", e);
      }
      setIsCalculating(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [showHint, result, hand, deck, wager]);

  const handleShowHint = () => {
    setShowHint(true);
  };

  // Format expected value
  const formatEV = (ev: number): string => {
    if (ev < 0.01 && ev > 0) return "<$0.01";
    return `$${ev.toFixed(2)}`;
  };

  if (!showHint) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "8px",
        }}
      >
        <Button
          size="sm"
          onClick={handleShowHint}
          style={{
            backgroundColor: "#9933ff",
            color: "#ffffff",
            border: "2px solid #cc66ff",
            fontWeight: "bold",
            fontSize: "clamp(0.65rem, 1.6vw, 0.85rem)",
            padding: "4px 12px",
            fontFamily: "monospace",
          }}
        >
          SHOW HINT
        </Button>
      </div>
    );
  }

  if (isCalculating || !result) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "8px",
          color: "#ffff00",
          fontFamily: "monospace",
          fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)",
        }}
      >
        Analyzing choices...
      </div>
    );
  }

  const card3 = hand[3];
  const card4 = hand[4];
  const betterCard = result.recommendation === 3 ? card3 : card4;
  const evDiff = Math.abs(result.card3EV - result.card4EV);

  return (
    <div
      style={{
        marginTop: "8px",
        padding: "8px",
        backgroundColor: "#330066",
        border: "2px solid #9933ff",
        borderRadius: "6px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
        }}
      >
        {/* Recommendation */}
        <div
          style={{
            color: "#ffff00",
            fontFamily: "monospace",
            fontWeight: "bold",
            fontSize: "clamp(0.7rem, 1.8vw, 0.95rem)",
            textAlign: "center",
          }}
        >
          PICK: {formatCard(betterCard)}
        </div>

        {/* Comparison */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            marginTop: "4px",
          }}
        >
          {/* Card 3 option */}
          <div
            style={{
              padding: "6px 12px",
              backgroundColor:
                result.recommendation === 3 ? "#006600" : "#333333",
              border: `2px solid ${
                result.recommendation === 3 ? "#00ff00" : "#666666"
              }`,
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#ffffff",
                fontFamily: "monospace",
                fontWeight: "bold",
                fontSize: "clamp(0.65rem, 1.6vw, 0.85rem)",
              }}
            >
              {formatCard(card3)}
            </div>
            <div
              style={{
                color: result.recommendation === 3 ? "#00ff00" : "#888888",
                fontFamily: "monospace",
                fontSize: "clamp(0.55rem, 1.4vw, 0.75rem)",
              }}
            >
              EV: {formatEV(result.card3EV)}
            </div>
          </div>

          {/* Card 4 option */}
          <div
            style={{
              padding: "6px 12px",
              backgroundColor:
                result.recommendation === 4 ? "#006600" : "#333333",
              border: `2px solid ${
                result.recommendation === 4 ? "#00ff00" : "#666666"
              }`,
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#ffffff",
                fontFamily: "monospace",
                fontWeight: "bold",
                fontSize: "clamp(0.65rem, 1.6vw, 0.85rem)",
              }}
            >
              {formatCard(card4)}
            </div>
            <div
              style={{
                color: result.recommendation === 4 ? "#00ff00" : "#888888",
                fontFamily: "monospace",
                fontSize: "clamp(0.55rem, 1.4vw, 0.75rem)",
              }}
            >
              EV: {formatEV(result.card4EV)}
            </div>
          </div>
        </div>

        {/* Advantage */}
        {evDiff > 0.001 && (
          <div
            style={{
              color: "#00ff00",
              fontFamily: "monospace",
              fontSize: "clamp(0.55rem, 1.4vw, 0.75rem)",
              textAlign: "center",
            }}
          >
            Advantage: +{formatEV(evDiff)}
          </div>
        )}

        {evDiff < 0.001 && (
          <div
            style={{
              color: "#ffff00",
              fontFamily: "monospace",
              fontSize: "clamp(0.55rem, 1.4vw, 0.75rem)",
              textAlign: "center",
            }}
          >
            Both choices are nearly equal
          </div>
        )}
      </div>
    </div>
  );
};
