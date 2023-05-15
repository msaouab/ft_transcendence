import { Route, Routes } from "react-router-dom";
import AboutPage from "./pages/landingPage/AboutPage";
// import ContactPage from './pages/landingPage/ContactPage';
import LandingPage from "./pages/landingPage/LandingPage";
import Home from "./pages/game/Home";
import Layout from "./pages/layout";
import GameDashboard from "./pages/game/GameDashboard";
import GlobalStyle from "./GlobalStyle";
import { useState } from "react";
import { MdDoubleArrow } from "react-icons/md";
// import { ReactComponent as SearchIcon } from '../src/assets/icons/searchIcon.svg'
import LoginPage from "./pages/loginPage/LoginPage";
import Profile from "./pages/user/Profile";
import Game from "./components/common/Game";
import UserSettings from "./pages/user/UserSettings";
import Chat from "./pages/chat";
import VerifyPage from "./pages/loginPage/VerifyPage";


function App() {
  const [bgColor, setBgColor] = useState("#1E1E1E");
  const [textColor, setTextColor] = useState("#ffffff");
  const handelBgChange = (e: any) => {
    setBgColor(e.target.value);
  };
  const handelTextChange = (e: any) => {
    setTextColor(e.target.value);
  };

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // const L  inkStyle: string = " hover:bg-cyan-700 hover:text-white flex-1  text-center transition-all ease-linear duration-200 py-2 px-4 text-2xl "

  return (
    <>
      <GlobalStyle background={bgColor} textColor={textColor} />
      {/* <SearchIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl" /> */}
      {/* <div
        className={`absolute w-[35rem] rounded-lg text-white bg-slate-400 flex items-center gap-3 p-2 ${
          isPaletteOpen ? "left-2/4" : "left-[32rem] "
        } transition-all ease-in-out duration-300 z-50`}
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
      </div> */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/tfa" element={<VerifyPage />} />
        <Route path="" element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Home />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/game" element={<GameDashboard />} />
          <Route path="/game/10" element={<Game />} />
          <Route path="/chat" element={<Chat />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
