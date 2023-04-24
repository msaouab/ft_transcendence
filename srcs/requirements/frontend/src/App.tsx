import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/home";
import Chat from "./pages/chat";
import Game from "./pages/game";
import User from "./pages/user";

function App() {

  const LinkStyle:string = " hover:bg-cyan-700 hover:text-white flex-1  text-center transition-all ease-linear duration-200 py-2 px-4 text-2xl "

  return (
    <div className="app">
      <div className="flex justify-center  mx-auto shadow-md  absolute top-0 left-0 w-full bg-slate-50 ">
        <nav className="w-[50%] flex justify-around bg">
          <Link to="/" className={LinkStyle} >
            Home
          </Link>
          <Link to="/chat" className={LinkStyle}>
            Chat
          </Link>
          <Link to="/game" className={LinkStyle}>
            Game
          </Link>
          <Link to="/user" className={LinkStyle}>
            User
          </Link>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/game" element={<Game />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </div>
  );
}

export default App;
