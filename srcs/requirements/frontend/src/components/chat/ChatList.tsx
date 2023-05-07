import styled from 'styled-components';
import SearchBar from '../common/Search/SearchBar';

import GroupChatList from './GroupsChatList';
import UsersChatList from './PrivateChatList';


import { PrivateMessage } from '../../types/message';
import { SearchOptions } from '../../types/search';
const ChatListStyle = styled.div`
    background: transparent;
    border: 1 solid #fff;
    width: 30%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    gap: 10px;
    & > *:first-child {
        height: 10%;
        width: 100%;
    }

    & > *:nth-child(1) {
        height: 35%;
    }
    & > *:nth-child(2) {
        height: 55%; 
    }
    `;

const searchOptions: SearchOptions[] = [
    {
        sectionTitle: 'Users',
        endpoint: '/api/users',
    }
]

const ChatList = ({ setSelectedChat }: { setSelectedChat: (chat: PrivateMessage) => void }) => {
    return (
        <ChatListStyle>
            <SearchBar searchOptions={searchOptions} />
            <GroupChatList />
            <UsersChatList setSelectedChat={setSelectedChat} />
        </ChatListStyle>
    );
};

export default ChatList;
