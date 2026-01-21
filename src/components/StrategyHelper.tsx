import { useState, useEffect, useMemo } from "react";
import { Button } from "react-bootstrap";
import { Card, GameType } from "../types/game";
import { getOptimalHold } from "../utils/optimalStrategy";
import { getOptimalStrategy } from "../utils/videoPokerStrategy";

interface StrategyHelperProps {
  hand: Card[];
  deck: Card[];
  gameType: GameType;
  wager: number;
  currentHeldCards: boolean[];
  onApplyRecommendation?: (holdPattern: boolean[]) => void;
}

export const StrategyHelper = ({
  hand,
  deck,
  gameType,
  wager,
  currentHeldCards,
  onApplyRecommendation,
}: StrategyHelperProps) => {
  const [showHint, setShowHint] = useState(false);
  const [useExactCalc, setUseExactCalc] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [exactResult, setExactResult] = useState<{
    optimalHold: boolean[];
    expectedValue: number;
    description: string;
  } | null>(null);

  // Reset hint when hand changes
  useEffect(() => {
    setShowHint(false);
    setExactResult(null);
    setUseExactCalc(false);
  }, [hand]);

  // Fast strategy using pattern rules (instant) - works for all game types
  const fastRecommendation = useMemo(() => {
    if (!showHint || hand.length !== 5) return null;

    try {
      const result = getOptimalStrategy(hand, gameType);
      return {
        optimalHold: result.holdPattern,
        description: result.description,
        rule: result.rule,
      };
    } catch (e) {
      console.error("Strategy calculation error:", e);
      return null;
    }
  }, [showHint, hand, gameType]);

  // Trigger exact calculation when requested
  useEffect(() => {
    if (!useExactCalc || !showHint || hand.length !== 5) return;
    if (exactResult) return; // Already calculated

    setIsCalculating(true);

    // Use setTimeout to allow UI to update before heavy calculation
    const timer = setTimeout(() => {
      const result = getOptimalHold(hand, deck, gameType, wager);
      setExactResult(result);
      setIsCalculating(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [useExactCalc, showHint, hand, deck, gameType, wager, exactResult]);

  // Current recommendation (fast or exact)
  const recommendation =
    useExactCalc && exactResult ? exactResult : fastRecommendation;

  // Check if current selection matches recommendation
  const isOptimalPlay = useMemo(() => {
    if (!recommendation) return false;
    return currentHeldCards.every(
      (held, i) => held === recommendation.optimalHold[i]
    );
  }, [recommendation, currentHeldCards]);

  const handleShowHint = () => {
    setShowHint(true);
  };

  const handleApplyHint = () => {
    if (recommendation && onApplyRecommendation) {
      onApplyRecommendation(recommendation.optimalHold);
    }
  };

  const handleToggleExact = () => {
    setUseExactCalc(!useExactCalc);
  };

  // Format expected value for display
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

  if (!recommendation) {
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
        Strategy not available for this game type
      </div>
    );
  }

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
      {/* Recommendation header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
        }}
      >
        {/* Optimal play description */}
        <div
          style={{
            color: "#ffff00",
            fontFamily: "monospace",
            fontWeight: "bold",
            fontSize: "clamp(0.7rem, 1.8vw, 0.95rem)",
            textAlign: "center",
          }}
        >
          OPTIMAL: {recommendation.description}
        </div>

        {/* Expected value (only shown for exact calculation) */}
        {useExactCalc && exactResult && (
          <div
            style={{
              color: "#00ff00",
              fontFamily: "monospace",
              fontSize: "clamp(0.65rem, 1.6vw, 0.85rem)",
              textAlign: "center",
            }}
          >
            Expected Value: {formatEV(exactResult.expectedValue)}
          </div>
        )}

        {/* Calculating indicator */}
        {useExactCalc && isCalculating && (
          <div
            style={{
              color: "#ffff00",
              fontFamily: "monospace",
              fontSize: "clamp(0.6rem, 1.5vw, 0.8rem)",
              textAlign: "center",
            }}
          >
            Calculating exact EV...
          </div>
        )}

        {/* Visual hold pattern */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            marginTop: "4px",
          }}
        >
          {recommendation.optimalHold.map((shouldHold, index) => (
            <div
              key={index}
              style={{
                width: "clamp(28px, 6vw, 40px)",
                height: "clamp(22px, 4.5vw, 30px)",
                backgroundColor: shouldHold ? "#00cc00" : "#cc0000",
                border: `2px solid ${shouldHold ? "#00ff00" : "#ff0000"}`,
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "monospace",
                fontWeight: "bold",
                fontSize: "clamp(0.55rem, 1.4vw, 0.75rem)",
                color: "#ffffff",
              }}
            >
              {shouldHold ? "HOLD" : "TOSS"}
            </div>
          ))}
        </div>

        {/* Status and action */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            marginTop: "4px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {isOptimalPlay ? (
            <span
              style={{
                color: "#00ff00",
                fontFamily: "monospace",
                fontWeight: "bold",
                fontSize: "clamp(0.65rem, 1.6vw, 0.85rem)",
              }}
            >
              Your selection is optimal!
            </span>
          ) : (
            <>
              <span
                style={{
                  color: "#ff6600",
                  fontFamily: "monospace",
                  fontSize: "clamp(0.6rem, 1.5vw, 0.8rem)",
                }}
              >
                Not optimal
              </span>
              {onApplyRecommendation && (
                <Button
                  size="sm"
                  onClick={handleApplyHint}
                  style={{
                    backgroundColor: "#00cc00",
                    color: "#000000",
                    border: "2px solid #00ff00",
                    fontWeight: "bold",
                    fontSize: "clamp(0.55rem, 1.4vw, 0.75rem)",
                    padding: "2px 8px",
                    fontFamily: "monospace",
                  }}
                >
                  APPLY
                </Button>
              )}
            </>
          )}
        </div>

        {/* Toggle for exact calculation */}
        <div
          style={{
            marginTop: "6px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Button
            size="sm"
            onClick={handleToggleExact}
            disabled={isCalculating}
            style={{
              backgroundColor: useExactCalc ? "#666600" : "#333333",
              color: "#ffffff",
              border: `1px solid ${useExactCalc ? "#999900" : "#666666"}`,
              fontWeight: "normal",
              fontSize: "clamp(0.5rem, 1.2vw, 0.7rem)",
              padding: "2px 6px",
              fontFamily: "monospace",
            }}
          >
            {useExactCalc ? "Using Exact Calc" : "Use Exact Calc"}
          </Button>
          <span
            style={{
              color: "#888888",
              fontFamily: "monospace",
              fontSize: "clamp(0.5rem, 1.2vw, 0.65rem)",
            }}
          >
            {useExactCalc ? "(slower, shows EV)" : "(fast rules)"}
          </span>
        </div>
      </div>
    </div>
  );
};
