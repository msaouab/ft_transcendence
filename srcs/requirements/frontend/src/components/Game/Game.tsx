import PingPong from "./Canvas";
import styled from "styled-components";
import { useAppContext } from "../../provider/GameProvider";
import { SetStateAction, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { getUserInfo } from "../../api/axios";
import { useGlobalContext } from "../../provider/AppContext";
import GameProfile from "./GameProfile";

interface GameProps {
	socket: Socket;
	user: {
		id: string;
		login: string;
		firstName: string;
		lastName: string;
		status: string;
	};
	benome: {
		id: string;
		login: string;
		firstName: string;
		lastName: string;
		status: string;
	}
}

const CanvasContainer = styled.div<{isFirst: Boolean}>`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 1rem;
	border: 1px solid green;
	/* height: auto; */
	@media (max-width: 1200px) {
		gap: 0;
		flex-direction: ${({ isFirst }) => (isFirst ? "column-reverse" : "column")};;
		/* flex-direction: column; */
	}
`;

const PlayerContainer = styled.div<{
	isFirst?: boolean;
	height: number;
	width: number;
}>`
	display: flex;
	align-self: ${({ isFirst }) => (isFirst ? "flex-end" : "flex-start")};
	height: ${({ height }) => height / 2 + 10}px;
	@media (max-width: 1200px) {
		/* border: 1px solid red; */
		height: auto;
		align-self: ${({ isFirst }) => (isFirst ? "flex-end" : "flex-start")};
		/* width: ${({ width }) => width}px; */
		width: 100%;
	}
`;

const Game = ({socket, user, benome}: GameProps) => {
	const { setTypeRoom, typeRoom, setModeRoom, modeRoom } = useAppContext();
	const [score, setScore] = useState({ player1: 0, player2: 0 });
	
	const payload = {
		type: typeRoom,
		mode: modeRoom,
		width: 700,
		height: 1000,
	};

	useEffect(() => {
		socket.on("responseScore", (score: SetStateAction<{ player1: number; player2: number; }>) => {
			setScore(score);
			console.log("score:", score)
		});
		return () => {
			socket.off("responseScore");
		}
	}, [socket]);

	useEffect(() => {
		const RoomType = localStorage.getItem("typeRoom");
		const RoomMode = localStorage.getItem("modeRoom");
		if (RoomType) setTypeRoom(RoomType);
		if (RoomMode) setModeRoom(RoomMode);
	}, [typeRoom, socket]);

	return (
		<CanvasContainer isFirst>
			<PlayerContainer isFirst height={payload.height} width={payload.width}>
				{user ? (
					<GameProfile user={user} isFirst={true} score={score.player1} />
				) : (
					<p>Loading...</p>
				)}
			</PlayerContainer>
			{socket ? (
				<PingPong
					width={payload.width}
					height={payload.height}
					socket={socket}
				/>
			) : (
				<p>Loading...</p>
			)}
			<PlayerContainer height={payload.height} width={payload.width}>
				{benome ? (
					<GameProfile user={benome} isFirst={false} score={score.player2} />
				) : (
					<p>Loading...</p>
				)}
			</PlayerContainer>
		</CanvasContainer>
	);
};

export default Game;
