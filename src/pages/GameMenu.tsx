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
      className="mt-5"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #1a1a4d 0%, #000066 100%)",
      }}
    >
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h1
            className="text-center mb-4"
            style={{
              color: "#ffd700",
              textShadow: "0 0 10px #ffff00",
              fontWeight: "bold",
              fontSize: "3rem",
            }}
          >
            VIDEO POKER
          </h1>
          <p
            className="text-center mb-4"
            style={{ color: "#ffff00", fontWeight: "bold" }}
          >
            Version 2.0 - React/TypeScript Edition
          </p>

          <Card
            className="mb-4"
            style={{
              backgroundColor: "#1a1a4d",
              border: "3px solid #ffd700",
            }}
          >
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="fs-5"
                    style={{ color: "#ffff00", fontWeight: "bold" }}
                  >
                    Credits
                  </Form.Label>
                  <Form.Select
                    value={selectedCredits}
                    onChange={(e) => setSelectedCredits(Number(e.target.value))}
                    style={{
                      backgroundColor: "#000066",
                      color: "#ffffff",
                      border: "2px solid #ffd700",
                    }}
                  >
                    {credits > 0 && <option value={credits}>{credits}</option>}
                    {credits !== 100 && <option value={100}>100</option>}
                    <option value={500}>500</option>
                    <option value={1000}>1000</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label
                    className="fs-5"
                    style={{ color: "#ffff00", fontWeight: "bold" }}
                  >
                    Game
                  </Form.Label>
                  <Form.Select
                    value={selectedGame}
                    onChange={(e) =>
                      setSelectedGame(e.target.value as GameType)
                    }
                    style={{
                      backgroundColor: "#000066",
                      color: "#ffffff",
                      border: "2px solid #ffd700",
                    }}
                  >
                    <option value="Aces and Faces">Aces and Faces</option>
                    <option value="Deuces Wild">Deuces Wild</option>
                    <option value="Double Joker Poker">
                      Double Joker Poker
                    </option>
                    <option value="Jacks or Better">Jacks or Better</option>
                    <option value="Joker Wild">Joker Wild</option>
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
                    }}
                  >
                    START GAME
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <Card
            style={{
              backgroundColor: "#1a1a4d",
              border: "3px solid #ffd700",
            }}
          >
            <Card.Body>
              <Card.Text className="mb-3" style={{ color: "#00ff00" }}>
                Welcome to this suite of Video Poker games featuring the "Iraqi
                War Most-wanted" deck of cards. New games start with 100
                credits. The payout tables and game-play accurately emulate the
                casino games.
              </Card.Text>

              {Object.values(gameConfigs).map((config) => (
                <div key={config.name} className="mb-3">
                  <h6
                    className="text-decoration-underline"
                    style={{ color: "#ffd700" }}
                  >
                    {config.name}
                  </h6>
                  <p
                    className="mb-2"
                    style={{ fontSize: "0.9rem", color: "#ffffff" }}
                  >
                    {config.description}
                  </p>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
