import { Container, Row, Col, Button } from "react-bootstrap";
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

          {/* Help Bar */}
          <div className="mb-3">
            <div
              className="text-center p-2"
              style={{
                backgroundColor: "#000066",
                border: "2px solid #ffd700",
                borderRadius: "5px",
                minHeight: "45px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p
                className="mb-0"
                style={{
                  color: sequence === "d" ? "#ff6600" : "#00ff00",
                  fontWeight: "bold",
                }}
              >
                {sequence === 0 &&
                  "Select your bet amount, then click Show Cards."}
                {sequence === 1 &&
                  "Click cards to hold them, then click Draw Cards."}
                {sequence === 2 &&
                  payout > 0 &&
                  "You won! Click Continue to play again or Double Down to risk it."}
                {sequence === 2 &&
                  payout === 0 &&
                  currentHand !== "" &&
                  "You lost. Click Continue to play again."}
                {sequence === 2 &&
                  payout === 0 &&
                  currentHand === "" &&
                  "Click Continue to play again."}
                {sequence === "d" &&
                  "Double Down: Click a card to try to beat the dealer's card on the left."}
                {sequence === "e" && ""}
              </p>
            </div>
          </div>

          {/* Controls Row */}
          <Row className="mb-1">
            {sequence === 1 || sequence === "d" ? (
              <Col className="d-flex align-items-center justify-content-center">
                <Button
                  size="lg"
                  onClick={handleMainAction}
                  style={{
                    visibility: sequence === "d" ? "hidden" : "visible",
                    backgroundColor: "#ffd700",
                    color: "#000000",
                    border: "3px solid #ffff00",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    padding: "8px 16px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                    fontFamily: "monospace",
                    minWidth: "150px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {getButtonText()}
                </Button>
              </Col>
            ) : sequence === 2 && credits > 0 ? (
              <>
                <Col md={3} className="d-flex align-items-center">
                  <Button
                    size="lg"
                    onClick={handleMainMenu}
                    style={{
                      backgroundColor: "#666666",
                      color: "#ffffff",
                      border: "3px solid #cccccc",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      padding: "8px 16px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                      fontFamily: "monospace",
                      minWidth: "150px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    MENU
                  </Button>
                </Col>
                <Col
                  md={6}
                  className="d-flex align-items-center justify-content-center gap-3"
                >
                  {payout > 0 ? (
                    <>
                      <Button
                        size="lg"
                        onClick={handleDoubleDown}
                        style={{
                          backgroundColor: "#ff6600",
                          color: "#ffffff",
                          border: "3px solid #ffd700",
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                          padding: "8px 16px",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                          fontFamily: "monospace",
                          minWidth: "150px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        DOUBLE DOWN
                      </Button>
                      <Button
                        size="lg"
                        onClick={handleContinue}
                        style={{
                          backgroundColor: "#00ff00",
                          color: "#000000",
                          border: "3px solid #00cc00",
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                          padding: "8px 16px",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                          fontFamily: "monospace",
                          minWidth: "150px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        CONTINUE
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="lg"
                      onClick={handleContinue}
                      style={{
                        backgroundColor: "#00ff00",
                        color: "#000000",
                        border: "3px solid #00cc00",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        padding: "8px 16px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                        fontFamily: "monospace",
                        minWidth: "150px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      CONTINUE
                    </Button>
                  )}
                </Col>
                <Col
                  md={3}
                  className="d-flex align-items-center justify-content-end gap-3 flex-nowrap"
                >
                  {/* Status Display */}
                  {payout > 0 ? (
                    <div
                      style={{
                        backgroundColor: "#00ff00",
                        color: "#000000",
                        border: "3px solid #ffd700",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        padding: "8px 16px",
                        fontFamily: "monospace",
                        minWidth: "150px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      WON ${payout}
                    </div>
                  ) : (
                    <div
                      style={{
                        backgroundColor: "#ff0000",
                        color: "#ffffff",
                        border: "3px solid #000000",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        padding: "8px 16px",
                        fontFamily: "monospace",
                        minWidth: "150px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      LOST
                    </div>
                  )}
                </Col>
              </>
            ) : sequence === 0 && credits > 0 ? (
              <>
                <Col md={3} className="d-flex align-items-center gap-3">
                  {/* Betting Options */}
                  <div className="d-flex gap-2 align-items-center">
                    <span style={{ color: "#ffff00", fontWeight: "bold" }}>
                      BET
                    </span>
                    {[1, 2, 3, 4, 5].map((bet) => (
                      <Button
                        key={bet}
                        size="sm"
                        onClick={() => setBet(bet)}
                        disabled={credits < bet}
                        style={{
                          backgroundColor:
                            wager === bet ? "#ffd700" : "#4d4d00",
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
                </Col>

                <Col
                  md={6}
                  className="d-flex align-items-center justify-content-center"
                >
                  <Button
                    size="lg"
                    onClick={handleMainAction}
                    style={{
                      backgroundColor: "#ffd700",
                      color: "#000000",
                      border: "3px solid #ffff00",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      padding: "8px 16px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                      fontFamily: "monospace",
                      minWidth: "150px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {getButtonText()}
                  </Button>
                </Col>

                <Col
                  md={3}
                  className="d-flex align-items-center justify-content-end gap-3 flex-nowrap"
                ></Col>
              </>
            ) : (
              <Col></Col>
            )}
          </Row>

          {/* Card Hand */}
          <div className="mb-2">
            <CardHand
              hand={hand}
              heldCards={heldCards}
              sequence={sequence}
              onToggleHold={toggleHoldCard}
              onSelectCard={selectDoubleDownCard}
              selectedCardIndex={selectedCardIndex}
            />
          </div>

          {/* Credits Display Below Cards */}
          <Row className="mb-3">
            <Col className="d-flex justify-content-end">
              <div
                style={{
                  backgroundColor: "#000000",
                  color: "#ff6600",
                  border: "3px solid #ffd700",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontFamily: "monospace",
                  fontSize: "1.1rem",
                  padding: "8px 16px",
                  minWidth: "150px",
                  whiteSpace: "nowrap",
                }}
              >
                CREDIT ${credits}
              </div>
            </Col>
          </Row>

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
