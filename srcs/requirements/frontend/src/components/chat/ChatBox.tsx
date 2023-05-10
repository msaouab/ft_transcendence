import styled from 'styled-components';
import React from 'react';
// import socket from '../../socket';
import { useRef, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { io } from 'socket.io-client';
const ChatBoxStyle = styled.div`
    background: transparent;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: ${(props) => props.size === 'small' ? 'black' : ' rgba(217, 217, 217, 0.3)'};
    border-radius: ${(props) => props.size === 'small' ? '10px 10px 0px 0px' : '25px'};
    font-size: ${(props) => props.size === 'small' ? '0.8rem' : '1.1rem'};
    padding: 20px;

    @media (max-width: 768px) {
        display: ${(props) => props.size === 'small' ? 'flex' : 'none'};
    }
    
    

`;


// import InfiniteScroll from 'react-infinite-scroll-component';
// types
import { PrivateMessage } from '../../types/message';
import { singleMessage } from '../../types/message';
// components
import ChatBoxTopBar from './ChatBoxToBar';
import SendMessageBox from './SendMessageBox';
// import Message from './Message/Message';
import axios from 'axios';
import ChatInfiniteScroll from './ChatInfiniteScroll';



const ChatBox = ({ selectedChat, size, setNewLatestMessage }: {
    selectedChat: PrivateMessage,
    size: string,
    setNewLatestMessage?: any
}) => {
    let initialState = {
        messages: [] as singleMessage[],
        hasMore: true,
        offset: 0,
        totalMessages: 0,
    };









    let chatSocket = useRef(null);
    const [connected, setConnected] = useState(false);

    // console.log('im inside chat box and im rendering with the selected chat: ', selectedChat);
    useEffect(() => {
        if (!connected) {
            chatSocket.current = io('http://localhost:3000/chat');
            setConnected(true);
            console.log('connected to the server');

            if (connected) {
                chatSocket.current.on('newPrivateMessage', (message: any) => {
                    setState((prevState: any) => ({
                        ...prevState,
                        messages: [message, ...prevState.messages]
                    }));
                })
            }
        }
        return () => {
            if (chatSocket.current && connected) {
                // chatSocket.current.off('newPrivateMessage');
                chatSocket.current.disconnect();
                setConnected(false);
            }
        }
    }, []);


    useEffect(() => {

        if (chatSocket.current && connected) {
            chatSocket.current.on('newPrivateMessage', (message: any) => {
                // console.log("im inside chat box and i got a new message from the server: ", message);
                setState((prevState: any) => ({
                    ...prevState,
                    messages: [message, ...prevState.messages]
                }));
            });
        }

    }, [chatSocket.current]);


    const { chatRoomid } = selectedChat;
    const [totalMessages, setTotalMessages] = React.useState(0);
    const [state, setState] = React.useState(initialState);
    const { messages, hasMore, offset } = state;
    let limit = 14;

    const getMessages = async () => {

        if (!selectedChat.chatRoomid) return [];

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
        })
    };

    useEffect(() => {
        // console.log("im the chat box and i got a new message from the server: ", selectedChat);

        // console.log('a new chat was selected: ', selectedChat);
        getMessages().then((messages) => {
            // console.log("The selected chat messages: ", messages);
            // if a new message is selected then reset the state
            if (messages.length == 0
                || (messages[0] && selectedChat.chatRoomid !== messages[0].chatRoom_id)) {
                // don't use the previous state
                setState({
                    messages: messages,
                    hasMore: messages.length < totalMessages,
                    offset: messages.length,
                    totalMessages: totalMessages,
                });
            }
            else {
                setState((prevState) => ({
                    ...prevState,
                    messages: [...prevState.messages, ...messages],
                    offset: prevState.offset + messages.length,
                    hasMore: true,
                }));
                // add the message as the last 
            }

        });
    }, [selectedChat]);


    return (
        <ChatBoxStyle size={size}>
            {
                selectedChat.sender_id === undefined && selectedChat.receiver_id === undefined ? (

                    <div className='flex flex-col items-center justify-center h-full'>
                        <div className='text-2xl text-white'>nothing to see here</div>
                        <div className='text-xl text-white'>try selecting a chat</div>
                    </div>
                )
                    :
                    (
                        <>
                            <div>
                                <ChatBoxTopBar login={selectedChat.login} profileImage={selectedChat.profileImage} status={selectedChat.status} id={selectedChat.sender_id === Cookies.get('id') ? selectedChat.receiver_id : selectedChat.sender_id} />
                                <div className='h-px bg-[#B4ABAB] w-[95%] mx-auto opacity-60'></div>
                            </div>
                            <div className="flex flex-col-reverse overflow-y-auto gap-2 mt-2 w-full h-full" id='scrollableDiv'>
                                <ChatInfiniteScroll messages={messages} next={next} hasMore={hasMore} />
                            </div>
                            <SendMessageBox selectedChat={selectedChat} socket={chatSocket} connected={connected} setNewLatestMessage={setNewLatestMessage} />
                        </>
                    )
            }
        </ChatBoxStyle>
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
