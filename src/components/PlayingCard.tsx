import { Card as CardType } from "../types/game";
import { Card } from "react-bootstrap";

interface PlayingCardProps {
  card: CardType | null;
  isHeld?: boolean;
  onToggleHold?: () => void;
  showHold?: boolean;
  isClickable?: boolean;
  onCardClick?: () => void;
}

export const PlayingCard = ({
  card,
  isHeld = false,
  onToggleHold,
  showHold = false,
  isClickable = false,
  onCardClick,
}: PlayingCardProps) => {
  const getCardImage = (card: CardType | null): string => {
    if (!card) {
      return "/cards/x.jpg";
    }

    if (card === "O1") return "/cards/O1.JPG";
    if (card === "O2") return "/cards/O2.JPG";

    // Convert card format like "Ah" to correct filename
    // Face cards (A, J, Q, K) use lowercase suits: Ah.JPG, Kd.JPG
    // Number cards (2-10) use uppercase suits: 2H.JPG, 10C.JPG
    const rank = card.slice(0, -1);
    const suit = card.slice(-1);

    if (["A", "J", "Q", "K"].includes(rank)) {
      // Face cards: keep suit lowercase
      return `/cards/${rank}${suit}.JPG`;
    } else {
      // Number cards: uppercase suit
      return `/cards/${rank}${suit.toUpperCase()}.JPG`;
    }
  };

  const handleImageClick = () => {
    if (showHold && onToggleHold) {
      onToggleHold();
    } else if (isClickable && onCardClick) {
      onCardClick();
    }
  };

  return (
    <div className="text-center">
      <Card
        style={{
          width: "200px",
          cursor: isClickable || showHold ? "pointer" : "default",
          border: isHeld ? "3px solid #ffc107" : "1px solid #dee2e6",
          opacity: isClickable && !showHold ? 0.9 : 1,
          transition: "all 0.2s ease",
        }}
        onClick={handleImageClick}
        onMouseEnter={(e) => {
          if (isClickable && !showHold) {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "scale(1.05)";
          }
        }}
        onMouseLeave={(e) => {
          if (isClickable && !showHold) {
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "scale(1)";
          }
        }}
      >
        <Card.Img
          variant="top"
          src={getCardImage(card)}
          alt={card || "hidden"}
        />
      </Card>
    </div>
  );
};
