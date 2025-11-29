import { Table } from "react-bootstrap";
import { GameType, HandType } from "../types/game";
import { gameConfigs } from "../utils/gameConfigs";

interface PayoutTableProps {
  gameType: GameType;
  wager: number;
  currentHand: HandType;
}

export const PayoutTable = ({
  gameType,
  wager,
  currentHand,
}: PayoutTableProps) => {
  const config = gameConfigs[gameType];

  const getRowStyle = (handType: HandType) => {
    if (currentHand === handType && currentHand !== "") {
      return {
        backgroundColor: "#000066",
        color: "#ffffff",
        fontWeight: "bold",
        lineHeight: "1.1",
      };
    }
    return {
      backgroundColor: "#000066",
      color: "#ffff00",
      lineHeight: "1.1",
    };
  };

  const getCellStyle = (handType: HandType, betIndex: number) => {
    const baseStyle = {
      borderTop: "none" as const,
      borderBottom: "none" as const,
      borderLeft: "3px solid #ffd700" as const,
      borderRight: "none" as const,
      color: "#ffff00" as const,
      backgroundColor: "#000066" as const,
      padding: "2px 4px" as const,
      textAlign: "right" as const,
      width: "auto" as const,
    };

    if (
      currentHand === handType &&
      wager === betIndex + 1 &&
      currentHand !== ""
    ) {
      return {
        ...baseStyle,
        backgroundColor: "#ff0000",
        color: "#ffffff",
        fontWeight: "bold",
      };
    }
    if (betIndex + 1 === wager) {
      return {
        ...baseStyle,
        backgroundColor: "#cc0000",
        fontWeight: "bold",
      };
    }
    return baseStyle;
  };

  return (
    <div>
      <h1
        className="text-center p-2"
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
        {gameType}
      </h1>
      <div
        style={{
          border: "3px solid #ffd700",
          backgroundColor: "#000066",
        }}
      >
        <Table
          size="sm"
          className="mb-0"
          style={{
            backgroundColor: "#000066",
            border: "none",
            color: "#ffff00",
            borderCollapse: "collapse",
            textTransform: "uppercase",
            fontSize: "clamp(0.7rem, 2.5vw, 1.3rem)",
            fontFamily: "monospace",
          }}
        >
          <tbody>
            {config.payoutTable.map((entry) => (
              <tr key={entry.hand} style={getRowStyle(entry.hand)}>
                <td
                  className="text-start"
                  style={{
                    width: "auto",
                    minWidth: "0",
                    borderTop: "none",
                    borderBottom: "none",
                    borderLeft: "none",
                    borderRight: "3px solid #ffd700",
                    color:
                      currentHand === entry.hand && currentHand !== ""
                        ? "#ffffff"
                        : "#ffff00",
                    padding: "2px 4px",
                    position: "relative",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    backgroundColor: "#000066",
                  }}
                >
                  <span
                    style={{
                      position: "relative",
                      zIndex: 2,
                      backgroundColor: "inherit",
                      paddingRight: "4px",
                      WebkitTextStroke:
                        currentHand === entry.hand && currentHand !== ""
                          ? "0.5px #ffd700"
                          : "0.5px #ff6600",
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    {entry.hand}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      left: "8px",
                      letterSpacing: "3px",
                      zIndex: 1,
                      color: "#ffff00",
                      opacity: 0.5,
                    }}
                  >
                    {
                      "...................................................................................................."
                    }
                  </span>
                </td>
                <td style={getCellStyle(entry.hand, 0)}>{entry.payouts[0]}</td>
                <td style={getCellStyle(entry.hand, 1)}>{entry.payouts[1]}</td>
                <td style={getCellStyle(entry.hand, 2)}>{entry.payouts[2]}</td>
                <td style={getCellStyle(entry.hand, 3)}>{entry.payouts[3]}</td>
                <td style={getCellStyle(entry.hand, 4)}>{entry.payouts[4]}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};
