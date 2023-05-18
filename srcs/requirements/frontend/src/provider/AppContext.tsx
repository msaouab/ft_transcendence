import React, { createContext, useContext, useState, ReactNode } from "react";
import DefaultAvatar from "../assets/avatar.png";

interface AppContextType {
  userStatus: string;
  setUserStatus: React.Dispatch<React.SetStateAction<string>>;
  userImg: string ;
  setUserImg: React.Dispatch<React.SetStateAction<string>>;
  privateChatRooms: any[];
  setPrivateChatRooms: React.Dispatch<React.SetStateAction<any[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [userStatus, setUserStatus] = useState<string>("");
  const [userImg, setUserImg] = useState(DefaultAvatar);
  // chat context 
  const [privateChatRooms, setPrivateChatRooms] = useState([]);

  const value = {
    userStatus,
    setUserStatus,
    userImg,
    setUserImg,
    privateChatRooms,
    setPrivateChatRooms,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = (): AppContextType => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useGlobalContext must be used within an AppProvider");
  }

  return context;
};
