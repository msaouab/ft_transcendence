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
import instance, { GetAvatar } from "../../api/axios";
import { useGlobalContext } from "../../provider/AppContext";
import { RxHamburgerMenu } from "react-icons/rx";
import { CgClose } from "react-icons/cg";
import { parse } from "path";
import { getAvatarUrl } from "./CommonFunc";

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

const SideBar = ({
	notifySocket,
	connected,
}: {
	notifySocket: any;
	connected: boolean;
}) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const { setUserStatus, setUserImg, setUserId, userId } = useGlobalContext();
	const [menuIndex, setMenuIndex] = useState<number>(2);
	// const

	useEffect(() => {
		// sending the real status to the server
		if (connected) {
			if (notifySocket) {
				notifySocket.emit("realStatus", {
					id: Cookies.get("id"),
					userStatus: true,
				});
			}
		}
	}, [connected]);

	const { setChatNotif, chatNotif } = useGlobalContext();
	// const [chatNotif, setChatNotif] = useState(parseInt(Cookies.get("chatNotif") || "0"));
	useEffect(() => {
		if (connected) {
			notifySocket.on("chatNotif", (data: any) => {
				console.log("a chat notif arrived");
				if (window.location.pathname != "/chat") {
					const prevNotif = chatNotif;
					const num = parseInt(data.num) + prevNotif;
					setChatNotif(num);
					Cookies.set("chatNotif", String(num));
				}
			});
		}
	}, [chatNotif]);
	const handleToggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};
	const navigate = useNavigate();

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
					setUserId(response.data.id);
					setUserStatus(response.data.status.tolowoerCase());
				})
				.catch((error) => {
					if (error.response.status == 401 || error.response.status == 403) {
						navigate("/login");
					}
				});
		} catch (error) {
			console.log(error);
		}
		// console.log("ppppppp", userId);
		// const res = await GetAvatar(userId);
		const res = getAvatarUrl();
		setUserImg(res);
	}

	useEffect(() => {
		fetchData();
	}, [userId]);

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
		<div className=" ">
			<div
				className={`${
					isSidebarOpen ? "block" : "hidden"
				} transition duration-500 ease-in-out shadow w-screen h-[] backdrop-blur-sm bg-black/50 absolute top-0 left-0 z-40`}
			></div>

			<div
				className={`sideBar   z-40 pt-5 px-4  h-10 md:h-full  absolute top-0 left-0   md:bg-[#434242] md:shadow-md md:shadow-white/30 ${
					isSidebarOpen
						? "w-full bg-[#434242]  md:w-60 h-full   transition-all duration-300 ease-out "
						: "md:w-20   transition-all duration-300 ease-out "
				}`}
			>
				<div className="burger cursor-pointer text-white text-3xl  mb-10 flex justify-center ">
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
					className={`routes mt- flex flex-col gap-5  relative ${
						isSidebarOpen ? "" : "md:flex flex-col gap-5 hidden "
					} `}
				>
					{Routes.map((route, index) => {
						return (
							<Link
								to={route.link}
								key={index}
								className={`${
									isSidebarOpen
										? "flex justify-start items-center w-full h-12 px-4 rounded-md hover:bg-gray-700 cursor-pointer transition-all duration-300 ease-out"
										: "flex justify-center items-center w-full h-12 px-4 rounded-md hover:bg-gray-700 cursor-pointer transition-all duration-300 ease-out"
								} ${index == menuIndex ? "bg-gray-600" : ""} `}
								onClick={() => {
									setMenuIndex(index);
									setIsSidebarOpen(false);
									if (route.name == "logout") handleLogout();
								}}
							>
								<div className="icon">{route.icon}</div>
								{/* a notif small red cirle with num inside */}
								{route.name == "chat" && chatNotif > 0 && (
									<div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex justify-center items-center">
										{chatNotif}
									</div>
								)}

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
