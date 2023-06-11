import React from "react";
import Styled from "styled-components";
import ChatList from "../../components/chat/ChatList";
import ChatBox from "../../components/chat/ChatBox";

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
const ChatStyle = Styled.div`
  display: flex;
  flex-direction: row;
  height: 95vh;
  width: 100%;
  max-height: 90vh;
  justify-content: flex-start;   
  
  .chat-list {
    /* max-width: 500px; */
    width: 40%;
    max-width: 500px;
    height: 100%;
  }
  
  .chat-box-wrapper {
    margin-top: 20px;
    max-width: 1000px;    
    height: 100%;
    // min-height: 80%;
    width: 60%;
  }
  
  @media screen and (max-width: 766px) {
    min-height: 100%;
    flex-direction: column;
    align-items: center;
    padding-inline: 15px;
    padding-bottom: 10px;
    @media screen and (min-width: 720px) and (max-width: 770px) {
      padding-left: 30px;
    } 
    .chat-list {
      
      width: 100%;
      height: auto;
      max-height: 40%;
      margin: 0 auto;
    }
    
    .chat-box-wrapper {
      width: 100%;
      height: auto;
      min-height: 30vh;
      margin-top: 0;
    }
  }
  @media screen and (max-width: 684px) {
    /* background-color: #f5f5f5; */
    /* margin-right: -20px; */
  }

  @media screen and (min-width: 1500px) {
    justify-content: center;
  }

`;

import { GroupMessage, PrivateMessage } from "../../types/message";
import { useGlobalContext } from "../../provider/AppContext";
const Chat = () => {
  let chatSocket = useRef(null);
  const [connected, setConnected] = React.useState<boolean>(false);
  const [selectedChat, setSelectedChat] = React.useState<PrivateMessage>(
    {} as PrivateMessage
  );
  const [selectedGroupChat, setSelectedGroupChat] = React.useState <GroupMessage>( {} as GroupMessage );
  const [newLatestMessage, setNewLatestMessage] = React.useState<{
    chatRoomId: string;
    message: string;
  }>({} as { chatRoomId: string; message: string });
  const { privateChatRooms } = useGlobalContext();

  useEffect(() => {
    // socket connection
    if (!connected) {
      chatSocket.current = io(`http://localhost:3000/chat`);
      setConnected(true);
      console.log("connected to the server");
    }
    // chatSocket.current.on('connect', () => {
    // });
    return () => {
      chatSocket.current.disconnect();
      setConnected(false);
    };
  }, []);

  useEffect(() => {
    if (selectedChat.chatRoomid) {
      console.log("joining the room");
      const payload = {
        senderId: selectedChat.sender_id,
        receiverId: selectedChat.receiver_id,
      };
      chatSocket.current.emit("joinRoom", payload);
    }
    return () => {
      if (selectedChat.chatRoomid) {
        console.log("leaving the room");
        const payload = {
          senderId: selectedChat.sender_id,
          receiverId: selectedChat.receiver_id,
        };
        chatSocket.current.emit("leaveRoom", payload);
      }
    };
  }, [selectedChat.chatRoomid]);

  useEffect(() => {
    if (selectedGroupChat.group_id) {
      console.log("joining the room: ", selectedGroupChat.group_id);
      chatSocket.current.emit("joinGroupRoom", { group_id: selectedGroupChat.group_id });
    }
    return () => {
      if (selectedGroupChat.group_id) {
        console.log("leaving the room: ", selectedGroupChat.group_id);
        chatSocket.current.emit("leaveGroupRoom", { group_id: selectedGroupChat.group_id });
      }
    };
  }, [selectedGroupChat.group_id]);

  useEffect(() => {
    if (!selectedChat.chatRoomid) {
      console.log("no chat room selected from global context");
      return;
    }
    for (let i = 0; i < privateChatRooms.length; i++) {
      if (privateChatRooms[i].chatRoomid === selectedChat.chatRoomid) {
        return;
      }
    }

    // if there are available chat rooms, select the closest one by date
    if (privateChatRooms.length > 0) {
      let closestChatRoom = privateChatRooms[0];
      let closestDate = new Date(closestChatRoom.latest_message_date);
      for (let i = 1; i < privateChatRooms.length; i++) {
        let date = new Date(privateChatRooms[i].latest_message_date);
        if (date > closestDate) {
          closestChatRoom = privateChatRooms[i];
          closestDate = date;
        }
      }
      console.log("selecting the closest chat room");
      setSelectedChat(closestChatRoom);
      return;
    } else {
      setSelectedChat({} as PrivateMessage);
    }
  }, [privateChatRooms.length]);
  return (
    <ChatStyle>
      <div className="chat-list">
        <ChatList
          setSelectedChat={setSelectedChat}
          newLatestMessage={newLatestMessage}
          setSelectedGroupChat={setSelectedGroupChat}
          socket={chatSocket}
          connected={connected}
        />
      </div>
      <div className="chat-box-wrapper">
        <ChatBox
          selectedChat={selectedChat}
          key={selectedChat.chatRoomid}
          size="big"
          setNewLatestMessage={setNewLatestMessage}
          chatSocket={chatSocket}
          connected={connected}
        />
      </div>
    </ChatStyle>
  );
};

export default Chat;
