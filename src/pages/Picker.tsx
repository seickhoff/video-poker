import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createDeck, shuffleDeck } from "../utils/deck";
import {
  evaluatePokerHand,
  comparePokerHands,
  PokerHandEvaluation,
} from "../utils/pickerHandEvaluator";
import { Card } from "../types/game";
import { PlayingCard } from "../components/PlayingCard";

interface Player {
  name: string;
  cards: Card[];
  deck: Card[];
  handEvaluation: PokerHandEvaluation | null;
}

type GameState = "input" | "showing" | "revealed" | "tiebreaker";

const STORAGE_KEY = "picker-player-names";
const DECK_TYPE_KEY = "picker-deck-type";
const JOKER_MODE_KEY = "picker-joker-mode";
const HIDDEN_CARDS_KEY = "picker-hidden-cards";
const CARD_SIZE_KEY = "picker-card-size";
const DEFAULT_NAMES =
  "Alice, Bob, Charlie, Diana, Eve, Frank, Grace, Henry, Iris, Jack, Kelly, Liam";

type DeckType = "independent" | "shared";
type HiddenCardsCount = 1 | 2;

export function Picker() {
  const navigate = useNavigate();
  const [playerNames, setPlayerNames] = useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored || DEFAULT_NAMES;
  });
  const [deckType, setDeckType] = useState<DeckType>(() => {
    const stored = localStorage.getItem(DECK_TYPE_KEY);
    if (!stored) {
      localStorage.setItem(DECK_TYPE_KEY, "independent");
      return "independent";
    }
    return stored as DeckType;
  });
  const [jokerMode, setJokerMode] = useState<boolean>(() => {
    const stored = localStorage.getItem(JOKER_MODE_KEY);
    if (stored === null) {
      localStorage.setItem(JOKER_MODE_KEY, "false");
      return false;
    }
    return stored === "true";
  });
  const [hiddenCardsCount, setHiddenCardsCount] = useState<HiddenCardsCount>(
    () => {
      const stored = localStorage.getItem(HIDDEN_CARDS_KEY);
      if (stored === null) {
        localStorage.setItem(HIDDEN_CARDS_KEY, "1");
        return 1;
      }
      return stored === "1" ? 1 : 2;
    }
  );
  const [cardSize, setCardSize] = useState<number>(() => {
    const stored = localStorage.getItem(CARD_SIZE_KEY);
    return stored ? parseInt(stored, 10) : 100;
  });
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>("input");
  const [winners, setWinners] = useState<Player[]>([]);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Save player names to localStorage whenever they change
  const handlePlayerNamesChange = (value: string) => {
    setPlayerNames(value);
    localStorage.setItem(STORAGE_KEY, value);
  };

  // Save deck type to localStorage whenever it changes
  const handleDeckTypeChange = (value: DeckType) => {
    setDeckType(value);
    localStorage.setItem(DECK_TYPE_KEY, value);
  };

  // Save joker mode to localStorage whenever it changes
  const handleJokerModeChange = (value: boolean) => {
    setJokerMode(value);
    localStorage.setItem(JOKER_MODE_KEY, value.toString());
  };

  // Save hidden cards count to localStorage whenever it changes
  const handleHiddenCardsCountChange = (value: HiddenCardsCount) => {
    setHiddenCardsCount(value);
    localStorage.setItem(HIDDEN_CARDS_KEY, value.toString());
  };

  // Save card size to localStorage whenever it changes
  const handleCardSizeChange = (delta: number) => {
    const newSize = Math.max(50, Math.min(200, cardSize + delta));
    setCardSize(newSize);
    localStorage.setItem(CARD_SIZE_KEY, newSize.toString());
  };

  const handlePlay = async () => {
    const names = playerNames
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (names.length === 0) {
      alert("Please enter at least one player name");
      return;
    }

    let newPlayers: Player[];

    if (deckType === "shared") {
      // Shared deck mode: create enough complete decks for all players
      const cardsNeeded = names.length * 5;
      const cardsPerDeck = jokerMode ? 54 : 52; // 52 cards or 54 with 2 jokers
      const jokersPerDeck = jokerMode ? 2 : 0;
      const decksNeeded = Math.ceil(cardsNeeded / cardsPerDeck);

      // Create multiple complete decks
      let combinedDeck: Card[] = [];
      for (let i = 0; i < decksNeeded; i++) {
        combinedDeck = combinedDeck.concat(createDeck(jokersPerDeck));
      }

      // Shuffle the combined deck before dealing
      const shuffledDeck = await shuffleDeck(combinedDeck);

      // Deal 5 cards to each player from the shared deck
      newPlayers = names.map((name, index) => {
        const startIdx = index * 5;
        const cards = shuffledDeck.slice(startIdx, startIdx + 5);
        return {
          name,
          cards,
          deck: [],
          handEvaluation: null,
        };
      });
    } else {
      // Independent deck mode: each player gets their own deck
      const jokersPerDeck = jokerMode ? 2 : 0;
      newPlayers = await Promise.all(
        names.map(async (name) => {
          const deck = createDeck(jokersPerDeck);
          const shuffledDeck = await shuffleDeck(deck);
          const cards = shuffledDeck.slice(0, 5);
          const remainingDeck = shuffledDeck.slice(5);

          return {
            name,
            cards,
            deck: remainingDeck,
            handEvaluation: null,
          };
        })
      );
    }

    // TESTING: Force ties by giving groups of players the same cards
    // Comment out this block when done testing
    // const testCards1: Card[] = ["Ah", "Kh", "Qh", "Jh", "10h"]; // Royal Flush
    // const testCards2: Card[] = ["As", "Ks", "Qs", "Js", "9s"]; // Flush (Ace high)
    // newPlayers = newPlayers.map((player, index) => ({
    //   ...player,
    //   cards: index < 2 ? testCards1 : testCards2,
    // }));
    // END TESTING

    // Sort players alphabetically by name
    const sortedPlayers = newPlayers.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    setPlayers(sortedPlayers);
    setGameState("showing");
    setWinners([]);
  };

  const handleReveal = () => {
    // Evaluate each player's hand
    const evaluatedPlayers = players.map((player) => {
      const evaluation = evaluatePokerHand(player.cards);
      return {
        ...player,
        handEvaluation: evaluation,
      };
    });

    // Sort players by hand strength (best to worst)
    const sortedPlayers = [...evaluatedPlayers].sort((a, b) => {
      return comparePokerHands(b.handEvaluation!, a.handEvaluation!);
    });

    setPlayers(sortedPlayers);

    // Find the winner(s) by comparing hands
    if (sortedPlayers.length === 0) return;

    const topPlayers: Player[] = [sortedPlayers[0]];

    for (let i = 1; i < sortedPlayers.length; i++) {
      const player = sortedPlayers[i];
      const comparison = comparePokerHands(
        player.handEvaluation!,
        topPlayers[0].handEvaluation!
      );

      if (comparison === 0) {
        // Tie with the best hand
        topPlayers.push(player);
      } else {
        // Lower hand, stop checking
        break;
      }
    }

    setWinners(topPlayers);
    setGameState("revealed");
  };

  const handleTieBreaker = async () => {
    // Create new hands for tied players only
    const newPlayers: Player[] = await Promise.all(
      winners.map(async (player) => {
        const deck = createDeck();
        const shuffledDeck = await shuffleDeck(deck);
        const cards = shuffledDeck.slice(0, 5);
        const remainingDeck = shuffledDeck.slice(5);

        return {
          name: player.name,
          cards,
          deck: remainingDeck,
          handEvaluation: null,
        };
      })
    );

    setPlayers(newPlayers);
    setGameState("showing");
    setWinners([]);
  };

  const handleNewGame = () => {
    setPlayers([]);
    setGameState("input");
    setWinners([]);
  };

  const handleMainMenu = () => {
    navigate("/");
  };

  const getButtonConfig = () => {
    switch (gameState) {
      case "input":
        return { text: "Play", onClick: handlePlay };
      case "showing":
        return { text: "Reveal", onClick: handleReveal };
      case "revealed":
        if (winners.length > 1) {
          return { text: "Tie Breaker", onClick: handleTieBreaker };
        }
        return { text: "Continue", onClick: handleNewGame };
      case "tiebreaker":
        return { text: "Reveal", onClick: handleReveal };
      default:
        return { text: "Play", onClick: handlePlay };
    }
  };

  const buttonConfig = getButtonConfig();

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
          {/* Mobile: Row 1 - Title */}
          <Row className="mb-2 d-md-none">
            <Col xs={12} className="text-center">
              <h1
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
                POKER PICKER
              </h1>
            </Col>
          </Row>
          {/* Mobile: Row 2 - Buttons */}
          <Row className="mb-3 d-md-none">
            <Col
              xs={12}
              className="d-flex align-items-center justify-content-center gap-2"
            >
              {gameState === "input" && (
                <Button
                  size="lg"
                  onClick={handleMainMenu}
                  style={{
                    backgroundColor: "#666666",
                    color: "#ffffff",
                    border: "2px solid #999999",
                    fontWeight: "bold",
                    fontSize: "clamp(0.8rem, 1.8vw, 1.1rem)",
                    padding: "clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px)",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                    fontFamily: "monospace",
                    whiteSpace: "nowrap",
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                    minWidth: "clamp(85px, 22vw, 150px)",
                  }}
                >
                  MENU
                </Button>
              )}
              <Button
                size="lg"
                onClick={buttonConfig.onClick}
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
                }}
              >
                {buttonConfig.text.toUpperCase()}
              </Button>
            </Col>
          </Row>
          {/* Desktop: Single Row */}
          <Row className="mb-2 align-items-center gx-2 d-none d-md-flex">
            <Col xs={1} className="d-none d-lg-block"></Col>
            <Col xs={3} lg={2}>
              <div className="d-flex align-items-center gap-2">
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
            <Col xs={6} lg={6} className="ps-md-0">
              <h1
                className="text-center"
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
                POKER PICKER
              </h1>
            </Col>
            <Col xs={3} lg={2} className="text-end pe-2">
              <div className="d-flex align-items-center justify-content-end gap-2">
                {gameState === "input" && (
                  <Button
                    size="lg"
                    onClick={handleMainMenu}
                    style={{
                      backgroundColor: "#666666",
                      color: "#ffffff",
                      border: "2px solid #999999",
                      fontWeight: "bold",
                      fontSize: "clamp(0.8rem, 1.8vw, 1.1rem)",
                      padding: "clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px)",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                      fontFamily: "monospace",
                      whiteSpace: "nowrap",
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                      minWidth: "clamp(85px, 22vw, 150px)",
                    }}
                  >
                    MENU
                  </Button>
                )}
                <Button
                  size="lg"
                  onClick={buttonConfig.onClick}
                  style={{
                    backgroundColor:
                      buttonConfig.text === "Tie Breaker"
                        ? "#ff6600"
                        : "#ffd700",
                    color:
                      buttonConfig.text === "Tie Breaker"
                        ? "#ffffff"
                        : "#000000",
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
                  }}
                >
                  {buttonConfig.text.toUpperCase()}
                </Button>
              </div>
            </Col>
          </Row>

          {gameState === "input" && (
            <Row className="mb-3">
              <Col md={{ span: 1, offset: 1 }} lg={{ span: 10, offset: 1 }}>
                <Form.Group className="mb-3">
                  <Form.Label
                    style={{
                      fontFamily: "monospace",
                      fontWeight: "bold",
                      fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
                      color: "#ffff00",
                    }}
                  >
                    Enter player names (comma separated)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Alice, Bob, Charlie"
                    value={playerNames}
                    onChange={(e) => handlePlayerNamesChange(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handlePlay();
                      }
                    }}
                    style={{
                      fontFamily: "monospace",
                      fontSize: "clamp(0.85rem, 1.8vw, 1rem)",
                      backgroundColor: "#000066",
                      color: "#ffffff",
                      border: "2px solid #ffd700",
                    }}
                  />
                </Form.Group>

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
                      checked={deckType === "independent"}
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
                      checked={deckType === "shared"}
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
                      checked={!jokerMode}
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
                      checked={jokerMode}
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
                      checked={hiddenCardsCount === 1}
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
                      checked={hiddenCardsCount === 2}
                      onChange={() => handleHiddenCardsCountChange(2)}
                      style={{
                        fontFamily: "monospace",
                        fontSize: "clamp(0.7rem, 1.8vw, 1rem)",
                        color: "#ffff00",
                      }}
                    />
                  </Col>
                </Row>

                {/* Hand Rankings - Mobile only */}
                <div
                  className="mt-3 d-md-none"
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
                    Hand Rankings
                  </h3>
                  <table
                    style={{
                      width: "100%",
                      fontFamily: "monospace",
                      fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)",
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

                {/* How to Play - Desktop only */}
                <div
                  className="mt-4 d-none d-md-block"
                  style={{
                    backgroundColor: "#000066",
                    border: "2px solid #ffd700",
                    borderRadius: "6px",
                    padding: "1rem",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "monospace",
                      fontWeight: "bold",
                      fontSize: "clamp(1rem, 2vw, 1.2rem)",
                      color: "#ffd700",
                      marginBottom: "0.75rem",
                    }}
                  >
                    How to Play
                  </h3>
                  <ul
                    style={{
                      fontFamily: "monospace",
                      fontSize: "clamp(0.75rem, 1.6vw, 0.9rem)",
                      color: "#ffff00",
                      marginBottom: "1rem",
                      paddingLeft: "1.5rem",
                    }}
                  >
                    <li>
                      Click PLAY to deal 5 cards to each player (
                      {5 - hiddenCardsCount} shown, {hiddenCardsCount} hidden)
                    </li>
                    <li>
                      Click REVEAL to show all cards and determine the winner
                    </li>
                    <li>
                      Highest poker hand wins! If tied, click TIE BREAKER to
                      play again
                    </li>
                  </ul>

                  <h3
                    style={{
                      fontFamily: "monospace",
                      fontWeight: "bold",
                      fontSize: "clamp(1rem, 2vw, 1.2rem)",
                      color: "#ffd700",
                      marginBottom: "0.75rem",
                      marginTop: "1rem",
                    }}
                  >
                    Poker Hand Rankings (Highest to Lowest)
                  </h3>
                  <table
                    style={{
                      width: "100%",
                      fontFamily: "monospace",
                      fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
                      color: "#ffff00",
                      borderCollapse: "collapse",
                    }}
                  >
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                          1. Five of a Kind
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          Five cards of the same rank (requires jokers)
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                          2. Royal Flush
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          A, K, Q, J, 10 of the same suit
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                          3. Straight Flush
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          Five sequential cards of the same suit
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                          4. Four of a Kind
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          Four cards of the same rank
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                          5. Full House
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          Three of a kind plus a pair
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                          6. Flush
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          Five cards of the same suit
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                          7. Straight
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          Five sequential cards of any suit
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                          8. Three of a Kind
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          Three cards of the same rank
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                          9. Two Pair
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          Two different pairs
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ffd700" }}>
                        <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                          10. One Pair
                        </td>
                        <td style={{ padding: "0.5rem" }}>
                          Two cards of the same rank
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                          11. High Card
                        </td>
                        <td style={{ padding: "0.5rem" }}>No matching cards</td>
                      </tr>
                    </tbody>
                  </table>
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
                    // Count how many players have a better hand
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
                          border: "2px solid #ffd700",
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
                            color: "#ff6600",
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
                          {player.cards.map((card, cardIndex) => (
                            <PlayingCard
                              key={cardIndex}
                              card={
                                cardIndex >= 5 - hiddenCardsCount &&
                                gameState === "showing"
                                  ? null
                                  : card
                              }
                              disableHover={true}
                              hideLabel={true}
                            />
                          ))}
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
