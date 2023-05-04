import { Link, Route, Routes, useNavigate } from "react-router-dom";
// import Home from "./pages/home";
import Chat from "./pages/chat";
import Game from "./pages/game";
import User from "./pages/user";
import LandingPage from "./pages/landingPage/LandingPage";

function App() {

  // const L  inkStyle: string = " hover:bg-cyan-700 hover:text-white flex-1  text-center transition-all ease-linear duration-200 py-2 px-4 text-2xl "

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/game" element={<Game />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </div>
  );
}

export default App;
