
import { useState } from 'react';
import styled from 'styled-components';
import CreateChannel from './CreateChannel/CreateChannel';


const GroupChatListStyle = styled.div`
    width: 100%;
    height: 100%;
    background: rgba(217, 217, 217, 0.3);
    border-radius: 25px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Button = styled.button`
    cursor: pointer;
    color: #fff;
    background: rgb(233, 217, 144);
    border: transparent;
    border-radius: 0.25rem;
    padding: 0.05rem 0.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    text-transform: capitalize;
    display: inline-block;
    font-size: 1.1rem;
`;


const GroupChatList = () => {
    const [newChat, setNewChat] = useState(false);

    const handleNewChat = () => {
        console.log('new chat');
        setNewChat(!newChat);
    }

    return (
      <GroupChatListStyle>
        <div className="">
          <h1 className="font-bold sm:text-2xl text-white text-xl flex justify-between">
            Groups
            <Button onClick={handleNewChat}>New</Button>
          </h1>
          <CreateChannel show={newChat} setShow={setNewChat} />
        </div>
        <div className="h-px mt-[-10px] shadow-lg bg-[#A8A8A8] w-[99%] mx-auto opacity-60"></div>
        <div className=""></div>
      </GroupChatListStyle>
    );
}


export default GroupChatList;