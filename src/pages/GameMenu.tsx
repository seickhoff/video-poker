import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useVideoPoker } from "../hooks/useVideoPoker";
import { GameType } from "../types/game";
import { gameConfigs } from "../utils/gameConfigs";

export const GameMenu = () => {
  const navigate = useNavigate();
  const { startNewGame, credits } = useVideoPoker();
  const [selectedGame, setSelectedGame] = useState<GameType>("Jacks or Better");
  const [selectedCredits, setSelectedCredits] = useState<number>(
    credits > 0 ? credits : 100
  );

  const handleStart = () => {
    startNewGame(selectedGame, selectedCredits);
    navigate("/play");
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
          <h1
            className="text-center mb-4"
            style={{
              color: "#ff6600",
              fontWeight: "bold",
              textTransform: "uppercase",
              fontFamily: "monospace",
              WebkitTextStroke: "clamp(1px, 0.3vw, 2px) #ffff00",
              textShadow: "3px 3px 5px rgba(0, 0, 0, 0.8)",
              fontSize: "clamp(2rem, 6vw, 3rem)",
            }}
          >
            VIDEO POKER
          </h1>
          <p
            className="text-center mb-4"
            style={{
              color: "#00ff00",
              fontWeight: "bold",
              fontFamily: "monospace",
              fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)",
            }}
          >
            Welcome to this suite of Video Poker games. New games start with 100
            credits. The payout tables and game-play accurately emulate casino
            games.
          </p>

          <Row>
            {/* Left Card - Game Setup */}
            <Col xs={12} md={6} className="mb-4">
              <Card
                style={{
                  backgroundColor: "#000066",
                  border: "3px solid #ffd700",
                  height: "100%",
                }}
              >
                <Card.Body>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label
                        className="fs-5"
                        style={{
                          color: "#ffff00",
                          fontWeight: "bold",
                          fontFamily: "monospace",
                        }}
                      >
                        CREDITS
                      </Form.Label>
                      <Form.Select
                        value={selectedCredits}
                        onChange={(e) =>
                          setSelectedCredits(Number(e.target.value))
                        }
                        style={{
                          backgroundColor: "#000066",
                          color: "#ffff00",
                          border: "2px solid #ffd700",
                          fontFamily: "monospace",
                          fontWeight: "bold",
                        }}
                      >
                        {credits > 0 && (
                          <option value={credits}>{credits}</option>
                        )}
                        {credits !== 100 && <option value={100}>100</option>}
                        <option value={500}>500</option>
                        <option value={1000}>1000</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label
                        className="fs-5"
                        style={{
                          color: "#ffff00",
                          fontWeight: "bold",
                          fontFamily: "monospace",
                        }}
                      >
                        GAME
                      </Form.Label>
                      <Form.Select
                        value={selectedGame}
                        onChange={(e) =>
                          setSelectedGame(e.target.value as GameType)
                        }
                        style={{
                          backgroundColor: "#000066",
                          color: "#ffff00",
                          border: "2px solid #ffd700",
                          fontFamily: "monospace",
                          fontWeight: "bold",
                        }}
                      >
                        <option value="Aces and Faces">Aces and Faces</option>
                        <option value="Bonus Poker">Bonus Poker</option>
                        <option value="Deuces Wild">Deuces Wild</option>
                        <option value="Double Bonus">Double Bonus</option>
                        <option value="Double Double Bonus">
                          Double Double Bonus
                        </option>
                        <option value="Double Joker Poker">
                          Double Joker Poker
                        </option>
                        <option value="Jacks or Better">Jacks or Better</option>
                        <option value="Joker Wild">Joker Wild</option>
                        <option value="Pick-a-Pair Poker">
                          Pick-a-Pair Poker
                        </option>
                        <option value="Triple Double Bonus">
                          Triple Double Bonus
                        </option>
                      </Form.Select>
                    </Form.Group>

                    <div className="text-center">
                      <Button
                        size="lg"
                        onClick={handleStart}
                        style={{
                          backgroundColor: "#ffd700",
                          color: "#000000",
                          border: "3px solid #ffff00",
                          fontWeight: "bold",
                          fontSize: "1.5rem",
                          padding: "12px 40px",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
                          fontFamily: "monospace",
                        }}
                      >
                        START GAME
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Right Card - Game Descriptions */}
            <Col xs={12} md={6} className="mb-4">
              <Card
                style={{
                  backgroundColor: "#000066",
                  border: "3px solid #ffd700",
                  height: "100%",
                }}
              >
                <Card.Body>
                  <Card.Text
                    className="mb-3 fs-5"
                    style={{
                      color: "#ffff00",
                      fontWeight: "bold",
                      fontFamily: "monospace",
                    }}
                  >
                    GAMES
                  </Card.Text>

                  {Object.values(gameConfigs).map((config) => (
                    <div key={config.name} className="mb-3">
                      <h6
                        className="text-decoration-underline"
                        style={{
                          color: "#ffd700",
                          fontFamily: "monospace",
                          fontWeight: "bold",
                        }}
                      >
                        {config.name}
                      </h6>
                      <p
                        className="mb-2"
                        style={{
                          fontSize: "0.9rem",
                          color: "#ffff00",
                          fontFamily: "monospace",
                        }}
                      >
                        {config.description}
                      </p>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
