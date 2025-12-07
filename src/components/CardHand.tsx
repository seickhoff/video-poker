import { useState, useEffect } from "react";
import { Card as CardType, GameSequence } from "../types/game";
import { PlayingCard } from "./PlayingCard";
import { useVideoPoker } from "../hooks/useVideoPoker";

interface CardHandProps {
  hand: CardType[];
  heldCards: boolean[];
  sequence: GameSequence;
  onToggleHold: (index: number) => void;
  onSelectCard?: (index: number) => void;
  selectedCardIndex?: number;
}

export const CardHand = ({
  hand,
  heldCards,
  sequence,
  onToggleHold,
  onSelectCard,
  selectedCardIndex = -1,
}: CardHandProps) => {
  const { gameType } = useVideoPoker();
  const [previousSequence, setPreviousSequence] =
    useState<GameSequence>(sequence);
  const [isDiscarding, setIsDiscarding] = useState(false);

  // Detect when sequence changes from 1 to 2 (standard games drawing)
  useEffect(() => {
    if (
      previousSequence === 1 &&
      sequence === 2 &&
      gameType !== "Pick-a-Pair Poker"
    ) {
      // Start discard animation
      setIsDiscarding(true);

      // All cards discard simultaneously (no stagger), just the animation duration
      const discardDuration = 200; // Animation duration
      const totalDiscardTime = discardDuration;

      // After discard completes, show reveal animation
      const timer = setTimeout(() => {
        setIsDiscarding(false);
      }, totalDiscardTime);

      return () => clearTimeout(timer);
    }
    setPreviousSequence(sequence);
  }, [sequence, previousSequence, gameType]);

  const renderCards = () => {
    if (sequence === 0) {
      // Pick-a-Pair Poker: Show invisible cards with same layout as sequence 1
      if (gameType === "Pick-a-Pair Poker") {
        return Array(5)
          .fill(null)
          .map((_, index) => {
            // Index 2 is an empty space (maintains layout)
            if (index === 2) {
              return <div key={index} style={{ flex: 1 }} />;
            }
            // All cards invisible but maintain spacing
            return (
              <div
                key={index}
                style={{
                  flex: "1 1 0",
                  minWidth: 0,
                  marginRight:
                    index === 3
                      ? "3%"
                      : index === 4
                        ? "clamp(8px, 1vw, 0px)"
                        : "0",
                  opacity: 0,
                  pointerEvents: "none",
                }}
              >
                <PlayingCard card={null} />
              </div>
            );
          });
      }
      // Standard games: show 5 face-down cards
      return Array(5)
        .fill(null)
        .map((_, index) => <PlayingCard key={index} card={null} />);
    }

    // Pick-a-Pair Poker special rendering during selection (sequence 1)
    if (gameType === "Pick-a-Pair Poker" && sequence === 1) {
      return hand.map((card, index) => {
        // Index 2 is an empty space (maintains layout)
        if (index === 2) {
          return <div key={index} style={{ flex: 1 }} />;
        }
        // Indices 0, 1 are auto-held (simple HELD label)
        if (index < 2) {
          return (
            <div
              key={index}
              style={{
                flex: "1 1 0",
                minWidth: 0,
              }}
            >
              <PlayingCard card={card} isHeld={true} showHold={true} />
            </div>
          );
        }
        // Indices 3, 4 are selectable with face-down cards underneath on left
        return (
          <div
            key={index}
            style={{
              flex: "1 1 0",
              minWidth: 0,
              marginRight:
                index === 3 ? "3%" : index === 4 ? "clamp(8px, 1vw, 0px)" : "0",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0,
                pointerEvents: "none",
                transform:
                  "translate(clamp(4px, 2vw, 16px), clamp(4px, 2vw, 16px))",
                border: "clamp(0.5px, 0.25vw, 2px) solid #0000cc",
                borderRadius: "clamp(10px, 1.5vw, 12px)",
              }}
            >
              <PlayingCard card={null} />
            </div>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
                pointerEvents: "none",
                transform:
                  "translate(clamp(2px, 1vw, 8px), clamp(2px, 1vw, 8px))",
                border: "clamp(0.5px, 0.25vw, 2px) solid #0000cc",
                borderRadius: "clamp(10px, 1.5vw, 12px)",
              }}
            >
              <PlayingCard card={null} />
            </div>
            <div
              style={{
                position: "relative",
                cursor: heldCards[index] ? "default" : "pointer",
                zIndex: 2,
                border: "clamp(0.5px, 0.25vw, 2px) solid #0000cc",
                borderRadius: "clamp(10px, 1.5vw, 12px)",
              }}
              onClick={() => {
                if (!heldCards[index]) {
                  onToggleHold(index);
                }
              }}
            >
              <PlayingCard
                card={card}
                isHeld={heldCards[index]}
                showHold={true}
                disableHover={true}
              />
            </div>
          </div>
        );
      });
    }

    if (sequence === "d") {
      return hand.map((card, index) => (
        <PlayingCard
          key={index}
          card={index === 0 ? card : null}
          isClickable={index > 0 && selectedCardIndex === -1}
          isSelected={index === selectedCardIndex && index > 0}
          onCardClick={() => onSelectCard && onSelectCard(index)}
        />
      ));
    }

    if (sequence === "e") {
      return hand.map((card, index) => {
        // Show dealer's card (index 0) and selected card, hide others
        const shouldShowCard = index === 0 || index === selectedCardIndex;
        return (
          <PlayingCard
            key={index}
            card={shouldShowCard ? card : null}
            isSelected={index === selectedCardIndex && index > 0}
          />
        );
      });
    }

    // Sequence 2 during double down - show dealer card and selected card only
    if (sequence === 2 && selectedCardIndex > 0) {
      return hand.map((card, index) => {
        const shouldShowCard = index === 0 || index === selectedCardIndex;
        return (
          <PlayingCard
            key={index}
            card={shouldShowCard ? card : null}
            isSelected={index === selectedCardIndex && index > 0}
          />
        );
      });
    }

    return hand.map((card, index) => (
      <PlayingCard
        key={index}
        card={card}
        isHeld={heldCards[index]}
        onToggleHold={() => onToggleHold(index)}
        showHold={sequence === 1}
        shouldDiscard={sequence === 2 && !heldCards[index] && isDiscarding}
      />
    ));
  };

  return (
    <div
      style={{
        backgroundColor: "transparent",
        border: "none",
        padding: "5px 0 10px 0",
        transform: sequence === 1 ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.3s ease",
      }}
    >
      <div
        className="d-flex justify-content-between"
        style={{
          width: "100%",
          gap: "1.5%",
        }}
      >
        {renderCards()}
      </div>
    </div>
  );
};
