import styled from "styled-components";

import { PrivateMessage } from "../../types/message";

import Cookies from 'js-cookie';

import { Link } from "react-router-dom";
// components
import MessageDate from './SeenDate';
import { useEffect } from "react";
const ChatTabStyle = styled.div`
    background: transparent; 
    width: 100%;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;
    padding: 10px;
    
    &::-webkit-scrollbar {
        display: none;
    }

    ${(props: { selected: boolean }) => props.selected ? `
        background: rgba(217, 217, 217, 0.3);
        // it shoudl move a litte up
        transform: translateY(-1px);
        shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        border-radius: 10px;
        transition: all 0.2s ease-in-out;
        duration: 0.1s;
    ` : ``}
    
    &:hover {
        background: rgba(217, 217, 217, 0.3);
        // it shoudl move a litte up 
        transform: translateY(-1px);
        shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        border-radius: 10px;
        transition: all 0.2s ease-in-out;
        duration: 0.1s;
    }
    .chat-tab__image {
        min-width: 40px;
        width: 14%;
        height: 100%;
    }
    .chat-tab__info {
        width: 60%;
        height: 100%;
        color: #fff;
    }

    & > *:nth-child(3) {
        width: 40%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-end;
        font-size: 0.6rem;
        color: #fff;
    }



    @media (max-width: 360px) {
        & > *:nth-child(3) {
            display: none;
        }
    }

`;




const ChatTab = ({ privateMessage, selected }:
    {
        privateMessage: PrivateMessage,
        selected: boolean
    }
) => {

    
    let otherUserId = privateMessage.sender_id === Cookies.get('id') ? privateMessage.receiver_id : privateMessage.sender_id;
    return (
        <ChatTabStyle selected={selected}>
            <div className="chat-tab__image">
                {/* uncomment later */}
                {/* <img src={privateMessage.profileImage} alt="profile" className="rounded-full" /> */}
                <img src="https://picsum.photos/200" alt="profile" className="rounded-full w-10 h-10" />
            </div>
            <div className="chat-tab__info">
                {/* <div className="chat-tab__info__name font-black "> */}
                <Link to={`/user/${otherUserId}`} className="chat-tab__info__name font-black hover:underline">
                    {privateMessage.login}
                </Link>
                {/* </div> */}
                <div className="chat-tab__info__last-message text-xs font-thin opacity-50">
                    {privateMessage.lastMessage.length > 25 ? privateMessage.lastMessage.slice(0, 25) + '...' : privateMessage.lastMessage}
                </div>
            </div>

            <MessageDate {...privateMessage} />
        </ChatTabStyle>
    );
};

export default ChatTab;



