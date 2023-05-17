

import { Link } from "react-router-dom";
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
        link: "",
    },
];



const SideBar2 = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { setUserStatus } = useGlobalContext();
    const [menuIndex, setMenuIndex] = useState<number>(0);

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
                        if (error.response.status == 401 || error.response.status == 403) {
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
        <div className=" border-r-2 border-red-200
         flex flex-col h-screen w-16 md:w-64 text-gray-700 bg-white dark-mode:text-gray-200 dark-mode:bg-gray-800 flex-shrink-0"
        >
            <div className="flex-shrink-0 px-8 py-4 flex flex-row items-center justify-between">
                <Link to="/home">
                    <img src={Logo} alt="logo" className="w-10 h-10" />
                </Link>
                <button
                    className="rounded-lg md:hidden rounded-lg focus:outline-none focus:shadow-outline"
                    onClick={handleToggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    <RxHamburgerMenu className="w-6 h-6" />
                </button>




            </div>
            <nav className="flex-grow md:block px-4 pb-4 md:pb-0 md:overflow-y-auto">
                <ul>
                    {Routes.map((route, index) => {
                        return (
                            <li key={index}>
                                <Link

                                    to={route.link}
                                    className={`flex flex-row items-center h-16 px-4 rounded-lg mb-2
                                    ${menuIndex === index ? "bg-red-200" : ""}`}
                                    onClick={() => {
                                        setMenuIndex(index);
                                    }}
                                >
                                    <span className="flex items-center justify-center text-lg text-gray-400">
                                        {route.icon}
                                    </span>
                                    <span className="ml-2 text-sm font-semibold">
                                        {route.name}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className="flex-shrink-0 px-8 py-4 flex flex-row items-center justify-between">
                <button
                    className="rounded-lg md:hidden rounded-lg focus:outline-none focus:shadow-outline"
                    onClick={handleLogout}
                    aria-label="Toggle sidebar"
                >
                    <Logout className="w-6 h-6" />
                </button>
            </div>
        </div>


    )

}

export default SideBar2;

