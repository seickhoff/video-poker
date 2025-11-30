import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { GameType } from "../types/game";
import {
  loadStatistics,
  calculateWinPercentage,
  calculateNetProfit,
  calculateDoubleDownSuccessRate,
  calculateActualRTP,
  formatLastPlayed,
  getTopHands,
  clearGameStatistics,
} from "../utils/statistics";

export const Statistics = () => {
  const navigate = useNavigate();
  const allStats = loadStatistics();

  // Sort games alphabetically by name
  const sortedStats = Object.entries(allStats).sort(([nameA], [nameB]) =>
    nameA.localeCompare(nameB)
  );

  const handleClearStats = (gameType: GameType) => {
    if (
      window.confirm(
        `Are you sure you want to clear all statistics for ${gameType}?`
      )
    ) {
      clearGameStatistics(gameType);
      window.location.reload();
    }
  };

  // Calculate overall summary stats
  const overallStats = Object.values(allStats).reduce(
    (acc, stats) => ({
      totalHands: acc.totalHands + stats.totalHandsPlayed,
      totalWins: acc.totalWins + stats.totalWins,
      totalCreditsWon: acc.totalCreditsWon + stats.totalCreditsWon,
      totalCreditsLost: acc.totalCreditsLost + stats.totalCreditsLost,
      totalSessions: acc.totalSessions + stats.sessionsPlayed,
    }),
    {
      totalHands: 0,
      totalWins: 0,
      totalCreditsWon: 0,
      totalCreditsLost: 0,
      totalSessions: 0,
    }
  );

  const overallWinPct =
    overallStats.totalHands > 0
      ? (overallStats.totalWins / overallStats.totalHands) * 100
      : 0;
  const overallRTP =
    overallStats.totalCreditsLost > 0
      ? (overallStats.totalCreditsWon / overallStats.totalCreditsLost) * 100
      : 0;
  const overallNetProfit =
    overallStats.totalCreditsWon - overallStats.totalCreditsLost;

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
          {/* Header */}
          <div className="text-center mb-4">
            <h1
              style={{
                color: "#ff6600",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontFamily: "monospace",
                WebkitTextStroke: "clamp(1px, 0.3vw, 2px) #ffff00",
                textShadow: "3px 3px 5px rgba(0, 0, 0, 0.8)",
                fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
              }}
            >
              Statistics
            </h1>
            <Button
              onClick={() => navigate("/")}
              style={{
                backgroundColor: "#666666",
                color: "#ffffff",
                border: "3px solid #cccccc",
                fontWeight: "bold",
                fontSize: "1rem",
                padding: "8px 16px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                fontFamily: "monospace",
                marginTop: "16px",
              }}
            >
              Back to Menu
            </Button>
          </div>

          {/* Overall Summary Card */}
          {Object.keys(allStats).length > 0 && (
            <Card
              className="mb-4"
              style={{
                backgroundColor: "#000088",
                border: "3px solid #ffd700",
                borderRadius: "6px",
                color: "#ffff00",
              }}
            >
              <Card.Header
                style={{
                  backgroundColor: "#0000aa",
                  borderBottom: "2px solid #ffd700",
                  padding: "16px",
                }}
              >
                <h3
                  style={{
                    color: "#ff6600",
                    fontWeight: "bold",
                    fontFamily: "monospace",
                    fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                    margin: 0,
                    WebkitTextStroke: "0.5px #ffff00",
                    textAlign: "center",
                  }}
                >
                  📊 OVERALL SUMMARY
                </h3>
              </Card.Header>
              <Card.Body style={{ padding: "20px" }}>
                <Row>
                  <Col md={4} className="mb-3">
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: "clamp(0.85rem, 2vw, 1rem)",
                        textAlign: "center",
                      }}
                    >
                      <div className="mb-2">
                        <span style={{ color: "#ffff00" }}>
                          Total Sessions:
                        </span>{" "}
                        <span style={{ color: "#00ff00" }}>
                          {overallStats.totalSessions}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span style={{ color: "#ffff00" }}>Total Hands:</span>{" "}
                        <span style={{ color: "#00ff00" }}>
                          {overallStats.totalHands}
                        </span>
                      </div>
                    </div>
                  </Col>
                  <Col md={4} className="mb-3">
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: "clamp(0.85rem, 2vw, 1rem)",
                        textAlign: "center",
                      }}
                    >
                      <div className="mb-2">
                        <span style={{ color: "#ffff00" }}>Win Rate:</span>{" "}
                        <span style={{ color: "#00ff00" }}>
                          {overallWinPct.toFixed(1)}%
                        </span>
                      </div>
                      <div className="mb-2">
                        <span style={{ color: "#ffff00" }}>Overall RTP:</span>{" "}
                        <span
                          style={{
                            color: overallRTP >= 100 ? "#00ff00" : "#ff6600",
                          }}
                        >
                          {overallRTP.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </Col>
                  <Col md={4} className="mb-3">
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: "clamp(0.85rem, 2vw, 1rem)",
                        textAlign: "center",
                      }}
                    >
                      <div className="mb-2">
                        <span style={{ color: "#ffff00" }}>Net Profit:</span>{" "}
                        <span
                          style={{
                            color:
                              overallNetProfit >= 0 ? "#00ff00" : "#ff0000",
                          }}
                        >
                          {overallNetProfit >= 0 ? "+" : ""}${overallNetProfit}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span style={{ color: "#ffff00" }}>Games Played:</span>{" "}
                        <span style={{ color: "#00ff00" }}>
                          {Object.keys(allStats).length}
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* Statistics Cards */}
          {Object.keys(allStats).length === 0 ? (
            <div
              style={{
                backgroundColor: "#000066",
                border: "3px solid #ffd700",
                borderRadius: "6px",
                padding: "32px",
                textAlign: "center",
                color: "#ffff00",
                fontSize: "1.2rem",
                fontFamily: "monospace",
              }}
            >
              No statistics yet. Play some games to see your stats!
            </div>
          ) : (
            sortedStats.map(([gameType, stats]) => {
              const winPct = calculateWinPercentage(stats);
              const netProfit = calculateNetProfit(stats);
              const ddSuccessRate = calculateDoubleDownSuccessRate(stats);
              const actualRTP = calculateActualRTP(stats);
              const topHands = getTopHands(stats);
              const lastPlayedText = formatLastPlayed(stats.lastPlayed);

              return (
                <Card
                  key={gameType}
                  className="mb-4"
                  style={{
                    backgroundColor: "#000066",
                    border: "3px solid #ffd700",
                    borderRadius: "6px",
                    color: "#ffff00",
                  }}
                >
                  <Card.Header
                    style={{
                      backgroundColor: "#000088",
                      borderBottom: "2px solid #ffd700",
                      padding: "16px",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <h3
                        style={{
                          color: "#ff6600",
                          fontWeight: "bold",
                          fontFamily: "monospace",
                          fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                          margin: 0,
                          WebkitTextStroke: "0.5px #ffff00",
                        }}
                      >
                        {gameType}
                      </h3>
                      <Button
                        size="sm"
                        onClick={() => handleClearStats(gameType as GameType)}
                        style={{
                          backgroundColor: "#cc0000",
                          border: "2px solid #ff0000",
                          fontFamily: "monospace",
                          fontSize: "0.8rem",
                        }}
                      >
                        Clear Stats
                      </Button>
                    </div>
                  </Card.Header>
                  <Card.Body style={{ padding: "20px" }}>
                    <Row>
                      <Col md={6} className="mb-3">
                        <div
                          style={{
                            fontFamily: "monospace",
                            fontSize: "clamp(0.85rem, 2vw, 1rem)",
                          }}
                        >
                          <div className="mb-2">
                            <span style={{ color: "#ffff00" }}>
                              Last Played:
                            </span>{" "}
                            <span style={{ color: "#00ff00" }}>
                              {lastPlayedText}
                            </span>
                          </div>
                          <div className="mb-2">
                            <span style={{ color: "#ffff00" }}>Sessions:</span>{" "}
                            <span style={{ color: "#00ff00" }}>
                              {stats.sessionsPlayed}
                            </span>
                          </div>
                          <div className="mb-2">
                            <span style={{ color: "#ffff00" }}>
                              Total Hands:
                            </span>{" "}
                            <span style={{ color: "#00ff00" }}>
                              {stats.totalHandsPlayed}
                            </span>
                          </div>
                          <div className="mb-2">
                            <span style={{ color: "#ffff00" }}>Win Rate:</span>{" "}
                            <span style={{ color: "#00ff00" }}>
                              {winPct.toFixed(1)}%
                            </span>
                          </div>
                          <div className="mb-2">
                            <span style={{ color: "#ffff00" }}>
                              Actual RTP:
                            </span>{" "}
                            <span
                              style={{
                                color: actualRTP >= 100 ? "#00ff00" : "#ff6600",
                              }}
                            >
                              {actualRTP.toFixed(2)}%
                            </span>
                          </div>
                          <div className="mb-2">
                            <span style={{ color: "#ffff00" }}>
                              Net Profit:
                            </span>{" "}
                            <span
                              style={{
                                color: netProfit >= 0 ? "#00ff00" : "#ff0000",
                              }}
                            >
                              {netProfit >= 0 ? "+" : ""}${netProfit}
                            </span>
                          </div>
                        </div>
                      </Col>
                      <Col md={6} className="mb-3">
                        <div
                          style={{
                            fontFamily: "monospace",
                            fontSize: "clamp(0.85rem, 2vw, 1rem)",
                          }}
                        >
                          <div className="mb-2">
                            <span style={{ color: "#ffff00" }}>
                              Biggest Hand Win:
                            </span>{" "}
                            <span style={{ color: "#00ff00" }}>
                              ${stats.biggestHandWin}
                            </span>
                          </div>
                          <div className="mb-2">
                            <span style={{ color: "#ffff00" }}>
                              Biggest Double Down:
                            </span>{" "}
                            <span style={{ color: "#00ff00" }}>
                              ${stats.biggestDoubleDownWin}
                            </span>
                          </div>
                          <div className="mb-2">
                            <span style={{ color: "#ffff00" }}>
                              Longest DD Chain:
                            </span>{" "}
                            <span style={{ color: "#ff6600" }}>
                              {stats.longestDoubleDownChain}x
                            </span>
                          </div>
                          <div className="mb-2">
                            <span style={{ color: "#ffff00" }}>
                              Highest Credits:
                            </span>{" "}
                            <span style={{ color: "#00ff00" }}>
                              ${stats.highestCredits}
                            </span>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    {/* Streaks Section */}
                    {(stats.longestWinStreak > 0 ||
                      stats.longestLossStreak > 0) && (
                      <Row className="mt-3">
                        <Col>
                          <div
                            style={{
                              backgroundColor: "#000088",
                              border: "2px solid #ffd700",
                              borderRadius: "4px",
                              padding: "12px",
                              fontFamily: "monospace",
                              fontSize: "clamp(0.85rem, 2vw, 1rem)",
                            }}
                          >
                            <div className="mb-2">
                              <span style={{ color: "#ffd700" }}>
                                🔥 STREAKS
                              </span>
                            </div>
                            <div className="d-flex gap-4 flex-wrap">
                              {stats.longestWinStreak > 0 && (
                                <div>
                                  <span style={{ color: "#ffff00" }}>
                                    Best Win Streak:
                                  </span>{" "}
                                  <span style={{ color: "#00ff00" }}>
                                    {stats.longestWinStreak}
                                  </span>
                                </div>
                              )}
                              {stats.longestLossStreak > 0 && (
                                <div>
                                  <span style={{ color: "#ffff00" }}>
                                    Worst Loss Streak:
                                  </span>{" "}
                                  <span style={{ color: "#ff0000" }}>
                                    {stats.longestLossStreak}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    )}

                    {/* Double Down Stats */}
                    {stats.totalDoubleDownsAttempted > 0 && (
                      <Row className="mt-3">
                        <Col>
                          <div
                            style={{
                              backgroundColor: "#000088",
                              border: "2px solid #ff6600",
                              borderRadius: "4px",
                              padding: "12px",
                              fontFamily: "monospace",
                              fontSize: "clamp(0.85rem, 2vw, 1rem)",
                            }}
                          >
                            <div className="mb-2">
                              <span style={{ color: "#ff6600" }}>
                                🎲 DOUBLE DOWN STATS
                              </span>
                            </div>
                            <div>
                              <span style={{ color: "#ffff00" }}>
                                Success Rate:
                              </span>{" "}
                              <span style={{ color: "#00ff00" }}>
                                {ddSuccessRate.toFixed(1)}%
                              </span>{" "}
                              <span style={{ color: "#888888" }}>
                                ({stats.totalDoubleDownsWon}/
                                {stats.totalDoubleDownsAttempted})
                              </span>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    )}

                    {/* Top Hands */}
                    {topHands.length > 0 && (
                      <Row className="mt-3">
                        <Col>
                          <div
                            style={{
                              backgroundColor: "#000088",
                              border: "2px solid #00ff00",
                              borderRadius: "4px",
                              padding: "12px",
                              fontFamily: "monospace",
                              fontSize: "clamp(0.85rem, 2vw, 1rem)",
                            }}
                          >
                            <div className="mb-2" style={{ color: "#00ff00" }}>
                              🏆 TOP HANDS
                            </div>
                            {topHands.map((hand, idx) => (
                              <div key={hand.handType} className="mb-1">
                                <span style={{ color: "#ffff00" }}>
                                  {idx + 1}. {hand.handType}:
                                </span>{" "}
                                <span style={{ color: "#00ff00" }}>
                                  {hand.count}x
                                </span>
                              </div>
                            ))}
                          </div>
                        </Col>
                      </Row>
                    )}
                  </Card.Body>
                </Card>
              );
            })
          )}
        </Col>
      </Row>
    </Container>
  );
};
