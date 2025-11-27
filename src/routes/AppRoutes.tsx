import { Routes, Route } from "react-router-dom";
import { GameMenu } from "../pages/GameMenu";
import { VideoPokerGame } from "../pages/VideoPokerGame";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GameMenu />} />
      <Route path="/play" element={<VideoPokerGame />} />
    </Routes>
  );
}
