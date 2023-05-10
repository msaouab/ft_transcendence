import styled from 'styled-components';
import SearchBar from '../common/Search/SearchBar';

import GroupChatList from './GroupsChatList';
import UsersChatList from './PrivateChatList';


import { PrivateMessage } from '../../types/message';
import { SearchOptions } from '../../types/search';
const ChatListStyle = styled.div`
    background: transparent;
    border: 1 solid #fff;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    gap: 10px;
    & > *:first-child {
        width: 100%;
    }

    & > *:nth-child(1) {
        height: 35%;
    }
    & > *:nth-child(2) {
        height: 55%; 
    }

    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: 100vw;
        height: 100vh;
        border: black 1px solid;

        & > *:first-child {
            width: 90%;

        }
        & > *:nth-child(2) {
            // height: 35%;
            width: 90%;

        }
        & > *:nth-child(3) {
            width: 90%;

        }

    }

    `;

const ChatList = ({ setSelectedChat, newLatestMessage }: { setSelectedChat: (chat: PrivateMessage) => void, newLatestMessage: string }) => {
    return (
        <ChatListStyle>
            <SearchBar />
            <GroupChatList />
            <UsersChatList setSelectedChat={setSelectedChat} newLatestMessage={newLatestMessage} />
        </ChatListStyle>
    );
};

export default ChatList;
