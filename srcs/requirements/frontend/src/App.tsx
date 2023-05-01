import { Route, Routes } from "react-router-dom";
import AboutPage from "./pages/landingPage/AboutPage";
// import ContactPage from './pages/landingPage/ContactPage';
import LandingPage from "./pages/landingPage/LandingPage";
import Game from "./pages/game";
import Gameprofile from "./pages/game/Profile";
import Layout from "./pages/layout";
import GameDashboard from "./pages/game/GameDashboard";
import GlobalStyle from "./GlobalStyle";
import { useState } from "react";
import { MdDoubleArrow } from "react-icons/md";

function App() {
  const [bgColor, setBgColor] = useState("#1E1D19");
  const [textColor, setTextColor] = useState("#ffffff");
  const handelBgChange = (e: any) => {
    setBgColor(e.target.value);
  };
  const handelTextChange = (e: any) => {
    setTextColor(e.target.value);
  };

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  return (
    <>
      <GlobalStyle background={bgColor} textColor={textColor} />
      <div
        className={`absolute w-[35rem] rounded-lg text-white bg-slate-400 flex items-center gap-3 p-2 ${
          isPaletteOpen ? "left-0" : "left-[-33rem]"
        } transition-all ease-in-out duration-300`}
      >
        <p>choose bg color</p>
        <input type="color" value={bgColor} onChange={handelBgChange} />
        <br />
        <p>choose text color</p>
        <input type="color" value={textColor} onChange={handelTextChange} />
        <button
          onClick={() => {
            setBgColor("#1E1D19");
            setTextColor("#ffffff");
          }}
          className="cursor-pointer bg-slate-500 w-[5rem] rounded-lg"
        >
          Reset Theme
        </button>
        <MdDoubleArrow
          className={`cursor-pointer text-2xl hover:scale-110 ${
            isPaletteOpen ? "rotate-180" : ""
          }`}
          onClick={() => setIsPaletteOpen(!isPaletteOpen)}
        />
      </div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="" element={<Layout />}>
          <Route path="/game" element={<Game />}>
            <Route path="/game/profile" element={<Gameprofile />} />
            <Route path="/game/dashboard" element={<GameDashboard />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
