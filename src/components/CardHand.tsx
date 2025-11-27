import { Card as CardType, GameSequence } from "../types/game";
import { PlayingCard } from "./PlayingCard";

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
  const renderCards = () => {
    if (sequence === 0) {
      return Array(5)
        .fill(null)
        .map((_, index) => <PlayingCard key={index} card={null} />);
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
      />
    ));
  };

  return (
    <div
      style={{
        backgroundColor: "transparent",
        border: "none",
        padding: "5px 0 10px 0",
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
