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
        lineHeight: "1.2",
      };
    }
    return {
      backgroundColor: "#000066",
      color: "#ffff00",
      lineHeight: "1.2",
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
      padding: "4px 8px" as const,
      textAlign: "right" as const,
      width: "80px" as const,
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
          color: "#ffff00",
          fontWeight: "bold",
          textTransform: "uppercase",
          fontFamily: "monospace",
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
            fontSize: "1.1rem",
            fontFamily: "monospace",
          }}
        >
          <tbody>
            {config.payoutTable.map((entry) => (
              <tr key={entry.hand} style={getRowStyle(entry.hand)}>
                <td
                  className="text-start"
                  style={{
                    width: "300px",
                    borderTop: "none",
                    borderBottom: "none",
                    borderLeft: "none",
                    borderRight: "3px solid #ffd700",
                    color:
                      currentHand === entry.hand && currentHand !== ""
                        ? "#ffffff"
                        : "#ffff00",
                    padding: "4px 8px",
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
                <td style={getCellStyle(entry.hand, 4)}>
                  {entry.hand === "Royal Flush" && wager === 5
                    ? "4000"
                    : entry.payouts[4].toString()}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};
