import { Outlet } from "react-router-dom";
import styled from "styled-components";
import SideBar from "../../components/common/SideBar";
import DropDownMenu from "../../components/DropDownMenu";
import Notifications from "../../components/Notifications";
import SearchBar from "../../components/common/Search/SearchBar";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const index = () => {
	const LayoutStyle = styled.div`
		display: flex;
		height: 100vh;
	`;

	const notifySocket = useRef<any>(null);
	const [connected, setConnected] = useState(false);

	useEffect(() => {
		// console.log("IM HERE");
		// console.log("connected: ", notifySocket);
		if (!connected) {
			notifySocket.current = io("http://localhost:3000");
		}
		notifySocket.current.on("connect", () => {
			setConnected(true);
			// call a function inside the drop down menu to change the status
		});

		notifySocket.current.on("disconnect", () => {
			setConnected(false);
			// call a function inside the drop down menu to change the status
		});
	}, [connected]);

	return (
		<LayoutStyle className=" px-1 md:px-5">
			<div className="md:w-[5rem] ">
				<SideBar notifySocket={notifySocket.current} connected={connected} />
			</div>
			<div className="main-content w-full ">
				<div className="header flex justify-end  gap-8 items-center  h-[10%]  max-h-[80px]">
					<div className="search">
						<SearchBar />
					</div>
					<Notifications notifSocket={notifySocket} conected={connected} />
					<div className="user flex justify-center items-center  relative">
						<DropDownMenu
							notifySocket={notifySocket.current}
							connected={connected}
						/>
					</div>
				</div>
				<div className="content  flex-1">
					<Outlet />
				</div>
			</div>
		</LayoutStyle>
	);
};

export default index;
