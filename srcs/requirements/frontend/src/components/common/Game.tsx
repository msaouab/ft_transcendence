// import { useState, useRef } from 'react'
import PingPong from "./Canvas";
import styled from "styled-components";
import { useAppContext } from "../../provider/GameProvider";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

const CanvasContainer = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
	border: 1px solid red;
`;

//	joinRoom: (payload: { id: string; type: string; mode: string }) => void;
//  leaveRoom: (payload: { id: string; type: string; mode: string }) => void;
//	ball
// 	player

const Game = () => {
	const { setTypeRoom, typeRoom, setModeRoom, modeRoom } = useAppContext();
	const [mysocket, setMySocket] = useState<Socket>();

	console.log("typeRoom1", typeRoom, "modeRoom1", modeRoom)
	const payload = {
		type: typeRoom,
		mode: modeRoom,
	};

	useEffect(() => {
		const socket = io("http://localhost:3000/game", {query: {userId: Cookies.get('id')}});
		setMySocket(socket);
		socket.on("connect", () => {
			console.log(socket.id, "connected to server");
			socket.emit("joinRoom", payload);
		});
		socket.on("disconnect", () => {
			console.log(socket.id, "disconnected from server");
			socket.emit("leaveRoom", payload);
		});
		socket.on("joinedRoom", (payload) => {
			console.log("joinedRoom: ", payload);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		const RoomType = localStorage.getItem("typeRoom");
		const RoomMode = localStorage.getItem("modeRoom");
		if (RoomType) setTypeRoom(RoomType);
		if (RoomMode) setModeRoom(RoomMode);

		console.log("typeRoom", typeRoom, "modeRoom", modeRoom);
	}, [typeRoom, mysocket]);
	console.log("socket", mysocket);

	return (
		<CanvasContainer>
			{mysocket ? (
				<PingPong width={700} height={1000} socket={mysocket} />
			) : (
				<p>Loading...</p>
			)}
		</CanvasContainer>
	);
};

export default Game;
