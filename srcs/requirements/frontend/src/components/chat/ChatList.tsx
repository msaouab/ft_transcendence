import styled from 'styled-components';
import GroupChatList from './GroupsChatList';
import UsersChatList from './PrivateChatList';


import { PrivateMessage, GroupMessage } from '../../types/message';

const ChatListStyle = styled.div`
    background: transparent;
    // border: 1 solid #fff;
    // width: 100%;
    // height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 20px;
    gap: 10px;
    & > *:first-child {
        width: 100%;
    }

    & > *:nth-child(1) {
        height: auto;
    }
    & > *:nth-child(2) {
        height: auto;
    }
    & > *:nth-child(3) {
        height:  auto;
    }

    @media (max-width: 768px) {
        padding: 10px;
    }

`;

const ChatListWrapperStyle = styled.div`
//    @media (max-width: 768px) {
//         // border: 1px solid #fff;
//         // width: 90vw;
//         // height: 100vh;
//         display: flex;
//         flex-direction: column;
//         // align-items: center;
//         // item-align: center;
//    }
    `

interface ChatListProps {
    setSelectedChat: (chat: PrivateMessage) => void,
    newLatestMessage: { chatRoomId: string, message: string },
    setSelectedGroupChat: (chat: GroupMessage) => void,
    socket: any,
    connected: boolean
}

const ChatList = ({ setSelectedChat, newLatestMessage, setSelectedGroupChat, socket, connected}: ChatListProps) => {
    return (

        // <ChatListWrapperStyle>
            <ChatListStyle>
                {/* <SearchBar /> */}
                <GroupChatList setSelectedChat={setSelectedChat} setSelectedGroupChat={setSelectedGroupChat} socket={socket} connected={connected} />
                <UsersChatList setSelectedChat={setSelectedChat} newLatestMessage={newLatestMessage} />
            </ChatListStyle>
        // </ChatListWrapperStyle>
    );
};

export default ChatList;
