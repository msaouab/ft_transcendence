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
  const [newLatestMessage, setNewLatestMessage] = React.useState<{ chatRoomId: string, message: string }>({} as { chatRoomId: string, message: string });


  useEffect(() => {
    // socket connection
    if (!connected) {
      chatSocket.current = io('http://localhost:3000/chat');
      setConnected(true);
      console.log('connected to the server')
    }

    chatSocket.current.on('connect', () => {
      /* console.log("socket id: ", chatSocket.current.id); */
      // if there's a selected chat, join the room
    });
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
    } else {
      console.log("no selected chat");
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


  //   useEffect(() => {
  //     if (connected) {
  //         console.log("im registering to the newPrivateMessage event");
  //         chatSocket.current.on('newPrivateMessage', (message: any) => {

  //             console.log("a new message detected from the server: ", message);
  //             setState((prevState: any) => ({
  //                 ...prevState,
  //                 messages: [message, ...prevState.messages]
  //             }));
  //         })
  //     }
  //     // else {
  //     //     console.log("not connected to the server");
  //     // }
  //     return () => {
  //         chatSocket.current.off('newPrivateMessage');
  //     }
  // }, [connected]);



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
