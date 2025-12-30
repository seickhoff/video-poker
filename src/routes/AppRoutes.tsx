import { Routes, Route } from "react-router-dom";
import { GameMenu } from "../pages/GameMenu";
import { VideoPokerGame } from "../pages/VideoPokerGame";
import { Statistics } from "../pages/Statistics";
import { Picker } from "../pages/Picker";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GameMenu />} />
      <Route path="/play" element={<VideoPokerGame />} />
      <Route path="/statistics" element={<Statistics />} />
      <Route path="/picker" element={<Picker />} />
    </Routes>
  );
}
