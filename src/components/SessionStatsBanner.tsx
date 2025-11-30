import { SessionStats } from "../types/statistics";

interface SessionStatsBannerProps {
  sessionStats: SessionStats;
}

export const SessionStatsBanner = ({
  sessionStats,
}: SessionStatsBannerProps) => {
  const { handsPlayed, netProfit, biggestWin, currentDoubleDownChain } =
    sessionStats;

  if (handsPlayed === 0) return null;

  return (
    <div
      style={{
        backgroundColor: "rgba(0, 0, 102, 0.8)",
        border: "2px solid #ffd700",
        borderRadius: "5px",
        padding: "8px 12px",
        marginBottom: "8px",
        display: "flex",
        gap: "16px",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          color: "#ffff00",
          fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)",
          fontFamily: "monospace",
          fontWeight: "bold",
        }}
      >
        SESSION: {handsPlayed} {handsPlayed === 1 ? "hand" : "hands"}
      </div>

      {biggestWin > 0 && (
        <div
          style={{
            color: "#00ff00",
            fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)",
            fontFamily: "monospace",
            fontWeight: "bold",
          }}
        >
          BIGGEST WIN: ${biggestWin}
        </div>
      )}

      {currentDoubleDownChain > 0 && (
        <div
          style={{
            color: "#ff6600",
            fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)",
            fontFamily: "monospace",
            fontWeight: "bold",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        >
          🔥 {currentDoubleDownChain}X CHAIN 🔥
        </div>
      )}

      <div
        style={{
          color: netProfit >= 0 ? "#00ff00" : "#ff0000",
          fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)",
          fontFamily: "monospace",
          fontWeight: "bold",
        }}
      >
        NET: {netProfit >= 0 ? "+" : ""}${netProfit}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};
