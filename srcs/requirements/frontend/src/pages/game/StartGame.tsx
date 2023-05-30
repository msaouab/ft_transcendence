import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { getUserInfo } from "../../api/axios";
import { useGlobalContext } from "../../provider/AppContext";
import { useAppContext } from "../../provider/GameProvider";
import styled, { keyframes } from "styled-components";
import Game from "../../components/Game/Game";

const StartGameContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
`;

const LoadingText = styled.p`
	position: absolute;
	font-weight: bold;
	color: #3498db;
`;

const spinAnimation = keyframes`
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
`;

const SpinnerContainer = styled.div`
	border: 3px solid #af5151;
	border-top: 3px solid #b9c2c9;
	border-bottom: 3px solid #b9c2c9;
	border-radius: 50%;
	width: 200px;
	height: 200px;
	animation: ${spinAnimation} 0.5s linear infinite;
	
`;

const StartGame = () => {
	const [mysocket, setMySocket] = useState<Socket>();
	const { userId } = useGlobalContext();
	const { typeRoom, modeRoom } = useAppContext();
	const [benomeId, setBenomeId] = useState("");
	const [benomeData, setBenomeData] = useState({
		id: "",
		login: "",
		firstName: "",
		lastName: "",
		status: "",
	});
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
		socket.on("BenomeId", (benome) => {
			setBenomeId(benome);
			console.log("benomeId:", benome);
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
		const BenomeData = await getUserInfo(benomeId);
		setBenomeData(BenomeData);
	};

	return (
		<StartGameContainer>
			{benomeId && mysocket ? (<Game socket={mysocket} benome={benomeData}/>) : (
				<><LoadingText>Loading...</LoadingText><SpinnerContainer></SpinnerContainer></>
				)}
		</StartGameContainer>
	);
};

export default StartGame;
