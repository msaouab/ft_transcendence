import styled from "styled-components";

import { PrivateMessage } from "../../types/message";

import Cookies from 'js-cookie';


// components
import MessageDate from './SeenDate';

const ChatTabStyle = styled.div`
    background: transparent; 
    width: 100%;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;
    & > *:first-child {
        min-width: 40px;
        width: 14%;
        height: 100%;
    }
    & > *:nth-child(2) {
        width: 60%;
        height: 100%;
        color: #fff;
    }

    & > *:nth-child(3) {
        width: 26%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-end;
        font-size: 0.6rem;
        color: #fff;
    }
`;




const ChatTab = (props: PrivateMessage) => {
    return (
        <ChatTabStyle>
            <div className="chat-tab__image">
                {/* uncomment later */}
                {/* <img src={props.profileImage} alt="profile" className="rounded-full" /> */}
                <img src="https://picsum.photos/200" alt="profile" className="rounded-full w-10 h-10" />
            </div>
            <div className="chat-tab__info">
                <div className="chat-tab__info__name font-black ">
                    {props.login}
                </div>
                <div className="chat-tab__info__last-message text-xs font-thin opacity-50">
                    {props.lastMessage.length > 25 ? props.lastMessage.slice(0, 25) + '...' : props.lastMessage}
                </div>
            </div>
            <MessageDate {...props} />
        </ChatTabStyle>
    );
};

export default ChatTab;



