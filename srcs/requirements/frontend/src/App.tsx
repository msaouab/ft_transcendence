import { Route, Routes } from "react-router-dom";
import AboutPage from "./pages/landingPage/AboutPage";
// import ContactPage from './pages/landingPage/ContactPage';
import LandingPage from "./pages/landingPage/LandingPage";
import Game from "./pages/game";
import Gameprofile from "./pages/game/Profile";
import Layout from "./pages/layout";
import Test from "./pages/game/Test";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="" element={<Layout />}>
        <Route path="/game" element={<Game />}>
          <Route path="/game/profile" element={<Gameprofile />} />
          <Route path="/game/test" element={<Test />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
