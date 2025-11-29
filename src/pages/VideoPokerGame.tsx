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
    if (sequence === 1) return "DRAW";
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
                height: "clamp(50px, 10vw, 60px)",
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
                  fontSize: "clamp(0.75rem, 2vw, 1rem)",
                }}
              >
                {sequence === 0 &&
                  "Select your bet amount, then click Show Cards."}
                {sequence === 1 &&
                  gameType !== "Pick-a-Pair Poker" &&
                  "Click cards to hold them, then click DRAW."}
                {sequence === 1 &&
                  gameType === "Pick-a-Pair Poker" &&
                  "First 2 cards are kept. Choose ONE card from the right pair, then click DRAW."}
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

          {/* Controls - Two Row Layout */}

          {/* Sequence 0: Betting */}
          {sequence === 0 && credits > 0 && (
            <>
              {/* Mobile: Row 1 - Bet Selection and Credit */}
              <Row className="mb-4 d-md-none">
                <Col
                  xs={12}
                  className="d-flex align-items-center justify-content-between"
                >
                  {/* Betting Options */}
                  <div className="d-flex gap-2 align-items-center">
                    <span
                      style={{
                        color: "#ffff00",
                        fontWeight: "bold",
                        fontSize: "clamp(0.8rem, 2vw, 1rem)",
                      }}
                    >
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
                          minWidth: "clamp(25px, 6vw, 40px)",
                          fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)",
                          padding:
                            "clamp(2px, 0.5vw, 4px) clamp(4px, 1vw, 8px)",
                        }}
                      >
                        {bet}
                      </Button>
                    ))}
                  </div>
                  <div
                    style={{
                      color: "#ff6600",
                      fontWeight: "bold",
                      fontFamily: "monospace",
                      fontSize: "clamp(0.9rem, 2.5vw, 1.5rem)",
                      WebkitTextStroke: "clamp(0.5px, 0.15vw, 1px) #ffff00",
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    CREDIT ${credits}
                  </div>
                </Col>
              </Row>
              {/* Mobile: Row 2 - Show Cards Button */}
              <Row className="mb-3 d-md-none">
                <Col xs={12} className="d-flex justify-content-center">
                  <Button
                    size="lg"
                    onClick={handleMainAction}
                    style={{
                      backgroundColor: "#ffd700",
                      color: "#000000",
                      border: "3px solid #ffff00",
                      fontWeight: "bold",
                      fontSize: "clamp(0.8rem, 2vw, 1.1rem)",
                      padding: "clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px)",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                      fontFamily: "monospace",
                      minWidth: "clamp(80px, 20vw, 150px)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {getButtonText()}
                  </Button>
                </Col>
              </Row>
              {/* Desktop: Single Row */}
              <Row className="mb-3 d-none d-md-flex">
                <Col md={3} className="d-flex align-items-center gap-3">
                  {/* Betting Options */}
                  <div className="d-flex gap-2 align-items-center">
                    <span
                      style={{
                        color: "#ffff00",
                        fontWeight: "bold",
                        fontSize: "clamp(0.8rem, 2vw, 1rem)",
                      }}
                    >
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
                          minWidth: "clamp(25px, 6vw, 40px)",
                          fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)",
                          padding:
                            "clamp(2px, 0.5vw, 4px) clamp(4px, 1vw, 8px)",
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
                      fontSize: "clamp(0.8rem, 2vw, 1.1rem)",
                      padding: "clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px)",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                      fontFamily: "monospace",
                      minWidth: "clamp(80px, 20vw, 150px)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {getButtonText()}
                  </Button>
                </Col>
                <Col
                  md={3}
                  className="d-flex align-items-center justify-content-end"
                >
                  <div
                    style={{
                      color: "#ff6600",
                      fontWeight: "bold",
                      fontFamily: "monospace",
                      fontSize: "clamp(0.9rem, 2.5vw, 1.5rem)",
                      WebkitTextStroke: "clamp(0.5px, 0.15vw, 1px) #ffff00",
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    CREDIT ${credits}
                  </div>
                </Col>
              </Row>
            </>
          )}

          {/* Sequence 1: DRAW */}
          {sequence === 1 && (
            <>
              {/* Mobile: Row 1 - BET and CREDIT */}
              <Row className="mb-4 d-md-none">
                <Col
                  xs={12}
                  className="d-flex align-items-center justify-content-between"
                >
                  <div
                    style={{
                      color: "#ff6600",
                      fontWeight: "bold",
                      fontFamily: "monospace",
                      fontSize: "clamp(0.9rem, 2.5vw, 1.5rem)",
                      WebkitTextStroke: "clamp(0.5px, 0.15vw, 1px) #ffff00",
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    BET {wager}
                  </div>
                  <div
                    style={{
                      color: "#ff6600",
                      fontWeight: "bold",
                      fontFamily: "monospace",
                      fontSize: "clamp(0.9rem, 2.5vw, 1.5rem)",
                      WebkitTextStroke: "clamp(0.5px, 0.15vw, 1px) #ffff00",
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    CREDIT ${credits}
                  </div>
                </Col>
              </Row>
              {/* Mobile: Row 2 - DRAW Button */}
              <Row className="mb-3 d-md-none">
                <Col xs={12} className="d-flex justify-content-center">
                  <Button
                    size="lg"
                    onClick={handleMainAction}
                    style={{
                      backgroundColor: "#ffd700",
                      color: "#000000",
                      border: "3px solid #ffff00",
                      fontWeight: "bold",
                      fontSize: "clamp(0.8rem, 2vw, 1.1rem)",
                      padding: "clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px)",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                      fontFamily: "monospace",
                      minWidth: "clamp(80px, 20vw, 150px)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {getButtonText()}
                  </Button>
                </Col>
              </Row>
              {/* Desktop: Single Row */}
              <Row className="mb-3 d-none d-md-flex">
                <Col md={3} className="d-flex align-items-center">
                  <div
                    style={{
                      color: "#ff6600",
                      fontWeight: "bold",
                      fontFamily: "monospace",
                      fontSize: "clamp(0.9rem, 2.5vw, 1.5rem)",
                      WebkitTextStroke: "clamp(0.5px, 0.15vw, 1px) #ffff00",
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    BET {wager}
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
                      fontSize: "clamp(0.8rem, 2vw, 1.1rem)",
                      padding: "clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px)",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                      fontFamily: "monospace",
                      minWidth: "clamp(80px, 20vw, 150px)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {getButtonText()}
                  </Button>
                </Col>
                <Col
                  md={3}
                  className="d-flex align-items-center justify-content-end"
                >
                  <div
                    style={{
                      color: "#ff6600",
                      fontWeight: "bold",
                      fontFamily: "monospace",
                      fontSize: "clamp(0.9rem, 2.5vw, 1.5rem)",
                      WebkitTextStroke: "clamp(0.5px, 0.15vw, 1px) #ffff00",
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    CREDIT ${credits}
                  </div>
                </Col>
              </Row>
            </>
          )}

          {/* Sequence 2: Results */}
          {sequence === 2 && credits > 0 && (
            <>
              {/* Mobile: Row 1 - WIN/LOSE and CREDIT */}
              <Row className="mb-4 d-md-none">
                <Col
                  xs={12}
                  className="d-flex align-items-center justify-content-between"
                >
                  {payout > 0 ? (
                    <div
                      style={{
                        color: "#00ff00",
                        fontWeight: "bold",
                        fontFamily: "monospace",
                        fontSize: "clamp(0.8rem, 2.2vw, 1.5rem)",
                        WebkitTextStroke: "clamp(0.5px, 0.15vw, 1px) #00cc00",
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      WIN ${payout}
                    </div>
                  ) : (
                    <div
                      style={{
                        color: "#ff0000",
                        fontWeight: "bold",
                        fontFamily: "monospace",
                        fontSize: "clamp(0.8rem, 2.2vw, 1.5rem)",
                        WebkitTextStroke: "clamp(0.5px, 0.15vw, 1px) #cc0000",
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      LOSE
                    </div>
                  )}
                  <div
                    style={{
                      color: "#ff6600",
                      fontWeight: "bold",
                      fontFamily: "monospace",
                      fontSize: "clamp(0.9rem, 2.5vw, 1.5rem)",
                      WebkitTextStroke: "clamp(0.5px, 0.15vw, 1px) #ffff00",
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    CREDIT ${credits}
                  </div>
                </Col>
              </Row>
              {/* Mobile: Row 2 - Buttons */}
              <Row className="mb-3 d-md-none">
                <Col
                  xs={12}
                  className="d-flex align-items-center justify-content-center gap-3"
                >
                  <Button
                    variant=""
                    size="lg"
                    onClick={handleMainMenu}
                    style={{
                      backgroundColor: "#666666",
                      color: "#ffffff",
                      border: "3px solid #cccccc",
                      fontWeight: "bold",
                      fontSize: "clamp(0.7rem, 1.8vw, 1.1rem)",
                      padding: "clamp(4px, 1vw, 8px) clamp(6px, 1.5vw, 16px)",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                      fontFamily: "monospace",
                      minWidth: "clamp(60px, 15vw, 120px)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    MENU
                  </Button>
                  {payout > 0 && (
                    <Button
                      size="lg"
                      onClick={handleDoubleDown}
                      style={{
                        backgroundColor: "#ff6600",
                        color: "#ffffff",
                        border: "3px solid #ffd700",
                        fontWeight: "bold",
                        fontSize: "clamp(0.7rem, 1.8vw, 1.1rem)",
                        padding: "clamp(4px, 1vw, 8px) clamp(6px, 1.5vw, 16px)",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                        fontFamily: "monospace",
                        minWidth: "clamp(70px, 18vw, 120px)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      DOUBLE DOWN
                    </Button>
                  )}
                  <Button
                    size="lg"
                    onClick={handleContinue}
                    style={{
                      backgroundColor: "#00ff00",
                      color: "#000000",
                      border: "3px solid #00cc00",
                      fontWeight: "bold",
                      fontSize: "clamp(0.7rem, 1.8vw, 1.1rem)",
                      padding: "clamp(4px, 1vw, 8px) clamp(6px, 1.5vw, 16px)",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                      fontFamily: "monospace",
                      minWidth: "clamp(70px, 18vw, 120px)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    CONTINUE
                  </Button>
                </Col>
              </Row>
              {/* Desktop: Single Row */}
              <Row className="mb-3 d-none d-md-flex">
                <Col md={3} className="d-flex align-items-center">
                  <Button
                    variant=""
                    size="lg"
                    onClick={handleMainMenu}
                    style={{
                      backgroundColor: "#666666",
                      color: "#ffffff",
                      border: "3px solid #cccccc",
                      fontWeight: "bold",
                      fontSize: "clamp(0.8rem, 2vw, 1.1rem)",
                      padding: "clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px)",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                      fontFamily: "monospace",
                      minWidth: "clamp(60px, 15vw, 150px)",
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
                  {payout > 0 && (
                    <Button
                      size="lg"
                      onClick={handleDoubleDown}
                      style={{
                        backgroundColor: "#ff6600",
                        color: "#ffffff",
                        border: "3px solid #ffd700",
                        fontWeight: "bold",
                        fontSize: "clamp(0.7rem, 1.8vw, 1.1rem)",
                        padding: "clamp(4px, 1vw, 8px) clamp(6px, 1.5vw, 16px)",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                        fontFamily: "monospace",
                        minWidth: "clamp(70px, 18vw, 150px)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      DOUBLE DOWN
                    </Button>
                  )}
                  <Button
                    size="lg"
                    onClick={handleContinue}
                    style={{
                      backgroundColor: "#00ff00",
                      color: "#000000",
                      border: "3px solid #00cc00",
                      fontWeight: "bold",
                      fontSize: "clamp(0.8rem, 2vw, 1.1rem)",
                      padding: "clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px)",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                      fontFamily: "monospace",
                      minWidth: "clamp(80px, 20vw, 150px)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    CONTINUE
                  </Button>
                </Col>
                <Col
                  md={3}
                  className="d-flex align-items-center justify-content-end gap-3 flex-nowrap"
                >
                  <div className="d-flex gap-4 align-items-center flex-nowrap">
                    {payout > 0 ? (
                      <div
                        style={{
                          color: "#00ff00",
                          fontWeight: "bold",
                          fontFamily: "monospace",
                          fontSize: "clamp(0.8rem, 2.2vw, 1.5rem)",
                          WebkitTextStroke: "clamp(0.5px, 0.15vw, 1px) #00cc00",
                          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        WIN ${payout}
                      </div>
                    ) : (
                      <div
                        style={{
                          color: "#ff0000",
                          fontWeight: "bold",
                          fontFamily: "monospace",
                          fontSize: "clamp(0.8rem, 2.2vw, 1.5rem)",
                          WebkitTextStroke: "clamp(0.5px, 0.15vw, 1px) #cc0000",
                          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        LOSE
                      </div>
                    )}
                    <div
                      style={{
                        color: "#ff6600",
                        fontWeight: "bold",
                        fontFamily: "monospace",
                        fontSize: "clamp(0.9rem, 2.5vw, 1.5rem)",
                        WebkitTextStroke: "clamp(0.5px, 0.15vw, 1px) #ffff00",
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      CREDIT ${credits}
                    </div>
                  </div>
                </Col>
              </Row>
            </>
          )}

          {/* Sequence d: Double Down */}
          {sequence === "d" && (
            <>
              {/* Mobile: Row 1 - Just CREDIT */}
              <Row className="mb-4 d-md-none">
                <Col
                  xs={12}
                  className="d-flex align-items-center justify-content-end"
                >
                  <div
                    style={{
                      color: "#ff6600",
                      fontWeight: "bold",
                      fontFamily: "monospace",
                      fontSize: "clamp(0.9rem, 2.5vw, 1.5rem)",
                      WebkitTextStroke: "clamp(0.5px, 0.15vw, 1px) #ffff00",
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    CREDIT ${credits}
                  </div>
                </Col>
              </Row>
              {/* Mobile: Row 2 - Empty (waiting for card selection) */}
              <Row className="mb-3 d-md-none">
                <Col xs={12}></Col>
              </Row>
              {/* Desktop: Single Row */}
              <Row className="mb-3 d-none d-md-flex">
                <Col md={3}></Col>
                <Col md={6}></Col>
                <Col
                  md={3}
                  className="d-flex align-items-center justify-content-end"
                >
                  <div
                    style={{
                      color: "#ff6600",
                      fontWeight: "bold",
                      fontFamily: "monospace",
                      fontSize: "clamp(0.9rem, 2.5vw, 1.5rem)",
                      WebkitTextStroke: "clamp(0.5px, 0.15vw, 1px) #ffff00",
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    CREDIT ${credits}
                  </div>
                </Col>
              </Row>
            </>
          )}

          {/* Game Over - Sequence 2 with 0 credits */}
          {credits === 0 && sequence === 2 && (
            <>
              {/* Mobile: Row 1 - CREDIT $0 */}
              <Row className="mb-4 d-md-none">
                <Col
                  xs={12}
                  className="d-flex align-items-center justify-content-end"
                >
                  <div
                    style={{
                      color: "#ff6600",
                      fontWeight: "bold",
                      fontFamily: "monospace",
                      fontSize: "clamp(0.9rem, 2.5vw, 1.5rem)",
                      WebkitTextStroke: "clamp(0.5px, 0.15vw, 1px) #ffff00",
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    CREDIT $0
                  </div>
                </Col>
              </Row>
              {/* Mobile: Row 2 - MENU Button */}
              <Row className="mb-3 d-md-none">
                <Col xs={12} className="d-flex justify-content-center">
                  <Button
                    variant=""
                    size="lg"
                    onClick={handleMainMenu}
                    style={{
                      backgroundColor: "#666666",
                      color: "#ffffff",
                      border: "3px solid #cccccc",
                      fontWeight: "bold",
                      fontSize: "clamp(0.7rem, 1.8vw, 1.1rem)",
                      padding: "clamp(4px, 1vw, 8px) clamp(6px, 1.5vw, 16px)",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                      fontFamily: "monospace",
                      minWidth: "clamp(60px, 15vw, 120px)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    MENU
                  </Button>
                </Col>
              </Row>
              {/* Desktop: Single Row */}
              <Row className="mb-3 d-none d-md-flex">
                <Col md={3} className="d-flex align-items-center">
                  <Button
                    variant=""
                    size="lg"
                    onClick={handleMainMenu}
                    style={{
                      backgroundColor: "#666666",
                      color: "#ffffff",
                      border: "3px solid #cccccc",
                      fontWeight: "bold",
                      fontSize: "clamp(0.8rem, 2vw, 1.1rem)",
                      padding: "clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px)",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                      fontFamily: "monospace",
                      minWidth: "clamp(60px, 15vw, 150px)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    MENU
                  </Button>
                </Col>
                <Col md={6}></Col>
                <Col
                  md={3}
                  className="d-flex align-items-center justify-content-end"
                >
                  <div
                    style={{
                      color: "#ff6600",
                      fontWeight: "bold",
                      fontFamily: "monospace",
                      fontSize: "clamp(0.9rem, 2.5vw, 1.5rem)",
                      WebkitTextStroke: "clamp(0.5px, 0.15vw, 1px) #ffff00",
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    CREDIT $0
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};
