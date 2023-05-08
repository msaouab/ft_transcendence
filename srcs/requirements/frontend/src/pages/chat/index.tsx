import React from 'react'
import Styled from 'styled-components'
import ChatList from '../../components/chat/ChatList';
import ChatBox from '../../components/chat/ChatBox';
const ChatStyle = Styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  padding: 10px;
  justify-content: flex-start;
  background: #1E1D18;
  gap: 2px;
  & > *:nth-child(3) {
    margin-top: 20px;
    height: 95%;
}
`;

import Loader from '../../components/common/Loader';

import { PrivateMessage } from '../../types/message';
const Chat = () => {
  //  add default chatbox later 
  // passing a prop to ChatList, to get event when a user is clicked and pass it to ChatBox
  const [selectedChat, setSelectedChat] = React.useState<PrivateMessage>({} as PrivateMessage);
  // const [newMessage, setNewMessage] = React.useState<PrivateMessage>({} as PrivateMessage);
  return (

    <ChatStyle>
      <div className="side-bar w-1/7 h-full bg-gray-500">
        <h1>Side Bar</h1>
      </div>
      <ChatList setSelectedChat={setSelectedChat} />
      <div className="chat-box w-[63%] h-full">
        <ChatBox selectedChat={selectedChat} key={selectedChat.chatRoomid} size="rgba(217, 217, 217, 0.3)" />
      </div>
    </ChatStyle >
  )
}

export default Chat
