import { CSSProperties } from "react";

export const BUTTON_STYLES = {
  primary: {
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
  } as CSSProperties,

  disabled: {
    backgroundColor: "#666666",
    color: "#999999",
    border: "3px solid #888888",
    fontWeight: "bold",
    fontSize: "clamp(0.8rem, 2vw, 1.1rem)",
    padding: "clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
    fontFamily: "monospace",
    minWidth: "clamp(80px, 20vw, 150px)",
    whiteSpace: "nowrap",
    cursor: "not-allowed",
  } as CSSProperties,
};
