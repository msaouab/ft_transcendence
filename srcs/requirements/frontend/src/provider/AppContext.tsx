import React, { createContext, useContext, useState, ReactNode } from "react";
import DefaultAvatar from "../assets/avatar.png";
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
  isTfaEnabled: boolean;
  setIsTfaEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  chatNotif: number;
  setChatNotif: React.Dispatch<React.SetStateAction<number>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [userStatus, setUserStatus] = useState<string>("");
  const [userImg, setUserImg] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [isTfaEnabled, setIsTfaEnabled] = useState<boolean>(false);
  // chat context
  const [privateChatRooms, setPrivateChatRooms] = useState([] as any[]);

  // notification context
  const [notifications, setNotifications] = useState([] as any[]);

  const [chatNotif, setChatNotif] = useState(Cookies.get("chatNotif") ? parseInt(Cookies.get("chatNotif")!) : 0);

  //  user auth context

  const value = {
    userStatus,
    setUserStatus,
    userImg,
    setUserImg,
    userId,
    setUserId,
    privateChatRooms,
    setPrivateChatRooms,
    isTfaEnabled,
    setIsTfaEnabled,
    notifications,
    setNotifications,
    chatNotif,
    setChatNotif,
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
