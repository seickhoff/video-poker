import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useVideoPoker } from "../hooks/useVideoPoker";
import { PayoutTable } from "../components/PayoutTable";
import { CardHand } from "../components/CardHand";
import { HandType, GameType } from "../types/game";
import { getGameStats, calculateActualRTP } from "../utils/statistics";

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
    sessionStats,
    setBet,
    dealCards,
    toggleHoldCard,
    drawCards,
    startDoubleDown,
    selectDoubleDownCard,
    returnToMenu,
    continueGame,
  } = useVideoPoker();

  // Get long-term RTP for this game
  const gameStats = gameType ? getGameStats(gameType) : null;
  const actualRTP = gameStats ? calculateActualRTP(gameStats) : 0;

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
    if (sequence === 0) {
      return gameType === "Pick-a-Pair Poker" ? "PLAY" : "Show Cards";
    }
    if (sequence === 1) return "DRAW";
    if (sequence === "d") return "Show Card";
    return "";
  };

  return (
    <Container
      fluid
      className="min-vh-100 py-4"
      style={{
        background: "#0000cc",
        color: "#ffffff",
      }}
    >
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          {/* Payout Table */}
          <div className="mb-1">
            <PayoutTable
              gameType={gameType}
              wager={wager}
              currentHand={currentHand}
              onWagerChange={sequence === 0 ? setBet : undefined}
            />
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
              {/* Mobile: Row 1 - Credit Only */}
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
                <Col md={3}></Col>
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
                      visibility:
                        gameType === "Pick-a-Pair Poker" && sequence === 1
                          ? "hidden"
                          : "visible",
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
                      visibility:
                        gameType === "Pick-a-Pair Poker" && sequence === 1
                          ? "hidden"
                          : "visible",
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
          {sequence === 2 && (
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
                  {credits > 0 && (
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
                  )}
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
                  {credits > 0 && (
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
                  )}
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

          {/* Sequence e: Double Down Results */}
          {sequence === "e" && (
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

          {/* Help Bar */}
          <div className="mt-5">
            <div
              className="p-2"
              style={{
                backgroundColor: "#000066",
                border: "2px solid #ffd700",
                borderRadius: "5px",
                minHeight: "clamp(50px, 10vw, 60px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {/* Session Stats (during play) */}
              {sessionStats.handsPlayed > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    fontSize: "clamp(0.65rem, 1.6vw, 0.85rem)",
                    fontFamily: "monospace",
                    fontWeight: "bold",
                  }}
                >
                  <span style={{ color: "#ffff00" }}>
                    SESSION: {sessionStats.handsPlayed}{" "}
                    {sessionStats.handsPlayed === 1 ? "hand" : "hands"}
                  </span>
                  {sessionStats.biggestWin > 0 && (
                    <span style={{ color: "#00ff00" }}>
                      BIGGEST: ${sessionStats.biggestWin}
                    </span>
                  )}
                  {sessionStats.currentDoubleDownChain > 0 && (
                    <span
                      style={{
                        color: "#ff6600",
                        animation: "pulse 1.5s ease-in-out infinite",
                      }}
                    >
                      🔥 {sessionStats.currentDoubleDownChain}X 🔥
                    </span>
                  )}
                  <span
                    style={{
                      color:
                        sessionStats.netProfit >= 0 ? "#00ff00" : "#ff0000",
                    }}
                  >
                    NET: {sessionStats.netProfit >= 0 ? "+" : ""}$
                    {sessionStats.netProfit}
                  </span>
                  {gameStats && gameStats.totalHandsPlayed > 0 && (
                    <span
                      style={{
                        color: actualRTP >= 100 ? "#00ff00" : "#ff6600",
                      }}
                    >
                      RTP: {actualRTP.toFixed(1)}%
                    </span>
                  )}
                </div>
              )}

              {/* Previous Stats (before first hand) */}
              {sessionStats.handsPlayed === 0 &&
                gameStats &&
                gameStats.totalHandsPlayed > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      justifyContent: "center",
                      flexWrap: "wrap",
                      fontSize: "clamp(0.65rem, 1.6vw, 0.85rem)",
                      fontFamily: "monospace",
                      fontWeight: "bold",
                    }}
                  >
                    <span style={{ color: "#ffff00" }}>
                      LIFETIME: {gameStats.totalHandsPlayed}{" "}
                      {gameStats.totalHandsPlayed === 1 ? "hand" : "hands"}
                    </span>
                    <span
                      style={{
                        color: actualRTP >= 100 ? "#00ff00" : "#ff6600",
                      }}
                    >
                      RTP: {actualRTP.toFixed(1)}%
                    </span>
                    {gameStats.biggestHandWin > 0 && (
                      <span style={{ color: "#00ff00" }}>
                        BEST: ${gameStats.biggestHandWin}
                      </span>
                    )}
                  </div>
                )}

              {/* Help Text */}
              <p
                className="mb-0"
                style={{
                  color: sequence === "d" ? "#ff6600" : "#00ff00",
                  fontWeight: "bold",
                  fontSize: "clamp(0.75rem, 2vw, 1rem)",
                  textAlign: "center",
                }}
              >
                {sequence === 0 && "Select your bet amount, then click PLAY."}
                {sequence === 1 &&
                  gameType !== GameType.PickAPairPoker &&
                  "Click cards to hold them, then click DRAW."}
                {sequence === 1 &&
                  gameType === GameType.PickAPairPoker &&
                  "First 2 cards are kept. Click a stack from the stacks on the right to add to your hand."}
                {sequence === 2 &&
                  payout > 0 &&
                  "You won! Click CONTINUE to play again or DOUBLE DOWN to risk it."}
                {sequence === 2 &&
                  payout === 0 &&
                  currentHand !== "" &&
                  "You lost. Click CONTINUE to play again or click MENU to select a new game."}
                {sequence === 2 &&
                  payout === 0 &&
                  currentHand === HandType.None &&
                  "Click CONTINUE to play again or click MENU to select a new game."}
                {sequence === "d" &&
                  "Click a card to try to beat the dealer's card on the left."}
                {sequence === "e" &&
                  payout > 0 &&
                  "You won! Click CONTINUE to play again or DOUBLE DOWN to risk it."}
                {sequence === "e" &&
                  payout === 0 &&
                  "Click CONTINUE to play again or click MENU to select a new game."}
              </p>
            </div>
          </div>
        </Col>
      </Row>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </Container>
  );
};
