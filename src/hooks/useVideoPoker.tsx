import { useContext } from "react";
import { VideoPokerContext } from "../context/VideoPokerContext";

export const useVideoPoker = () => {
  const context = useContext(VideoPokerContext);
  if (!context) {
    throw new Error("useVideoPoker must be used within a VideoPokerProvider");
  }
  return context;
};
