import React, { createContext, useContext, useState, ReactNode } from "react";
import DefaultAvatar from "../assets/avatar.png";

import { useRef } from "react";
import Cookies from "js-cookie";

interface AppContextType {
  userStatus: string;
  setUserStatus: React.Dispatch<React.SetStateAction<string>>;
  userImg: string;
  setUserImg: React.Dispatch<React.SetStateAction<string>>;
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  privateChatRooms: any[];
  setPrivateChatRooms: React.Dispatch<React.SetStateAction<any[]>>;
  groupChatRooms: any[];
  setGroupChatRooms: React.Dispatch<React.SetStateAction<any[]>>;
  isTfaEnabled: boolean;
  setIsTfaEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  chatNotif: number;
  setChatNotif: React.Dispatch<React.SetStateAction<number>>;
  gameNotif: number;
  setGameNotif: React.Dispatch<React.SetStateAction<number>>;
  friendChellenge: any;
  setFriendChellenge: React.Dispatch<React.SetStateAction<any[]>>;

  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  userLoggedId: string;
  setUserLoggedId: React.Dispatch<React.SetStateAction<string>>;

}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
	children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // chat context 
  
  // chat context
	const [userStatus, setUserStatus] = useState<string>("");
	const [userImg, setUserImg] = useState("");
	const [userId, setUserId] = useState<string>("");
  
	const [isTfaEnabled, setIsTfaEnabled] = useState<boolean>(false);
	// chat context
	const [privateChatRooms, setPrivateChatRooms] = useState([] as any[]);
  const [groupChatRooms, setGroupChatRooms] = useState([]);

  const [chatNotif, setChatNotif] = useState(Cookies.get("chatNotif") ? parseInt(Cookies.get("chatNotif")!) : 0);
  const [gameNotif, setGameNotif] = useState(Cookies.get("gameNotif") ? parseInt(Cookies.get("gameNotif")!) : 0);

  const [friendChellenge, setFriendChellenge] = useState([] as any[]);
	// notification context
	const [notifications, setNotifications] = useState([] as any[]);

  const [loading, setLoading] = useState(false);
  const [userLoggedId, setUserLoggedId] = useState("");

  const value = {
    userStatus,
    setUserStatus,
    userImg,
    setUserImg,
    userId,
    setUserId,
    privateChatRooms,
    setPrivateChatRooms,
    groupChatRooms,
    setGroupChatRooms,
    isTfaEnabled,
    setIsTfaEnabled,
    notifications,
    setNotifications,
    chatNotif,
    setChatNotif,
    gameNotif,
    setGameNotif,
    friendChellenge,
    setFriendChellenge,

    loading,
    setLoading,
    userLoggedId,
    setUserLoggedId,

  };

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useGlobalContext = (): AppContextType => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useGlobalContext must be used within an AppProvider");
	}
	return context;
};
