import React, { useContext } from "react";

export type AppContextValue = {
	typeRoom: string;
	setTypeRoom: (typeRoom: string) => void;
	modeRoom: string;
	setModeRoom: (modeRoom: string) => void;
	friend: string;
	setFriend: (friend: string) => void;
};

const AppContext = React.createContext<AppContextValue>({
	typeRoom: "",
	setTypeRoom: () => {},
	modeRoom: "",
	setModeRoom: () => {},
	friend: "",
	setFriend: () => {},
});

export const useAppContext = () => useContext(AppContext);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
	const [typeRoom, setTypeRoom] = React.useState<string>("");
	const [modeRoom, setModeRoom] = React.useState<string>("");
	const [friend, setFriend] = React.useState<string>("");

	const contextValue = { typeRoom, setTypeRoom, modeRoom, setModeRoom, friend, setFriend, };

	return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};