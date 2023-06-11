import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import DefaultAvatar from "../assets/avatar.png";

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [userStatus, setUserStatus] = useState<string>("");
  const [userImg, setUserImg] = useState("");
  const [userId, setUserId] = useState<string>("");
  // chat context 
  const [privateChatRooms, setPrivateChatRooms] = useState([]);
  const [groupChatRooms, setGroupChatRooms] = useState([]);


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
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useGlobalContext = (): AppContextType => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useGlobalContext must be used within an AppProvider");
  }

  return context;
};
