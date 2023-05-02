import styled from 'styled-components';
import SearchBar from '../common/SearchBar';

import GroupChatList from './GroupsChatList';
import UsersChatList from './UsersChatList';

const ChatListStyle = styled.div`
    background: transparent;
    border: 1 solid #fff;
    width: 30%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    & > *:first-child {
        height: 10%;
    }
    & > *:nth-child(2) {
        height: 35%;
    }
    & > *:nth-child(3) {
        height: 55%; 
    }
    `;

const ChatList = () => {
    return (
        <ChatListStyle>
            <SearchBar />
            <GroupChatList />
            <UsersChatList />
        </ChatListStyle>
    );
};

export default ChatList;
