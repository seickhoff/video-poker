import { Card as CardType, GameSequence } from "../types/game";
import { PlayingCard } from "./PlayingCard";
import { Card } from "react-bootstrap";

interface CardHandProps {
  hand: CardType[];
  heldCards: boolean[];
  sequence: GameSequence;
  onToggleHold: (index: number) => void;
  onSelectCard?: (index: number) => void;
  borderColor?: string;
  selectedCardIndex?: number;
}

export const CardHand = ({
  hand,
  heldCards,
  sequence,
  onToggleHold,
  onSelectCard,
  borderColor = "#17a2b8",
  selectedCardIndex = -1,
}: CardHandProps) => {
  const getBorderColor = (): string => {
    if (borderColor !== "#17a2b8") return borderColor;
    return "#17a2b8";
  };

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
          isClickable={index > 0}
          onCardClick={() => onSelectCard && onSelectCard(index)}
        />
      ));
    }

    if (sequence === "e") {
      return hand.map((card, index) => (
        <PlayingCard
          key={index}
          card={index === 0 || index === selectedCardIndex ? card : null}
        />
      ));
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
    <Card
      style={{
        border: `5px solid ${getBorderColor()}`,
        backgroundColor: "#1a4d4d",
        padding: "20px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="d-flex justify-content-center gap-3">{renderCards()}</div>
    </Card>
  );
};
