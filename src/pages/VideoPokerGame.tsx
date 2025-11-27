import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useVideoPoker } from "../hooks/useVideoPoker";
import { PayoutTable } from "../components/PayoutTable";
import { CardHand } from "../components/CardHand";

export const VideoPokerGame = () => {
  const navigate = useNavigate();
  const {
    gameType,
    credits,
    sequence,
    hand,
    wager,
    heldCards,
    currentHand,
    payout,
    selectedCardIndex,
    setBet,
    dealCards,
    toggleHoldCard,
    drawCards,
    startDoubleDown,
    selectDoubleDownCard,
    returnToMenu,
    continueGame,
  } = useVideoPoker();

  if (!gameType) {
    navigate("/");
    return null;
  }

  const getBorderColor = (): string => {
    if (sequence === 2 && payout > 0) return "#808000"; // olive - win
    if (sequence === 2 && payout === 0 && currentHand !== "") return "#ff0000"; // red - lost
    if (currentHand !== "") return "#808000"; // olive - winning hand showing
    return "#000080"; // navy - default
  };

  const handleMainAction = () => {
    if (sequence === 0) {
      dealCards();
    } else if (sequence === 1) {
      drawCards();
    } else if (sequence === "d") {
      // waiting for double down selection
    }
  };

  const handleContinue = () => {
    continueGame();
  };

  const handleMainMenu = () => {
    returnToMenu();
    navigate("/");
  };

  const handleDoubleDown = () => {
    startDoubleDown();
  };

  const getButtonText = (): string => {
    if (sequence === 0) return "Show Cards";
    if (sequence === 1) return "Draw Cards";
    if (sequence === "d") return "Show Card";
    return "";
  };

  return (
    <Container
      fluid
      className="min-vh-100 py-4"
      style={{
        background: "linear-gradient(180deg, #3333cc 0%, #0000cc 100%)",
        color: "#ffffff",
      }}
    >
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          {/* Payout Table */}
          <div className="mb-3">
            <PayoutTable
              gameType={gameType}
              wager={wager}
              currentHand={currentHand}
            />
          </div>

          {/* Controls Row */}
          <Row className="mb-3 align-items-center">
            <Col md={4}>
              {/* Betting Options */}
              {sequence === 0 && credits > 0 && (
                <div className="d-flex gap-2 align-items-center">
                  <span style={{ color: "#ffff00", fontWeight: "bold" }}>
                    BET:
                  </span>
                  {[1, 2, 3, 4, 5].map((bet) => (
                    <Button
                      key={bet}
                      size="sm"
                      onClick={() => setBet(bet)}
                      disabled={credits < bet}
                      style={{
                        backgroundColor: wager === bet ? "#ffd700" : "#4d4d00",
                        color: wager === bet ? "#000000" : "#ffff00",
                        border: `2px solid ${wager === bet ? "#ffff00" : "#808000"}`,
                        fontWeight: "bold",
                        minWidth: "40px",
                      }}
                    >
                      {bet}
                    </Button>
                  ))}
                </div>
              )}
              {sequence === 2 && credits > 0 && (
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleMainMenu}
                    style={{
                      backgroundColor: "#666666",
                      color: "#ffffff",
                      border: "2px solid #cccccc",
                      fontWeight: "bold",
                    }}
                  >
                    MENU
                  </Button>
                  {payout > 0 && (
                    <Button
                      size="sm"
                      onClick={handleDoubleDown}
                      style={{
                        backgroundColor: "#ff6600",
                        color: "#ffffff",
                        border: "2px solid #ffd700",
                        fontWeight: "bold",
                      }}
                    >
                      DOUBLE DOWN
                    </Button>
                  )}
                </div>
              )}
            </Col>

            <Col md={4} className="text-center">
              {/* Action Button */}
              {(sequence === 0 || sequence === 1 || sequence === "d") && (
                <Button
                  size="lg"
                  onClick={handleMainAction}
                  style={{
                    visibility: sequence === "d" ? "hidden" : "visible",
                    backgroundColor: "#ffd700",
                    color: "#000000",
                    border: "3px solid #ffff00",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    padding: "10px 30px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  {getButtonText()}
                </Button>
              )}
              {sequence === 2 && credits > 0 && (
                <Button
                  size="lg"
                  onClick={handleContinue}
                  style={{
                    backgroundColor: "#00ff00",
                    color: "#000000",
                    border: "3px solid #00cc00",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    padding: "10px 30px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  CONTINUE
                </Button>
              )}
            </Col>

            <Col md={2} className="text-end">
              {/* Status Display */}
              {sequence === 2 && payout > 0 && (
                <Badge
                  className="fs-6 p-2"
                  style={{
                    backgroundColor: "#00ff00",
                    color: "#000000",
                    border: "2px solid #ffd700",
                    fontWeight: "bold",
                  }}
                >
                  WON ${payout}
                </Badge>
              )}
              {sequence === 2 && payout === 0 && currentHand !== "" && (
                <Badge
                  className="fs-6 p-2"
                  style={{
                    backgroundColor: "#ff0000",
                    color: "#ffffff",
                    border: "2px solid #000000",
                    fontWeight: "bold",
                  }}
                >
                  LOST
                </Badge>
              )}
            </Col>

            <Col md={2} className="text-end">
              {/* Credits Display */}
              <Badge
                className="fs-5 p-2"
                style={{
                  backgroundColor: "#000000",
                  color: "#ff6600",
                  border: "3px solid #ffd700",
                  fontWeight: "bold",
                  fontFamily: "monospace",
                }}
              >
                CREDIT ${credits}
              </Badge>
            </Col>
          </Row>

          {/* Card Hand */}
          <div className="mb-3">
            {sequence === 1 && (
              <div
                className="text-center mb-2 p-2"
                style={{
                  backgroundColor: "#000066",
                  border: "2px solid #ffd700",
                  borderRadius: "5px",
                }}
              >
                <p
                  className="mb-0"
                  style={{ color: "#00ff00", fontWeight: "bold" }}
                >
                  Click cards to hold them (yellow border), then click Draw
                  Cards
                </p>
              </div>
            )}
            {sequence === "d" && (
              <div
                className="text-center mb-2 p-2"
                style={{
                  backgroundColor: "#000066",
                  border: "2px solid #ffd700",
                  borderRadius: "5px",
                }}
              >
                <h5
                  className="mb-0"
                  style={{ color: "#ff6600", fontWeight: "bold" }}
                >
                  Double Down: Click a card to try to beat the dealer's card on
                  the left
                </h5>
              </div>
            )}
            <CardHand
              hand={hand}
              heldCards={heldCards}
              sequence={sequence}
              onToggleHold={toggleHoldCard}
              onSelectCard={selectDoubleDownCard}
              borderColor={getBorderColor()}
              selectedCardIndex={selectedCardIndex}
            />
          </div>

          {/* Game Over Message */}
          {credits === 0 && sequence === 2 && (
            <div className="text-center mt-4">
              <h3 className="text-danger">Game Over - Out of Credits</h3>
              <Button
                variant="primary"
                size="lg"
                onClick={handleMainMenu}
                className="mt-3"
              >
                Return to Main Menu
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};
