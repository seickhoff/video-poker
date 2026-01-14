import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Badge } from "react-bootstrap";
import { comparePokerHands } from "../utils/pickerHandEvaluator";
import { PlayingCard } from "../components/PlayingCard";
import { usePickerSocket } from "../hooks/usePickerSocket";

const DECK_TYPE_KEY = "picker-deck-type";
const JOKER_MODE_KEY = "picker-joker-mode";
const HIDDEN_CARDS_KEY = "picker-hidden-cards";
const CARD_SIZE_KEY = "picker-card-size";
const PLAYER_NAME_KEY = "picker-player-name";

export function Picker() {
  const {
    isConnected,
    isHost,
    hasHost,
    playerId,
    gameState,
    players,
    winners,
    config,
    hasDrawn,
    participants,
    claimHost,
    releaseHost,
    forceClaimHost,
    joinGame,
    updateConfig,
    startGame,
    selectCard,
    drawCards,
    revealCards,
    startTiebreaker,
    newGame,
    error,
  } = usePickerSocket();

  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem(PLAYER_NAME_KEY) || "";
  });
  const [hasJoined, setHasJoined] = useState(false);
  const [cardSize, setCardSize] = useState<number>(() => {
    const stored = localStorage.getItem(CARD_SIZE_KEY);
    return stored ? parseInt(stored, 10) : 100;
  });
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  // Load config from localStorage
  useEffect(() => {
    if (isHost) {
      const storedDeckType = localStorage.getItem(DECK_TYPE_KEY);
      const storedJokerMode = localStorage.getItem(JOKER_MODE_KEY);
      const storedHiddenCards = localStorage.getItem(HIDDEN_CARDS_KEY);

      updateConfig({
        deckType: (storedDeckType as "independent" | "shared") || "independent",
        jokerMode: storedJokerMode === "true",
        hiddenCardsCount: (storedHiddenCards === "1" ? 1 : 2) as 1 | 2,
      });
    }
  }, [isHost, updateConfig]);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Removed auto-join logic - player must explicitly click JOIN GAME button

  const handlePlayerNameChange = (value: string) => {
    setPlayerName(value);
    localStorage.setItem(PLAYER_NAME_KEY, value);
  };

  const handleDeckTypeChange = (value: "independent" | "shared") => {
    localStorage.setItem(DECK_TYPE_KEY, value);
    updateConfig({ ...config, deckType: value });
  };

  const handleJokerModeChange = (value: boolean) => {
    localStorage.setItem(JOKER_MODE_KEY, value.toString());
    updateConfig({ ...config, jokerMode: value });
  };

  const handleHiddenCardsCountChange = (value: 1 | 2) => {
    localStorage.setItem(HIDDEN_CARDS_KEY, value.toString());
    updateConfig({ ...config, hiddenCardsCount: value });
  };

  const handleCardSizeChange = (delta: number) => {
    const newSize = Math.max(50, Math.min(200, cardSize + delta));
    setCardSize(newSize);
    localStorage.setItem(CARD_SIZE_KEY, newSize.toString());
  };

  const handleClaimHost = () => {
    if (playerName.trim()) {
      claimHost(playerName.trim());
      setHasJoined(true);
    }
  };

  const handleJoinGame = () => {
    if (playerName.trim()) {
      joinGame(playerName.trim());
      setHasJoined(true);
    }
  };

  const handleReleaseHost = () => {
    releaseHost();
  };

  const handleForceClaimHost = () => {
    forceClaimHost();
  };

  const getButtonConfig = () => {
    switch (gameState) {
      case "input":
        return { text: "Play", onClick: startGame };
      case "showing":
        // If draw has already happened, show "Reveal"
        if (hasDrawn) {
          return { text: "Reveal", onClick: revealCards };
        }
        // Before draw, always show "Discard" button
        return { text: "Discard", onClick: drawCards };
      case "revealed":
        if (winners.length > 1) {
          return { text: "Tie Breaker", onClick: startTiebreaker };
        }
        return { text: "New Game", onClick: newGame };
      case "tiebreaker":
        return { text: "Reveal", onClick: revealCards };
      default:
        return { text: "Play", onClick: startGame };
    }
  };

  const buttonConfig = getButtonConfig();

  // Show name input if not joined
  if (!hasJoined) {
    return (
      <Container
        fluid
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: "#0000cc",
          color: "#ffffff",
        }}
      >
        <Row className="justify-content-center w-100">
          <Col md={6} lg={4}>
            <div
              className="p-4"
              style={{
                backgroundColor: "#000066",
                border: "2px solid #ffd700",
                borderRadius: "6px",
              }}
            >
              <h2
                className="text-center mb-4"
                style={{
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  color: "#ffd700",
                  fontSize: "clamp(1.5rem, 4vw, 2rem)",
                }}
              >
                POKER PICKER
              </h2>
              <Form.Group className="mb-3">
                <Form.Label
                  style={{
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: "#ffff00",
                  }}
                >
                  Enter your name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Your Name"
                  value={playerName}
                  onChange={(e) => handlePlayerNameChange(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleClaimHost();
                    }
                  }}
                  style={{
                    fontFamily: "monospace",
                    fontSize: "1rem",
                    backgroundColor: "#000066",
                    color: "#ffffff",
                    border: "2px solid #ffd700",
                  }}
                />
              </Form.Group>
              <div className="d-grid gap-2">
                {!hasHost && (
                  <Button
                    onClick={handleClaimHost}
                    disabled={!playerName.trim() || !isConnected}
                    style={{
                      backgroundColor: "#ff6600",
                      color: "#ffffff",
                      border: "2px solid #ffd700",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      fontFamily: "monospace",
                    }}
                  >
                    {isConnected ? "BE THE HOST" : "CONNECTING..."}
                  </Button>
                )}
                <Button
                  onClick={handleJoinGame}
                  disabled={!playerName.trim() || !isConnected}
                  style={{
                    backgroundColor: "#ffd700",
                    color: "#000000",
                    border: "2px solid #ffff00",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    fontFamily: "monospace",
                  }}
                >
                  {isConnected ? "JOIN AS PARTICIPANT" : "CONNECTING..."}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className="min-vh-100 py-2"
      style={{
        background: "#0000cc",
        color: "#ffffff",
      }}
    >
      <Row className="justify-content-center">
        <Col lg={11} xl={10}>
          {error && (
            <Row className="mb-2">
              <Col>
                <div
                  className="alert alert-danger"
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "#ff0000",
                    color: "#ffffff",
                    border: "2px solid #ffff00",
                  }}
                >
                  {error}
                </div>
              </Col>
            </Row>
          )}

          <Row className="mb-2 align-items-center gx-2 px-2">
            <Col xs={3} className="d-none d-md-block">
              <div className="d-flex align-items-center gap-2">
                <span
                  style={{
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    fontSize: "clamp(0.8rem, 1.8vw, 1rem)",
                    color: "#ffff00",
                  }}
                ></span>
                <Button
                  size="sm"
                  onClick={() => handleCardSizeChange(-5)}
                  disabled={cardSize <= 50}
                  style={{
                    backgroundColor: "#ffd700",
                    color: "#000000",
                    border: "2px solid #ffff00",
                    fontWeight: "bold",
                    fontSize: "clamp(0.9rem, 2vw, 1.2rem)",
                    padding: "2px 10px",
                  }}
                >
                  −
                </Button>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    fontSize: "clamp(0.8rem, 1.8vw, 1rem)",
                    color: "#ffffff",
                    minWidth: "3rem",
                    textAlign: "center",
                  }}
                >
                  {cardSize}%
                </span>
                <Button
                  size="sm"
                  onClick={() => handleCardSizeChange(5)}
                  disabled={cardSize >= 200}
                  style={{
                    backgroundColor: "#ffd700",
                    color: "#000000",
                    border: "2px solid #ffff00",
                    fontWeight: "bold",
                    fontSize: "clamp(0.9rem, 2vw, 1.2rem)",
                    padding: "2px 10px",
                  }}
                >
                  +
                </Button>
              </div>
            </Col>
            <Col xs={9} md={6} className="ps-2 ps-md-0">
              <h1
                className="text-start text-md-center"
                style={{
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  color: "#ffd700",
                  fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                  textShadow: "3px 3px 6px rgba(0, 0, 0, 0.8)",
                  WebkitTextStroke: "1px #ffff00",
                  marginBottom: "0.5rem",
                  whiteSpace: "nowrap",
                }}
              >
                POKER PICKER{" "}
                {isHost && (
                  <Badge
                    bg="warning"
                    text="dark"
                    style={{ fontSize: "0.5em", fontFamily: "monospace" }}
                    role="button"
                    onClick={handleReleaseHost}
                    title="Click to release host role"
                  >
                    HOST ✕
                  </Badge>
                )}
              </h1>
            </Col>
            <Col xs={3} className="text-end pe-2">
              <Button
                size="lg"
                onClick={buttonConfig.onClick}
                disabled={!isHost}
                style={{
                  backgroundColor:
                    buttonConfig.text === "Tie Breaker" ? "#ff6600" : "#ffd700",
                  color:
                    buttonConfig.text === "Tie Breaker" ? "#ffffff" : "#000000",
                  border:
                    buttonConfig.text === "Tie Breaker"
                      ? "2px solid #ffd700"
                      : "2px solid #ffff00",
                  fontWeight: "bold",
                  fontSize: "clamp(0.8rem, 1.8vw, 1.1rem)",
                  padding: "clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px)",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                  fontFamily: "monospace",
                  whiteSpace: "nowrap",
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                  minWidth: "clamp(85px, 22vw, 150px)",
                  opacity: !isHost ? 0.5 : 1,
                  cursor: !isHost ? "not-allowed" : "pointer",
                }}
              >
                {buttonConfig.text.toUpperCase()}
              </Button>
            </Col>
          </Row>

          {gameState === "input" && isHost && (
            <Row className="mb-3">
              <Col md={{ span: 10, offset: 1 }}>
                <div
                  className="mb-3"
                  style={{
                    textAlign: "center",
                    fontFamily: "monospace",
                    fontSize: "clamp(0.8rem, 1.8vw, 1rem)",
                    color: "#ffff00",
                  }}
                >
                  {participants.length === 0 ? (
                    <div
                      style={{
                        backgroundColor: "#000066",
                        border: "2px solid #ffd700",
                        borderRadius: "6px",
                        padding: "1rem",
                      }}
                    >
                      Waiting for players to join...
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontWeight: "bold", color: "#ffd700" }}>
                        Participants ({participants.length}):{" "}
                      </span>
                      {participants.map((p) => p.name).join(", ")}
                    </div>
                  )}
                </div>

                <div
                  className="mb-3"
                  style={{
                    backgroundColor: "#000066",
                    border: "2px solid #ffd700",
                    borderRadius: "6px",
                    padding: "0.75rem",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "monospace",
                      fontWeight: "bold",
                      fontSize: "clamp(0.85rem, 2vw, 1rem)",
                      color: "#ffd700",
                      marginBottom: "0.5rem",
                    }}
                  >
                    How to Play (Host)
                  </h3>
                  <ul
                    style={{
                      fontFamily: "monospace",
                      fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
                      color: "#ffff00",
                      marginBottom: 0,
                      paddingLeft: "1.25rem",
                    }}
                  >
                    <li>
                      Click PLAY to deal 5 cards to each player (
                      {5 - config.hiddenCardsCount} shown,{" "}
                      {config.hiddenCardsCount} hidden)
                    </li>
                    <li>
                      Players can optionally select one face-up card to discard
                    </li>
                    <li>
                      Click DISCARD to replace all selected cards with new ones,
                      or skip directly to REVEAL
                    </li>
                    <li>Click REVEAL to show all cards and determine winner</li>
                    <li>Highest poker hand wins! If tied, click TIE BREAKER</li>
                  </ul>
                </div>

                <Row className="mb-3">
                  <Col xs={4} md={6}>
                    <Form.Label
                      style={{
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        fontSize: "clamp(0.75rem, 2vw, 1.1rem)",
                        color: "#ffff00",
                      }}
                    >
                      <span className="d-md-none">Deck</span>
                      <span className="d-none d-md-inline">Deck Type</span>
                    </Form.Label>
                    <Form.Check
                      type="radio"
                      id="deck-independent"
                      name="deckType"
                      label={
                        <>
                          <span className="d-md-none">Individual</span>
                          <span className="d-none d-md-inline">
                            Each player has an independent deck
                          </span>
                        </>
                      }
                      checked={config.deckType === "independent"}
                      onChange={() => handleDeckTypeChange("independent")}
                      style={{
                        fontFamily: "monospace",
                        fontSize: "clamp(0.7rem, 1.8vw, 1rem)",
                        color: "#ffff00",
                      }}
                    />
                    <Form.Check
                      type="radio"
                      id="deck-shared"
                      name="deckType"
                      label={
                        <>
                          <span className="d-md-none">Shared</span>
                          <span className="d-none d-md-inline">
                            All players draw from shared deck(s)
                          </span>
                        </>
                      }
                      checked={config.deckType === "shared"}
                      onChange={() => handleDeckTypeChange("shared")}
                      style={{
                        fontFamily: "monospace",
                        fontSize: "clamp(0.7rem, 1.8vw, 1rem)",
                        color: "#ffff00",
                      }}
                    />
                  </Col>

                  <Col xs={4} md={3}>
                    <Form.Label
                      style={{
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        fontSize: "clamp(0.75rem, 2vw, 1.1rem)",
                        color: "#ffff00",
                      }}
                    >
                      Jokers
                    </Form.Label>
                    <Form.Check
                      type="radio"
                      id="jokers-no"
                      name="jokerMode"
                      label={
                        <>
                          <span className="d-md-none">None</span>
                          <span className="d-none d-md-inline">No jokers</span>
                        </>
                      }
                      checked={!config.jokerMode}
                      onChange={() => handleJokerModeChange(false)}
                      style={{
                        fontFamily: "monospace",
                        fontSize: "clamp(0.7rem, 1.8vw, 1rem)",
                        color: "#ffff00",
                      }}
                    />
                    <Form.Check
                      type="radio"
                      id="jokers-yes"
                      name="jokerMode"
                      label={
                        <>
                          <span className="d-md-none">Two</span>
                          <span className="d-none d-md-inline">
                            Two jokers per deck
                          </span>
                        </>
                      }
                      checked={config.jokerMode}
                      onChange={() => handleJokerModeChange(true)}
                      style={{
                        fontFamily: "monospace",
                        fontSize: "clamp(0.7rem, 1.8vw, 1rem)",
                        color: "#ffff00",
                      }}
                    />
                  </Col>

                  <Col xs={4} md={3}>
                    <Form.Label
                      style={{
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        fontSize: "clamp(0.75rem, 2vw, 1.1rem)",
                        color: "#ffff00",
                      }}
                    >
                      <span className="d-md-none">Hidden</span>
                      <span className="d-none d-md-inline">Hidden Cards</span>
                    </Form.Label>
                    <Form.Check
                      type="radio"
                      id="hidden-1"
                      name="hiddenCards"
                      label={
                        <>
                          <span className="d-md-none">One</span>
                          <span className="d-none d-md-inline">One card</span>
                        </>
                      }
                      checked={config.hiddenCardsCount === 1}
                      onChange={() => handleHiddenCardsCountChange(1)}
                      style={{
                        fontFamily: "monospace",
                        fontSize: "clamp(0.7rem, 1.8vw, 1rem)",
                        color: "#ffff00",
                      }}
                    />
                    <Form.Check
                      type="radio"
                      id="hidden-2"
                      name="hiddenCards"
                      label={
                        <>
                          <span className="d-md-none">Two</span>
                          <span className="d-none d-md-inline">Two cards</span>
                        </>
                      }
                      checked={config.hiddenCardsCount === 2}
                      onChange={() => handleHiddenCardsCountChange(2)}
                      style={{
                        fontFamily: "monospace",
                        fontSize: "clamp(0.7rem, 1.8vw, 1rem)",
                        color: "#ffff00",
                      }}
                    />
                  </Col>
                </Row>

                <div
                  className="mt-3"
                  style={{
                    backgroundColor: "#000066",
                    border: "2px solid #ffd700",
                    borderRadius: "6px",
                    padding: "0.75rem",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "monospace",
                      fontWeight: "bold",
                      fontSize: "clamp(0.85rem, 2vw, 1rem)",
                      color: "#ffd700",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Hand Rankings (Highest to Lowest)
                  </h3>
                  <table
                    style={{
                      width: "100%",
                      fontFamily: "monospace",
                      fontSize: "clamp(0.65rem, 1.5vw, 0.85rem)",
                      color: "#ffff00",
                      borderCollapse: "collapse",
                    }}
                  >
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td
                          style={{
                            padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          1. Five of a Kind
                        </td>
                        <td style={{ padding: "0.25rem" }}>Five same rank</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td
                          style={{
                            padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          2. Royal Flush
                        </td>
                        <td style={{ padding: "0.25rem" }}>
                          A-K-Q-J-10 same suit
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td
                          style={{
                            padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          3. Straight Flush
                        </td>
                        <td style={{ padding: "0.25rem" }}>
                          Five seq. same suit
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td
                          style={{
                            padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          4. Four of a Kind
                        </td>
                        <td style={{ padding: "0.25rem" }}>Four same rank</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td
                          style={{
                            padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          5. Full House
                        </td>
                        <td style={{ padding: "0.25rem" }}>Three + pair</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td
                          style={{
                            padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          6. Flush
                        </td>
                        <td style={{ padding: "0.25rem" }}>Five same suit</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td
                          style={{
                            padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          7. Straight
                        </td>
                        <td style={{ padding: "0.25rem" }}>Five sequential</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td
                          style={{
                            padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          8. Three of a Kind
                        </td>
                        <td style={{ padding: "0.25rem" }}>Three same rank</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td
                          style={{
                            padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          9. Two Pair
                        </td>
                        <td style={{ padding: "0.25rem" }}>Two pairs</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td
                          style={{
                            padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          10. One Pair
                        </td>
                        <td style={{ padding: "0.25rem" }}>Two same rank</td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          11. High Card
                        </td>
                        <td style={{ padding: "0.25rem" }}>No match</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>
          )}

          {gameState === "input" && !isHost && (
            <Row className="mb-3">
              <Col md={{ span: 10, offset: 1 }}>
                <div
                  className="mb-3"
                  style={{
                    textAlign: "center",
                    fontFamily: "monospace",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
                      color: "#ffd700",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Waiting for host to click PLAY...
                  </p>
                  <p
                    style={{
                      fontSize: "clamp(0.8rem, 1.8vw, 1rem)",
                      color: "#ffff00",
                      marginBottom: 0,
                    }}
                  >
                    <span style={{ fontWeight: "bold", color: "#ffd700" }}>
                      Participants ({participants.length}):{" "}
                    </span>
                    {participants.map((p) => p.name).join(", ")}
                  </p>
                </div>

                <div
                  className="mb-3"
                  style={{
                    backgroundColor: "#000066",
                    border: "2px solid #ffd700",
                    borderRadius: "6px",
                    padding: "0.75rem",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "monospace",
                      fontWeight: "bold",
                      fontSize: "clamp(0.85rem, 2vw, 1rem)",
                      color: "#ffd700",
                      marginBottom: "0.5rem",
                    }}
                  >
                    How to Play
                  </h3>
                  <ul
                    style={{
                      fontFamily: "monospace",
                      fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
                      color: "#ffff00",
                      marginBottom: 0,
                      paddingLeft: "1.25rem",
                    }}
                  >
                    <li>
                      Wait for host to deal 5 cards (
                      {5 - config.hiddenCardsCount} shown,{" "}
                      {config.hiddenCardsCount} hidden)
                    </li>
                    <li>Optionally select one face-up card to discard</li>
                    <li>Host clicks DISCARD to replace all selected cards</li>
                    <li>Host clicks REVEAL to conclude the game</li>
                    <li>
                      Highest poker hand wins! If tied, host will start TIE
                      BREAKER
                    </li>
                  </ul>
                </div>

                <Row className="mb-3">
                  <Col xs={4} md={6}>
                    <Form.Label
                      style={{
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        fontSize: "clamp(0.75rem, 2vw, 1.1rem)",
                        color: "#ffff00",
                      }}
                    >
                      <span className="d-md-none">Deck</span>
                      <span className="d-none d-md-inline">Deck Type</span>
                    </Form.Label>
                    <Form.Check
                      type="radio"
                      id="deck-independent-view"
                      name="deckTypeView"
                      label={
                        <>
                          <span className="d-md-none">Individual</span>
                          <span className="d-none d-md-inline">
                            Each player has an independent deck
                          </span>
                        </>
                      }
                      checked={config.deckType === "independent"}
                      disabled
                      style={{
                        fontFamily: "monospace",
                        fontSize: "clamp(0.7rem, 1.8vw, 1rem)",
                        color: "#ffff00",
                      }}
                    />
                    <Form.Check
                      type="radio"
                      id="deck-shared-view"
                      name="deckTypeView"
                      label={
                        <>
                          <span className="d-md-none">Shared</span>
                          <span className="d-none d-md-inline">
                            All players draw from shared deck(s)
                          </span>
                        </>
                      }
                      checked={config.deckType === "shared"}
                      disabled
                      style={{
                        fontFamily: "monospace",
                        fontSize: "clamp(0.7rem, 1.8vw, 1rem)",
                        color: "#ffff00",
                      }}
                    />
                  </Col>

                  <Col xs={4} md={3}>
                    <Form.Label
                      style={{
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        fontSize: "clamp(0.75rem, 2vw, 1.1rem)",
                        color: "#ffff00",
                      }}
                    >
                      Jokers
                    </Form.Label>
                    <Form.Check
                      type="radio"
                      id="jokers-no-view"
                      name="jokerModeView"
                      label={
                        <>
                          <span className="d-md-none">None</span>
                          <span className="d-none d-md-inline">No jokers</span>
                        </>
                      }
                      checked={!config.jokerMode}
                      disabled
                      style={{
                        fontFamily: "monospace",
                        fontSize: "clamp(0.7rem, 1.8vw, 1rem)",
                        color: "#ffff00",
                      }}
                    />
                    <Form.Check
                      type="radio"
                      id="jokers-yes-view"
                      name="jokerModeView"
                      label={
                        <>
                          <span className="d-md-none">Two</span>
                          <span className="d-none d-md-inline">
                            Two jokers per deck
                          </span>
                        </>
                      }
                      checked={config.jokerMode}
                      disabled
                      style={{
                        fontFamily: "monospace",
                        fontSize: "clamp(0.7rem, 1.8vw, 1rem)",
                        color: "#ffff00",
                      }}
                    />
                  </Col>

                  <Col xs={4} md={3}>
                    <Form.Label
                      style={{
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        fontSize: "clamp(0.75rem, 2vw, 1.1rem)",
                        color: "#ffff00",
                      }}
                    >
                      <span className="d-md-none">Hidden</span>
                      <span className="d-none d-md-inline">Hidden Cards</span>
                    </Form.Label>
                    <Form.Check
                      type="radio"
                      id="hidden-1-view"
                      name="hiddenCardsView"
                      label={
                        <>
                          <span className="d-md-none">One</span>
                          <span className="d-none d-md-inline">One card</span>
                        </>
                      }
                      checked={config.hiddenCardsCount === 1}
                      disabled
                      style={{
                        fontFamily: "monospace",
                        fontSize: "clamp(0.7rem, 1.8vw, 1rem)",
                        color: "#ffff00",
                      }}
                    />
                    <Form.Check
                      type="radio"
                      id="hidden-2-view"
                      name="hiddenCardsView"
                      label={
                        <>
                          <span className="d-md-none">Two</span>
                          <span className="d-none d-md-inline">Two cards</span>
                        </>
                      }
                      checked={config.hiddenCardsCount === 2}
                      disabled
                      style={{
                        fontFamily: "monospace",
                        fontSize: "clamp(0.7rem, 1.8vw, 1rem)",
                        color: "#ffff00",
                      }}
                    />
                  </Col>
                </Row>

                <div
                  className="mt-3"
                  style={{
                    backgroundColor: "#000066",
                    border: "2px solid #ffd700",
                    borderRadius: "6px",
                    padding: "0.75rem",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "monospace",
                      fontWeight: "bold",
                      fontSize: "clamp(0.85rem, 2vw, 1rem)",
                      color: "#ffd700",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Hand Rankings (Highest to Lowest)
                  </h3>
                  <table
                    style={{
                      width: "100%",
                      fontFamily: "monospace",
                      fontSize: "clamp(0.65rem, 1.5vw, 0.85rem)",
                      color: "#ffff00",
                      borderCollapse: "collapse",
                    }}
                  >
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td
                          style={{
                            padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          1. Five of a Kind
                        </td>
                        <td style={{ padding: "0.25rem" }}>Five same rank</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td
                          style={{
                            padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          2. Royal Flush
                        </td>
                        <td style={{ padding: "0.25rem" }}>
                          A-K-Q-J-10 same suit
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td
                          style={{
                            padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          3. Straight Flush
                        </td>
                        <td style={{ padding: "0.25rem" }}>
                          Five seq. same suit
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td
                          style={{
                            padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          4. Four of a Kind
                        </td>
                        <td style={{ padding: "0.25rem" }}>Four same rank</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td
                          style={{
                            padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          5. Full House
                        </td>
                        <td style={{ padding: "0.25rem" }}>Three + pair</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td
                          style={{
                            padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          6. Flush
                        </td>
                        <td style={{ padding: "0.25rem" }}>Five same suit</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td
                          style={{
                            padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          7. Straight
                        </td>
                        <td style={{ padding: "0.25rem" }}>Five sequential</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td
                          style={{
                            padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          8. Three of a Kind
                        </td>
                        <td style={{ padding: "0.25rem" }}>Three same rank</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td
                          style={{
                            padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          9. Two Pair
                        </td>
                        <td style={{ padding: "0.25rem" }}>Two pairs</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td
                          style={{
                            padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          10. One Pair
                        </td>
                        <td style={{ padding: "0.25rem" }}>Two same rank</td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          11. High Card
                        </td>
                        <td style={{ padding: "0.25rem" }}>No match</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 text-center">
                  <Button
                    onClick={handleForceClaimHost}
                    style={{
                      backgroundColor: "#ff6600",
                      color: "#ffffff",
                      border: "2px solid #ffd700",
                      fontWeight: "bold",
                      fontSize: "clamp(0.75rem, 1.6vw, 0.85rem)",
                      fontFamily: "monospace",
                      padding: "0.4rem 0.8rem",
                    }}
                  >
                    CLAIM HOST (Take Over)
                  </Button>
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: "clamp(0.65rem, 1.4vw, 0.75rem)",
                      color: "#ffff00",
                      marginTop: "0.5rem",
                      fontStyle: "italic",
                      marginBottom: 0,
                    }}
                  >
                    Use this if the host is inactive or has left
                  </p>
                </div>
              </Col>
            </Row>
          )}

          {gameState !== "input" && (
            <>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  marginTop: "2rem",
                  justifyContent: "center",
                }}
              >
                {players.map((player, playerIndex) => {
                  // Calculate proper rank accounting for ties
                  let rank = 1;
                  if (gameState === "revealed" && player.handEvaluation) {
                    for (let i = 0; i < playerIndex; i++) {
                      const comparison = comparePokerHands(
                        players[i].handEvaluation!,
                        player.handEvaluation
                      );
                      if (comparison > 0) {
                        rank++;
                      }
                    }
                  } else {
                    rank = playerIndex + 1;
                  }

                  const isCurrentPlayer = player.id === playerId;

                  return (
                    <div
                      key={playerIndex}
                      style={{
                        flex: `0 0 ${isMobile ? "100" : cardSize * 0.3}%`,
                        minWidth: isMobile ? "100%" : `${cardSize * 2}px`,
                        maxWidth: isMobile ? "100%" : `${cardSize * 5}px`,
                      }}
                    >
                      <div
                        className="text-center p-2"
                        style={{
                          backgroundColor: "#000066",
                          border: `2px solid ${isCurrentPlayer ? "#00ff00" : "#ffd700"}`,
                          borderRadius: "6px",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                          position: "relative",
                          minHeight: "fit-content",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: "8px",
                            left: "8px",
                            backgroundColor:
                              gameState === "revealed"
                                ? "#ffd700"
                                : "transparent",
                            color:
                              gameState === "revealed"
                                ? "#000000"
                                : "transparent",
                            fontFamily: "monospace",
                            fontWeight: "bold",
                            fontSize: "clamp(0.9rem, 2vw, 1.2rem)",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            border:
                              gameState === "revealed"
                                ? "2px solid #ffff00"
                                : "2px solid transparent",
                            boxShadow:
                              gameState === "revealed"
                                ? "0 2px 4px rgba(0, 0, 0, 0.5)"
                                : "none",
                            zIndex: 10,
                            visibility:
                              gameState === "revealed" ? "visible" : "hidden",
                            minWidth: "clamp(45px, 10vw, 60px)",
                            textAlign: "center",
                          }}
                        >
                          #{rank}
                        </div>
                        <style>{`
                        @keyframes winnerBlink {
                          0%, 100% { opacity: 1; }
                          50% { opacity: 0.3; }
                        }
                      `}</style>
                        <h3
                          style={{
                            fontFamily: "monospace",
                            fontWeight: "bold",
                            color: isCurrentPlayer ? "#00ff00" : "#ff6600",
                            fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                            WebkitTextStroke:
                              "clamp(0.5px, 0.15vw, 0.8px) #ffff00",
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                            marginBottom: "0.25rem",
                            animation:
                              gameState === "revealed" && rank === 1
                                ? "winnerBlink 0.75s ease-in-out infinite"
                                : "none",
                          }}
                        >
                          {player.name.toUpperCase()}
                          {isCurrentPlayer && " (YOU)"}
                        </h3>
                        <div
                          className="mb-1"
                          style={{
                            fontFamily: "monospace",
                            fontWeight: "bold",
                            fontSize: "clamp(0.7rem, 1.6vw, 0.9rem)",
                            color:
                              gameState === "revealed"
                                ? "#00ff00"
                                : "transparent",
                            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
                            minHeight: "1.2rem",
                            visibility:
                              gameState === "revealed" ? "visible" : "hidden",
                          }}
                        >
                          {gameState === "revealed" && player.handEvaluation
                            ? player.handEvaluation.displayName
                            : "\u00A0"}
                        </div>
                        <div className="d-flex justify-content-center gap-1">
                          {player.cards.map((card, cardIndex) => {
                            const isHidden =
                              cardIndex < config.hiddenCardsCount &&
                              gameState === "showing";
                            const isCurrentPlayer = player.id === playerId;
                            const isSelectable =
                              isCurrentPlayer &&
                              gameState === "showing" &&
                              !isHidden &&
                              !hasDrawn;
                            const isSelected =
                              player.selectedCardIndex === cardIndex;

                            return (
                              <div
                                key={cardIndex}
                                onClick={() => {
                                  if (isSelectable) {
                                    selectCard(cardIndex);
                                  }
                                }}
                                style={{
                                  cursor: isSelectable ? "pointer" : "default",
                                  position: "relative",
                                  transform: isSelected
                                    ? "translateY(-10px)"
                                    : "none",
                                  transition: "transform 0.2s ease",
                                  border: isSelected
                                    ? "3px solid #00ff00"
                                    : "none",
                                  borderRadius: "8px",
                                  boxShadow: isSelected
                                    ? "0 0 15px rgba(0, 255, 0, 0.8)"
                                    : "none",
                                }}
                              >
                                <PlayingCard
                                  card={isHidden ? null : card}
                                  disableHover={!isSelectable}
                                  hideLabel={true}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
