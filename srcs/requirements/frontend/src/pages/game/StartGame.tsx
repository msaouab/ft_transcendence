import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { HOSTNAME, getUserInfo } from "../../api/axios";
import { useGlobalContext } from "../../provider/AppContext";
import { useGameContext } from "../../provider/GameProvider";
import styled, { keyframes } from "styled-components";
import Lottie from "react-lottie";
import PongAnimation from "../../assets/Lottie/PongAnimation.json";
import { useNavigate } from "react-router-dom";

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
	const navigate = useNavigate();
	const { userId } = useGlobalContext();
	const { typeRoom, modeRoom, mysocket, setMySocket, friend } = useGameContext();
	const [benomeId, setBenomeId] = useState("");
	const [roomId, setRoomId] = useState("");
	const [width, setWidth] = useState(0);
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
		friend: friend,
		userId: Cookies.get('id'),
		// width: 700,
		// height: 1000,
	};

	useEffect(() => {
		const socket = io(`http://${HOSTNAME}:3000/game`, {
			query: {userId: Cookies.get('userid')},
		});
		setMySocket(socket);
		socket.on("connect", () => {
			console.log(socket.id, "connected to server");
			socket.emit("joinRoom", payload);
			console.log("payload", payload);
		});
		socket.on("disconnect", () => {
			console.log(socket.id, "disconnected from server");
			socket.emit("leaveRoom", payload);
		});
		return () => {
			// socket.disconnect();
		};
	}, []);

	useEffect(() => {

			let width = window.innerWidth;
			const height = window.innerHeight;
			if (width < 700)
				setWidth(700);
			else
				setWidth(width);
			console.log(width, height);
	}, []);

	useEffect(() => {
		let isReal = false;
		const getAllData = async () => {
			const userdata = await getUserInfo(userId);
			setUser(userdata);
			let Benome;
			//  = await getUserInfo(benomeId);
			// setBenome(Benome);
			if (payload.mode === "Bot") {
				Benome = {
					id: "Bot",
					login: "Moulinette_42",
					firstName: "Bot",
					lastName: "Bot",
					status: "Bot",
				};
			} else {
				Benome = await getUserInfo(benomeId);
			}
			if (Benome && roomId) {
				isReal = true;
				console.log("navigating", isReal)
				navigate(`/game/${roomId}`, {
					state: {
						user: user,
						benome: Benome,
						width: width,
					},
				});
			}
		};
		mysocket?.on("BenomeId", (benome, key) => {
			setBenomeId(benome);
			setRoomId(key);
			isReal = true;
		});
		getAllData();
		return () => {
			if (!isReal) {
				console.log("disconnecting", isReal)
				mysocket?.disconnect();
			}
		};
	}, [mysocket, benomeId]);

	return (
		<StartGameContainer>
			<AnimationContainer>
				<LoadingText>Loading...</LoadingText>
				<SpinnerContainer></SpinnerContainer>
				<Lottie options={defaultOptions} height={800} width={800} />
			</AnimationContainer>
		</StartGameContainer>
	);
};

export default StartGame;
