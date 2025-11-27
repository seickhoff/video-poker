import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "./context/AppProvider";
import { VideoPokerProvider } from "./context/VideoPokerProvider";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <AppProvider>
      <VideoPokerProvider>
        <Router>
          <AppRoutes />
        </Router>
      </VideoPokerProvider>
    </AppProvider>
  );
}
