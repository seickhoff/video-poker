import { Container, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useVideoPoker } from "../hooks/useVideoPoker";
import { GameType } from "../types/game";
import { gameConfigs } from "../utils/gameConfigs";

export const GameMenu = () => {
  const navigate = useNavigate();
  const { startNewGame } = useVideoPoker();

  const handleGameSelect = (gameType: GameType) => {
    startNewGame(gameType, 100);
    navigate("/play");
  };

  // Sort games alphabetically
  const sortedGames = Object.values(gameConfigs).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

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
            New games start with 100 credits. Make a selection below.
          </p>

          {/* Credit Display Row */}
          <Row className="mb-4">
            <Col xs={12} className="text-center">
              <div
                style={{
                  color: "#ff6600",
                  fontWeight: "bold",
                  fontFamily: "monospace",
                  fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
                  WebkitTextStroke: "clamp(0.5px, 0.15vw, 1px) #ffff00",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                }}
              >
                CREDIT $100
              </div>
            </Col>
          </Row>

          {/* Game Grid */}
          <Row>
            {sortedGames.map((config) => (
              <Col key={config.name} xs={12} md={6} lg={4} className="mb-4">
                <Card
                  onClick={() => handleGameSelect(config.name)}
                  style={{
                    backgroundColor: "#000066",
                    border: "3px solid #ffd700",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    height: "100%",
                    borderRadius: 16,
                  }}
                  className="h-100"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#0000aa";
                    e.currentTarget.style.borderColor = "#ffff00";
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 16px rgba(0, 0, 0, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#000066";
                    e.currentTarget.style.borderColor = "#ffd700";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <Card.Body className="d-flex flex-column">
                    <Card.Title
                      className="text-center mb-3"
                      style={{
                        color: "#ff6600",
                        fontWeight: "bold",
                        fontFamily: "monospace",
                        fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                        WebkitTextStroke: "clamp(0.5px, 0.15vw, 1px) #ffff00",
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                      }}
                    >
                      {config.name}
                    </Card.Title>
                    <Card.Text
                      style={{
                        color: "#ffff00",
                        fontFamily: "monospace",
                        fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
                        lineHeight: "1.4",
                      }}
                    >
                      {config.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
