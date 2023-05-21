import styled from 'styled-components';
import React from 'react';
// import socket from '../../socket';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

const ChatBoxStyle = styled.div`
    background: transparent;
    width: 100%;
    height: ${(props) => props.size === 'small' ? '100%' : '95%'};
    display: flex;
    flex-direction: column;
    background: ${(props) => props.size === 'small' ? 'black' : ' rgba(217, 217, 217, 0.3)'};
    border-radius: ${(props) => props.size === 'small' ? '10px 10px 0px 0px' : '25px'};
    font-size: ${(props) => props.size === 'small' ? '0.8rem' : '1.1rem'};
    padding: 20px; 
   
    @media (max-width: 768px) {
        max-height: 74vh;
        // height: 100%;
        padding: 10px;
    }
`;


import { PrivateMessage } from '../../types/message';
import { singleMessage } from '../../types/message';
// components
import ChatBoxTopBar from './ChatBoxToBar';
import SendMessageBox from './SendMessageBox';
import axios from 'axios';
import ChatInfiniteScroll from './ChatInfiniteScroll';


const ChatBox = ({ selectedChat, size, setNewLatestMessage, chatSocket, connected }: {
    selectedChat: PrivateMessage,
    size: string,
    setNewLatestMessage?: any,
    chatSocket: any,
    connected: boolean
}) => {
    let initialState = {
        messages: [] as singleMessage[],
        hasMore: true,
        offset: 0,
        totalMessages: 0,
    };

    const updateSeenStatus = (messages: singleMessage[]) => {
        messages.forEach((message: any) => {
            if (message.seen === false && message.sender_id !== Cookies.get('id')) {
                axios.put(`http://localhost:3000/api/v1/chatrooms/private/${message.chatRoom_id}/message/${message.id}` , {
                    seen: true
                }).then((response) => {

                    if (response.status !== 200) {
                        alert("error updating the seen status of the messages");
                    }

                }
                ).catch((error) => {
                    console.log("error", error);
                }
                );
            }
        });
    }

                
    useEffect(() => {
        if (connected) {  
            chatSocket.current.on('newPrivateMessage', (message: any) => {
                setState((prevState: any) => ({
                    ...prevState,
                    messages: [message, ...prevState.messages]
                }));
                updateSeenStatus([message]);
            })
        }
        return () => {
            chatSocket.current.off('newPrivateMessage');
        }
    }, [connected]);

    const { chatRoomid } = selectedChat;
    const [totalMessages, setTotalMessages] = React.useState(0);
    const [state, setState] = React.useState(initialState);
    const { messages, hasMore, offset } = state;
    let limit = 20;


    const getMessages = async (currentChat: any) => {
        if (!selectedChat.chatRoomid) {
            return [];
        } 
        // making the url dynamic
        let responseMessages = await axios.get(`http://localhost:3000/api/v1/chatrooms/private/${currentChat.chatRoomid}/messages?limit=${limit}&offset=${offset}`);
        setTotalMessages(responseMessages.data[0]);
        updateSeenStatus(responseMessages.data[1]);
        // responseMessages.data[1].forEach((message: any) => {
        //     if (message.seen === false && message.sender_id !== Cookies.get('id')) {
        //         axios.put(`http://localhost:3000/api/v1/chatrooms/private/${message.chatRoom_id}/message/${message.id}` , {
        //             seen: true
        //         }).then((response) => {
        //             if (response.status !== 200) {
        //                 alert("error updating the seen status of the messages");
        //             }

        //         }
        //         ).catch((error) => {
        //             console.log("error", error);
        //         }
        //         );
        //     }
        // });

        return responseMessages.data[1];
    };



    const next = () => {
        getMessages(selectedChat).then((newMessages) => {
            setState((prevState) => ({
                ...prevState,
                messages: [...prevState.messages, ...newMessages],
                offset: prevState.offset + newMessages.length,
                hasMore: totalMessages > prevState.offset + newMessages.length
            }));
        })


    };

    useEffect(() => {
        getMessages(selectedChat).then((messages) => {
            if (messages.length == 0
                || (messages[0] && selectedChat.chatRoomid !== messages[0].chatRoom_id)) {
                setState({
                    messages: messages,
                    hasMore: messages.length < totalMessages,
                    offset: messages.length,
                    totalMessages: totalMessages,
                });
            }
            else {
                  // update the seen status of the messages  (seen = true) to the viewed messages
                // messages are viewed when the user opens the chat box
                // console.log("messages", messages);
                // if (messages.length === 0) {
                //    console.log("no messages");
                // }
                // messages.forEach((message: any) => {
                //     // console.log("message", message);

                //     if (message.seen === false && message.sender_id !== Cookies.get('id')) {
                //         console.log("the message we're updating", message);
                //         axios.put(`http://localhost:3000/api/v1/chatrooms/private/${message.chatRoom_id}/message/${message.id}` , {
                //             seen: true
                //         }).then((response) => {

                //             console.log("response", response);
                //         }
                //         ).catch((error) => {
                //             console.log("error", error);
                //         }
                //         );
                //     }
                // });
                setState((prevState) => ({
                    ...prevState,
                    messages: [...prevState.messages, ...messages],
                    offset: prevState.offset + messages.length,
                    hasMore: true,
                }));

            }

        });

    }, [selectedChat.chatRoomid]);

    return (
        <ChatBoxStyle size={size} id='chat-box'>
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
                                <ChatBoxTopBar login={selectedChat.login} profileImage={selectedChat.profileImage} status={selectedChat.status} id={selectedChat.sender_id === Cookies.get('id') ? selectedChat.receiver_id : selectedChat.sender_id} chatRoomId={chatRoomid} size={size} 
                                    blocked={selectedChat.blocked}
                                   />
                                <div className='h-px bg-[#B4ABAB] w-[95%] mx-auto opacity-60'></div>
                            </div>
                            <ChatInfiniteScroll messages={messages} next={next} hasMore={hasMore} setState={setState} />
                            <SendMessageBox selectedChat={selectedChat} socket={chatSocket} connected={connected} setNewLatestMessage={setNewLatestMessage} size={size}/>
                        </>
                    )
            }
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