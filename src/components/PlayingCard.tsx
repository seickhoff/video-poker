import { Card as CardType } from "../types/game";
import { Card } from "react-bootstrap";

interface PlayingCardProps {
  card: CardType | null;
  isHeld?: boolean;
  onToggleHold?: () => void;
  showHold?: boolean;
  isClickable?: boolean;
  onCardClick?: () => void;
  isSelected?: boolean;
  disableHover?: boolean;
  shouldDiscard?: boolean;
  hideLabel?: boolean;
}

export const PlayingCard = ({
  card,
  isHeld = false,
  onToggleHold,
  showHold = false,
  isClickable = false,
  onCardClick,
  isSelected = false,
  disableHover = false,
  shouldDiscard = false,
  hideLabel = false,
}: PlayingCardProps) => {
  const getCardImage = (card: CardType | null): string => {
    if (!card) {
      return "/svg/X.svg";
    }

    if (card === "O1") return "/svg/O1.svg";
    if (card === "O2") return "/svg/O2.svg";

    // Convert card format like "Ah" to correct SVG filename
    // All SVG files use uppercase: AC.svg, KD.svg, 2H.svg, 10C.svg
    const rank = card.slice(0, -1);
    const suit = card.slice(-1).toUpperCase();

    return `/svg/${rank}${suit}.svg`;
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showHold && onToggleHold) {
      // Reset transform immediately when card is clicked
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.opacity = "1";
      onToggleHold();
    } else if (isClickable && onCardClick) {
      // Reset transform immediately when card is clicked
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.opacity = "1";
      onCardClick();
    }
  };

  return (
    <>
      <style>{`
        @keyframes cardDiscard {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
      <div className="text-center" style={{ flex: "1 1 0", minWidth: 0 }}>
        {/* Reserved space for HELD/SELECTED label */}
        {!hideLabel && (
          <div
            style={{
              height: "clamp(25px, 5vw, 35px)",
              marginBottom: "5px",
              fontWeight: "bold",
              fontSize: "clamp(0.75rem, 2vw, 1.2rem)",
              color: "#ffffff",
              fontFamily: "monospace",
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isHeld && showHold ? "HELD" : ""}
            {isSelected ? "SELECTED" : ""}
          </div>
        )}
        <Card
          style={{
            width: "100%",
            aspectRatio: "5 / 7",
            cursor: isClickable || showHold ? "pointer" : "default",
            border: "none",
            opacity: isClickable && !showHold && !isSelected ? 0.9 : 1,
            transition: shouldDiscard ? "none" : "all 0.2s ease",
            overflow: "visible",
            transform: "scale(1)",
            animation: shouldDiscard
              ? `cardDiscard 0.2s ease-out both`
              : "none",
          }}
          onClick={handleImageClick}
          onMouseEnter={(e) => {
            if (disableHover) return;
            if (showHold && !isHeld) {
              e.currentTarget.style.transform = "scale(1.05)";
            } else if (isClickable && !isSelected) {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={(e) => {
            if (disableHover) return;
            if (showHold && !isHeld) {
              e.currentTarget.style.transform = "scale(1)";
            } else if (isClickable && !isSelected) {
              e.currentTarget.style.opacity = "0.9";
              e.currentTarget.style.transform = "scale(1)";
            }
          }}
        >
          <Card.Img
            variant="top"
            src={getCardImage(card)}
            alt={card || "hidden"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "fill",
            }}
          />
        </Card>
      </div>
    </>
  );
};
