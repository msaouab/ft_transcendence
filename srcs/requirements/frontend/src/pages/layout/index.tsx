import { Outlet } from "react-router-dom";
import styled from "styled-components";
import SideBar from "../../components/common/SideBar";
import DropDownMenu from "../../components/DropDownMenu";
import Notifications from "../../components/Notifications";
import SearchBar from "../../components/common/Search/SearchBar";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
// import Cookies from "js-cookie";
import { useGlobalContext } from "../../provider/AppContext";
import { HOSTNAME } from "../../api/axios";
// import UserSettings from "../user/UserSettings";

const LayoutStyle = styled.div`
	display: flex;
	height: 100vh;
`;

const index = () => {
	const notifySocket = useRef<any>(null);
	const [connected, setConnected] = useState(false);

	useEffect(() => {
		if (!connected) {
			notifySocket.current = io(`http://${HOSTNAME}:3000`);
		}
		notifySocket.current.on("connect", () => {
			setConnected(true);
			// call a function inside the drop down menu to change the status
		});

		notifySocket.current.on("disconnect", () => {
			setConnected(false);
		});
	}, []);

	return (
		<LayoutStyle className=" px-1 md:px-5">
			<div className="md:w-[5rem] ">
				<SideBar notifySocket={notifySocket.current} connected={connected} />
			</div>
			<div className="main-content w-full ">
				<div
					className="header flex justify-end  gap-8 items-center  h-[10%]  max-h-[80px]
          
        "
				>
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
					<Outlet
						context={{
							notifySocket: notifySocket.current,
							connected: connected,
						}}
					/>
				</div>
			</div>
		</LayoutStyle>
	);
};

export default index;
