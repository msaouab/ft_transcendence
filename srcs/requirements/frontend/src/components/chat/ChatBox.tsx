import styled from 'styled-components';
import React, { useEffect } from 'react';
// import socket from '../../socket';
import { io } from 'socket.io-client';
const ChatBoxStyle = styled.div`
    background: transparent;
    width: 60%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: rgba(217, 217, 217, 0.3);
    border-radius: 25px;
    padding: 20px;
`;


import InfiniteScroll from 'react-infinite-scroll-component';
// types
import { PrivateMessage } from '../../types/message';
import { singleMessage } from '../../types/message';
// components
import ChatBoxTopBar from './ChatBoxToBar';
import SendMessageBox from './SendMessageBox';
import Message from './Message/Message';
import axios from 'axios';




const ChatBox = (selectedChat: PrivateMessage) => {
    // states
    let initialState = {
        messages: [] as singleMessage[],
        hasMore: true,
        offset: 0,
        totalMessages: 0,
    };
    // let socket = io('http://localhost:3000');

    const { chatRoomid } = selectedChat;

    const [totalMessages, setTotalMessages] = React.useState(0);
    const [state, setState] = React.useState(initialState);
    const { messages, hasMore, offset } = state;
    let limit = 14;

    const joinPrivateChatRoom = async (chatRoomid: string) => {
        console.log("joinPrivateChatRoom is called");
        // socket.emit('createPrivateRoom', chatRoomid);
    };

    const getMessages = async () => {
        let responseMessages = await axios.get(`http://localhost:3000/api/v1/chatrooms/private/${chatRoomid}/messages?limit=${limit}&offset=${offset}`);
        setTotalMessages(responseMessages.data[0]);
        return responseMessages.data[1];
    };
    const next = () => {
        getMessages().then((newMessages) => {
            setState((prevState) => ({
                ...prevState,
                messages: [...prevState.messages, ...newMessages],
                offset: prevState.offset + newMessages.length,
                hasMore: totalMessages > prevState.offset + newMessages.length
            }));
        });
    };

    React.useEffect(() => {
        getMessages().then((messages) => {
            setState((prevState) => ({
                ...prevState,
                messages: [...prevState.messages, ...messages],
                offset: prevState.offset + messages.length,
                hasMore: true,
            }));
        });

        // joinPrivateChatRoom(chatRoomid);

    }, [selectedChat]);


    // useEffect(() => {
    //     const socket = io('http://localhost:3000');
    //     socket.on('connect', () => {
    //         setIsConnected(true);
    //     });
    //     socket.on('disconnect', () => {
    //         setIsConnected(false);
    //     });
    // }, []);


    return (
        <ChatBoxStyle>
            <div>
                <ChatBoxTopBar login={selectedChat.login} profileImage={selectedChat.profileImage} status={selectedChat.status} />
                <div className='h-px bg-[#B4ABAB] w-[95%] mx-auto opacity-60'></div>
            </div>
            <div className="flex flex-col-reverse overflow-y-auto gap-2 mt-2 w-full h-full" id='scrollableDiv'>
                <InfiniteScroll
                    scrollableTarget="scrollableDiv"
                    dataLength={messages.length} //This is important field to render the next data
                    next={next}
                    hasMore={hasMore}
                    loader={
                        <h4
                            style={{
                                textAlign: 'center',
                                color: 'white',
                                position: 'absolute',
                                top: '15%',
                                left: '60%',
                            }}>Loading...</h4>
                    }
                    inverse={true}
                >
                    {messages
                        .slice() // make a copy of the array
                        .reverse() // reverse the order of the array
                        .map((message) => {
                            const prevMessage = messages[messages.indexOf(message) - 1];
                            return <Message key={message.id} message={message} prevMessage={prevMessage} />;
                        })}
                </InfiniteScroll>
            </div>
            <SendMessageBox {...selectedChat} />



        </ChatBoxStyle >
    );
};

export default ChatBox;









/* 
                when clicked, opening a websocket connection to the server 
                and sending the user id to the server
                the server will send back the messages between the two users
                and the client will display them
                also we need to fetch old messages

*/
