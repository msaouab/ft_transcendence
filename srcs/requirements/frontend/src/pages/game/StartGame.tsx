import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { HOSTNAME, getUserInfo } from "../../api/axios";
import { useGlobalContext } from "../../provider/AppContext";
import { useAppContext } from "../../provider/GameProvider";
import styled, { keyframes } from "styled-components";
import Game from "../../components/Game/Game";
import Lottie from "react-lottie";
import PongAnimation from "../../assets/Lottie/PongAnimation.json";

const StartGameContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
`;

const LoadingText = styled.p`
	position: absolute;
	font-weight: bold;
	color: #99c4e1;
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
	position: absolute;
	border: 3px solid #af5151;
	border-top: 3px solid #b9c2c9;
	border-bottom: 3px solid #b9c2c9;
	border-radius: 50%;
	width: 250px;
	height: 250px;
	animation: ${spinAnimation} 0.5s linear infinite;
`;

const AnimationContainer = styled.div`
	/* border: 1px dashed #7c6d6d; */
	display: flex;
	justify-content: center;
	align-items: center;
	width: 460px;
	height: 550px;
`;

const defaultOptions = {
	loop: true,
	autoplay: true,
	animationData: PongAnimation,
	rendererSettings: {
		preserveAspectRatio: "xMidYMid slice",
	},
};

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
	const [user, setUser] = useState({
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
		const socket = io(`http://${HOSTNAME}:3000/game`, {
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
		});
		getAllData();
		return () => {
			socket.disconnect();
		};
	}, [userId, benomeId]);

	const getAllData = async () => {
		const user = await getUserInfo(userId);
		setUser(user);
		const Benome = await getUserInfo(benomeId);
		setBenomeData(Benome);
		if (payload.mode === "Bot") {
			setBenomeData({
				id: "Bot",
				login: "Moulinette_42",
				firstName: "Bot",
				lastName: "Bot",
				status: "Bot",
			});
		}
	};

	return (
		<StartGameContainer>
			{benomeId && mysocket ? (
				<Game socket={mysocket} user={user} benome={benomeData} />
			) : (
				<AnimationContainer>
					<LoadingText>Loading...</LoadingText>
					<SpinnerContainer></SpinnerContainer>
					<Lottie options={defaultOptions} height={800} width={800} />
				</AnimationContainer>
			)}
		</StartGameContainer>
	);
};

export default StartGame;
