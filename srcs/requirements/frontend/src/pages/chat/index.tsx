import React from 'react'
import Styled from 'styled-components'
import ChatList from '../../components/chat/ChatList';
import ChatBox from '../../components/chat/ChatBox';

import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
const ChatStyle = Styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  padding: 10px;
  justify-content: flex-start;
  background: #1E1D18;
  gap: 2px;
  .chat-list {
    width: 30%;
    height: 100%;
  }

  .chat-box-wrapper {
    margin-top: 20px;
    height: 95%;
    width: 63%;
  }

  @media screen and (max-width: 724px) {
    // border: 1px solid red;
    .chat-box-wrapper {
      width: 100%;
      justify-content: center;

  }
  // starting from 724 to 1200 
  @media screen and (min-width: 724px) and (max-width:1200px) {
    .chat-box-wrapper {
      width: 55%;
    }
    
    .chat-list {
      width: 45%;
    }
  
}
`;



import { PrivateMessage } from '../../types/message';
import SideBar from '../../components/common/SideBar';
const Chat = () => {
  let chatSocket = useRef(null);
  const [connected, setConnected] = React.useState<boolean>(false);
  const [selectedChat, setSelectedChat] = React.useState<PrivateMessage>({} as PrivateMessage);
  const [newLatestMessage, setNewLatestMessage] = React.useState<string>('');


  useEffect(() => {
    // socket connection
    if (!connected) {
      chatSocket.current = io('http://localhost:3000/chat');
      setConnected(true);
      console.log('connected to the server')
    }
  }, []);


  return (
    <ChatStyle>
      <div className="side-bar w-[100px]">
        <SideBar />
      </div>
      <div className="chat-list">
        <ChatList setSelectedChat={setSelectedChat} newLatestMessage={newLatestMessage} />
      </div>
      <div className="chat-box-wrapper">
   
        <ChatBox selectedChat={selectedChat} key={selectedChat.chatRoomid} size="big" setNewLatestMessage={setNewLatestMessage}
          chatSocket={chatSocket} connected={connected}
        />

        {/* } */}
      </div>
    </ChatStyle >
  )
}

export default Chat
