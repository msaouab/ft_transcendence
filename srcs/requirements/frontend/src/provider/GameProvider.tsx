import React, { ReactNode, createContext, useContext, useState } from "react";
import { Socket } from "socket.io-client";

export type GameContextValue = {
	typeRoom: string;
	setTypeRoom: (typeRoom: string) => void;
	modeRoom: string;
	setModeRoom: (modeRoom: string) => void;
	friend: string;
	setFriend: (friend: string) => void;
	mysocket: Socket | undefined;
	setMySocket: (mysocket: Socket | undefined) => void;
	// benomeId: string;
	// setBenomeId: (benomeId: string) => void;
	// roomId: string;
	// setRoomId: (roomId: string) => void;
	// benome: {
	// 	id: string;
	// 	login: string;
	// 	firstName: string;
	// 	lastName: string;
	// 	status: string;
	// };
	// setBenome: (benome: {
	// 	id: string;
	// 	login: string;
	// 	firstName: string;
	// 	lastName: string;
	// 	status: string;
	// }) => void;
	// user: {
	// 	id: string;
	// 	login: string;
	// 	firstName: string;
	// 	lastName: string;
	// 	status: string;
	// };
	// setUser: (user: {}) => void;
};

const GameContext = React.createContext<GameContextValue>({
	typeRoom: "",
	setTypeRoom: () => {},
	modeRoom: "",
	setModeRoom: () => {},
	friend: "",
	setFriend: () => {},
	mysocket: {} as Socket,
	setMySocket: () => {},
	// benomeId: "",
	// setBenomeId: () => {},
	// roomId: "",
	// setRoomId: () => {},
	// benome: {} as {
	// 	id: string;
	// 	login: string;
	// 	firstName: string;
	// 	lastName: string;
	// 	status: string;
	// },
	// setBenome: () => {},
	// user: {} as {
	// 	id: string;
	// 	login: string;
	// 	firstName: string;
	// 	lastName: string;
	// 	status: string;
	// },
	// setUser: () => {},
});

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
	const [typeRoom, setTypeRoom] = React.useState<string>("");
	const [modeRoom, setModeRoom] = React.useState<string>("");
	const [friend, setFriend] = React.useState<string>("");
	const [mysocket, setMySocket] = useState<Socket | undefined>(undefined);
	// const [benomeId, setBenomeId] = useState("");
	// const [roomId, setRoomId] = useState("");

	const contextValue = {
		typeRoom,
		setTypeRoom,
		modeRoom,
		setModeRoom,
		friend,
		setFriend,
		mysocket,
		setMySocket,
		// benomeId,
		// setBenomeId,
		// roomId,
		// setRoomId,
		// benome: {} as {
		// 	id: string;
		// 	login: string;
		// 	firstName: string;
		// 	lastName: string;
		// 	status: string;
		// },
		// setBenome: () => {},
		// user: {} as {
		// 	id: string;
		// 	login: string;
		// 	firstName: string;
		// 	lastName: string;
		// 	status: string;
		// },
		// setUser: () => {},
	};

	return (
		<GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
	);
};
