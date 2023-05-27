import PingPong from "./Canvas";
import styled from "styled-components";
import { useAppContext } from "../../provider/GameProvider";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { getUserInfo } from "../../api/axios";
import { useGlobalContext } from "../../provider/AppContext";
import GameProfile from "./GameProfile";

const CanvasContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 1rem;
	border: 1px solid red;
`;

const PlayerContainer = styled.div<{ isFirst?: boolean; height: number }>`
	display: flex;
	align-self: ${({ isFirst }) => (isFirst ? "flex-end" : "flex-start")};
	height: ${({ height }) => height / 2}px;
`;

const Game = () => {
	const { userId } = useGlobalContext();
	const { setTypeRoom, typeRoom, setModeRoom, modeRoom } = useAppContext();
	const [mysocket, setMySocket] = useState<Socket>();
	const [data, setData] = useState({
		id: "",
		login: "",
		firstName: "",
		lastName: "",
		status: "",
	});

	const payload = {
		type: typeRoom,
		mode: modeRoom,
		width: 700,
		height: 1000,
	};

	useEffect(() => {
		const socket = io("http://localhost:3000/game", {
			query: { userId: Cookies.get("id") },
		});
		setMySocket(socket);
		socket.on("connect", () => {
			console.log(socket.id, "connected to server");
			socket.emit("joinRoom", payload);
		});
		socket.on("disconnect", () => {
			socket.emit("leaveRoom", payload);
		});
		socket.on("joinedRoom", (payload) => {
		});

		getAllData();
		return () => {
			socket.disconnect();
		};
	}, [userId]);

	const getAllData = async () => {
		const data = await getUserInfo(userId);
		console.log("data:", data);
		setData(data);
		// const BenomeData = await getBenomeInfo();
		// setBenomeData(BenomeData);
	};

	useEffect(() => {
		const RoomType = localStorage.getItem("typeRoom");
		const RoomMode = localStorage.getItem("modeRoom");
		if (RoomType) setTypeRoom(RoomType);
		if (RoomMode) setModeRoom(RoomMode);
	}, [typeRoom, mysocket]);

	return (
		<CanvasContainer>
			<PlayerContainer isFirst height={payload.height}>
				{data ? <GameProfile data={data} isFirst={true} /> : <p>Loading...</p>}
			</PlayerContainer>
			{mysocket ? (
				<PingPong
					width={payload.width}
					height={payload.height}
					socket={mysocket}
				/>
			) : (
				<p>Loading...</p>
			)}
			<PlayerContainer height={payload.height}>
				{data ? <GameProfile data={data} isFirst={false} /> : <p>Loading...</p>}
			</PlayerContainer>
		</CanvasContainer>
	);
};

export default Game;
