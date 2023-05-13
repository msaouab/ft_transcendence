import { Link, Route, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from "react";
import Logo from "/logo.svg";
import {
  Home,
  Chat,
  Game,
  Settings,
  Profile,
  Logout,
} from "../../assets/icons";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import instance from "../../api/axios";
import { useGlobalContext } from "../../provider/AppContext";
import { RxHamburgerMenu } from "react-icons/rx";
import { CgClose } from "react-icons/cg";

const Routes = [
  {
    name: "home",
    icon: <Home />,
    link: "/",
  },
  {
    name: "chat",
    icon: <Chat />,
    link: "/chat",
  },
  {
    name: "game",
    icon: <Game />,
    link: "/game",
  },
  {
    name: "profile",
    icon: <Profile />,
    link: "/profile",
  },
  {
    name: "settings",
    icon: <Settings />,
    link: "/settings",
  },
  {
    name: "logout",
    icon: <Logout />,
    link: "/logout",
  },
];

const SideBar = () => {
  const [activeLink, setActiveLink] = useState<string>("home");
  const [activeMenu, setActiveMenu] = useState<boolean>(false);
  const [sidebarWidth, setSidebarWidth] = useState<number>(80);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { setUserStatus } = useGlobalContext();

  const [openSidebar, setOpenSidebar] = useState(false);
  // function log

  useEffect(() => {
    const storedLink = localStorage.getItem("activeLink");
    if (storedLink) {
      setActiveLink(storedLink);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("activeLink", activeLink);
  }, [activeLink]);
  const handleClick = (link: string) => {
    setActiveLink(link);
    setActiveMenu(false);
    setOpenSidebar(false);
    console.log(link);
  };

  const [menuIndex, setMenuIndex] = useState<number>(0);

  const handleMenuClick = () => {
    setActiveMenu(!activeMenu);
    setSidebarWidth((prevWidth) => (prevWidth === 80 ? 240 : 80));
  };
  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      try {
        await instance
          .get("/me")
          .then((response) => {
            if (
              response?.data?.tfa == true &&
              response.data.otp_verified == false
            ) {
              // alert("Please enable two factor authentication");
              navigate("/login/two-factor-authentication");
            }
            if (response.statusText) {
            }
            Cookies.set("userid", response.data.id);
            // setOnlineStat(user.status);
            setUserStatus(response.data.status);
          })
          .catch((error) => {
            if (error.response.status == 401) {
              navigate("/login");
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);
  const handleLogout = () => {
    async function logout() {
      try {
        await instance.get("/logout").catch((error) => {
          if (error.response.status == 401) {
            navigate("/login");
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
    logout();
  };

  return (
    <div className="debug w-screen h-screen relative z-50">
      {/* <div
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } transition duration-500 ease-in-out shadow w-screen h-screen bg-gray-900/50 absolute top-0 left-0 z-50`}
      ></div> */}

      <div
        className={`sideBar pt-5 px-4  h-10 md:h-full  absolute top-0 left-0   md:bg-gray-800 ${
          isSidebarOpen
            ? "w-full bg-red-500 md:w-60 h-full   transition-all duration-300 ease-out "
            : "md:w-20   transition-all duration-300 ease-out "
        }`}
      >
        <div className="burger text-white text-3xl debug">
          {isSidebarOpen ? (
            <CgClose
              onClick={handleToggleSidebar}
              className="text-white fill-white"
            />
          ) : (
            <RxHamburgerMenu onClick={handleToggleSidebar} />
          )}
        </div>
        <div
          className={`routes ${
            isSidebarOpen ? "md:bg-red-400 bg-yellow-500" : "md:block hidden "
          }`}
        >
          {Routes.map((route, index) => {
            return (
              <Link
                to={route.link}
                key={index}
                className={`${
                  isSidebarOpen
                    ? "flex justify-start items-center w-full h-16 px-4 rounded-md hover:bg-gray-700 cursor-pointer transition-all duration-300 ease-out"
                    : "flex justify-center items-center w-full h-16 px-4 rounded-md hover:bg-gray-700 cursor-pointer transition-all duration-300 ease-out"
                } ${index == menuIndex ? "bg-gray-600" : ""} `}
                onClick={() => {
                  setMenuIndex(index);
                  if (route.name == "logout") handleLogout();
                }}
              >
                <div className="icon">{route.icon}</div>
                {isSidebarOpen && <div className="text ml-4">{route.name}</div>}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SideBar;

// {/* <SideBarContainer
//         width={sidebarWidth}
//         isSidebarOpen={isSidebarOpen}
//         className="debug"
//       >
//         <LogoContainer className="iconContainer" isSidebarOpen={isSidebarOpen}>
//           <Link to="/home" className=" iconLogo">
//             <img src={Logo} alt="Logo" className="logo" />
//           </Link>
//           {/* <SideBarMenu
//             width={sidebarWidth === 240 ? 180 : 40}
//             onClick={() => {
//               handleMenuClick();
//               handleToggleSidebar();
//             }}
//           >
//             <div className={`menu ${activeMenu ? "activeMenu" : ""}`}>
//               <span
//                 className={isSidebarOpen ? "bar1 activeMenu" : "bar1"}
//               ></span>
//               <span
//                 className={isSidebarOpen ? "bar2 activeMenu" : "bar2"}
//               ></span>
//               <span
//                 className={isSidebarOpen ? "bar3 activeMenu" : "bar3"}
//               ></span>
//             </div>
//             <p className={`${sidebarWidth >= 200 ? "show" : "hide"}`}>
//               Task Manager
//             </p>
//           </SideBarMenu> */}
//         </LogoContainer>
//         <IconsContainer
//           className="iconContainer"
//           width={sidebarWidth}
//           isSidebarOpen={isSidebarOpen}
//         >
//           {/* <div className="menu" onClick={handleToggleSidebar}>
// 					<span className={isSidebarOpen ? "bar1 activeMenu" : "bar1"}></span>
// 					<span className={isSidebarOpen ? "bar2 activeMenu" : "bar2"}></span>
// 					<span className={isSidebarOpen ? "bar3 activeMenu" : "bar3"}></span>
// 				</div> */}
//           <Link
//             to="/home"
//             className={`icon ${sidebarWidth >= 200 ? "show" : "hide"} ${
//               location.pathname === "/home" ? "active" : ""
//             }`}
//             onClick={() => handleClick("home")}
//           >
//             <Home fill="none" />
//             <span>Home</span>
//           </Link>
//           <Link
//             to="/profile"
//             className={`icon ${sidebarWidth >= 200 ? "show" : "hide"} ${
//               location.pathname === "/profile" ? "active" : ""
//             }`}
//             onClick={() => handleClick("profile")}
//           >
//             <Profile />
//             <span>Profile</span>
//           </Link>
//           <Link
//             to="/game"
//             className={`icon ${sidebarWidth >= 200 ? "show" : "hide"} ${
//               location.pathname === "/game" ? "active" : ""
//             }`}
//             onClick={() => handleClick("game")}
//           >
//             <Game fill="white" />
//             <span>Game</span>
//           </Link>
//           <Link
//             to="/chat"
//             className={`icon ${sidebarWidth >= 200 ? "show" : "hide"} ${
//               location.pathname === "/chat" ? "active" : ""
//             }`}
//             onClick={() => handleClick("chat")}
//           >
//             <Chat />
//             <span>Chat</span>
//           </Link>
//           <Link
//             to="/settings"
//             className={`icon ${sidebarWidth >= 200 ? "show" : "hide"} ${
//               location.pathname === "/settings" ? "active" : ""
//             }`}
//             onClick={() => handleClick("settings")}
//           >
//             <Settings />
//             <span>Setting</span>
//           </Link>
//         </IconsContainer>
//         <LogoutContainer className="iconContainer" width={sidebarWidth}>
//           <Link
//             to="/"
//             className={`icon ${sidebarWidth >= 200 ? "show" : "hide"}`}
//             onClick={() => handleLogout()}
//           >
//             <Logout />
//             <span>Logout</span>
//           </Link>
//         </LogoutContainer> */}
//       </SideBarContainer>
