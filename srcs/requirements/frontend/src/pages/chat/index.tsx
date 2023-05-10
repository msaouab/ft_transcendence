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

  border: 1px solid #fff;

    .chat-box {
    margin-top: 20px;
    height: 95%;
}


  @media (max-width: 768px) {
    height: 100vh;
  }
  

`;

// import Loader from '../../components/common/Loader';


import { PrivateMessage } from '../../types/message';
const Chat = () => {
  //  add default chatbox later 
  // passing a prop to ChatList, to get event when a user is clicked and pass it to ChatBox
  const [selectedChat, setSelectedChat] = React.useState<PrivateMessage>({} as PrivateMessage);
  // const [updatList, setUpdatList] = React.useState<string>('');
  const [newLatestMessage, setNewLatestMessage] = React.useState<string>('');


  return (
    <ChatStyle>
      <div className="side-bar w-1/7 h-full bg-gray-500">
        <h1>Side Bar</h1>
      </div>
      <div className="chat-list w-[30%] h-full
  
        ">
        <ChatList setSelectedChat={setSelectedChat} newLatestMessage={newLatestMessage} />
      </div>
      <div className="chat-box w-[63%] h-full">
        <ChatBox selectedChat={selectedChat} key={selectedChat.chatRoomid} size="rgba(217, 217, 217, 0.3)" setNewLatestMessage={setNewLatestMessage} />
      </div>
    </ChatStyle >
  )
}



export default Chat
