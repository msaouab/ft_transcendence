import React from 'react'
import Styled from 'styled-components'
import ChatList from '../../components/chat/ChatList';
import ChatBox from '../../components/chat/ChatBox';

import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
const ChatStyle = Styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;

  justify-content: flex-start;  

  .chat-list {
    max-width: 500px;
    width: 40%;
    height: 100%;
  }

  .chat-box-wrapper {
    margin-top: 20px;
    max-width: 1000px;    
    height: 95%;
    width: 60%;
  }

  @media screen and (max-width: 766px) {
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding-right: 30px;
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
      height: 100%;
      margin-top: 0;
    }
  }
  @media screen and (max-width: 684px) {
    margin-right: -20px;
  }

  @media screen and (min-width: 1500px) {
    justify-content: center;
  }
  }
}
`;



import { PrivateMessage } from '../../types/message';
import { useGlobalContext } from '../../provider/AppContext';
const Chat = () => {
  let chatSocket = useRef(null);
  const [connected, setConnected] = React.useState<boolean>(false);
  const [selectedChat, setSelectedChat] = React.useState<PrivateMessage>({} as PrivateMessage);
  const [newLatestMessage, setNewLatestMessage] = React.useState<{ chatRoomId: string, message: string }>({} as { chatRoomId: string, message: string });
  const {privateChatRooms} = useGlobalContext(  );

  useEffect(() => {
    // socket connection
    if (!connected) {
      chatSocket.current = io('http://localhost:3000/chat');
      setConnected(true);
      console.log('connected to the server')
    }
    // chatSocket.current.on('connect', () => {
    // });
    return () => {
      chatSocket.current.disconnect();
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    if (selectedChat.chatRoomid) {
      console.log("joining the room");
      const payload = {
        senderId: selectedChat.sender_id,
        receiverId: selectedChat.receiver_id
      }
      chatSocket.current.emit('joinRoom', payload);
    } 
    return () => {
      if (selectedChat.chatRoomid) {
        console.log("leaving the room");
        const payload = {
          senderId: selectedChat.sender_id,
          receiverId: selectedChat.receiver_id
        }
        chatSocket.current.emit('leaveRoom', payload);
      }
    }
  }, [selectedChat]);

  useEffect(() => {
    let chatDeleted = true;
    if (privateChatRooms.length === 0) {
      setSelectedChat({} as PrivateMessage);
      return;
    }
    privateChatRooms.forEach((chat) => {
      if (chat.chatRoomid === selectedChat.chatRoomid) {
        chatDeleted = false ;
      }}
    )
    if (!chatDeleted) {
      setSelectedChat({} as PrivateMessage);
    }
  }, [privateChatRooms]);
  return (

    <ChatStyle>

      <div className="chat-list">
        <ChatList setSelectedChat={setSelectedChat} newLatestMessage={newLatestMessage} />
      </div>
      <div className="chat-box-wrapper">
        <ChatBox selectedChat={selectedChat} key={selectedChat.chatRoomid} size="big" setNewLatestMessage={setNewLatestMessage}
          chatSocket={chatSocket} connected={connected}

        />
      </div>
    </ChatStyle >
  )
}

export default Chat
