
import ChatBox from "../../chat/ChatBox";
import { PrivateMessage } from "../../../types/message";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from 'react';
import { io } from "socket.io-client";

import styled from "styled-components";
import { useGlobalContext } from "../../../provider/AppContext";
const TmpChatStyle = styled.div`
    position: absolute;
    bottom: 0;
    right: 5%;
    z-index: 50;
    width: max-content;
    height: 350px;
    transition: all 300ms ease-in-out;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px; 
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    background: #fff;
    overflow: hidden;
    

    &.hidden {
        transform: translateY(100%);
    }
    &.show {
        transform: translateY(0);
    }
    
`;
const TmpChatBox = ({ showTempChat, user }: { showTempChat: boolean, user: any }) => {

    const [dummySelectedChat, setDummySelectedChat] = useState<PrivateMessage | null>(null);
    if (!showTempChat) {
        return null;
    }
    const chatSocket = useRef(null);
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        if (!connected) {
            chatSocket.current = io(`http://localhost:3000/chat`);
            setConnected(true);
            console.log('connected to the server')
        }

    }, []);



    useEffect(() => {
        if (dummySelectedChat && dummySelectedChat.chatRoomid) {
            console.log("joining the room");
            const payload = {
                senderId: dummySelectedChat.sender_id,
                receiverId: dummySelectedChat.receiver_id
            }
            chatSocket.current.emit('joinRoom', payload);
        } 

        return () => {
            if (dummySelectedChat && dummySelectedChat.chatRoomid) {
                console.log("leaving the room");
                const payload = {
                    senderId: dummySelectedChat.sender_id,
                    receiverId: dummySelectedChat.receiver_id
                }
                chatSocket.current.emit('leaveRoom', payload);
            }
        }
    }, [dummySelectedChat]);

    useEffect(() => {
        const sender_id = Cookies.get('id') || '';
        const receiver_id = user.id;
        // console.log("heeeelo");
        // console.log("sender_id", sender_id);
        // console.log("receiver_id", receiver_id);
        axios.get(`http://localhost:3000/api/v1/chatrooms/private/single/${sender_id}/${receiver_id}`)
            .then((res) => {
                if (res.data.length !== 0) {
                    console.log('chat room exists', res)
                    setDummySelectedChat({
                        chatRoomid: res.data.id,
                        messageId: '',
                        sender_id: sender_id,
                        receiver_id: receiver_id,
                        login: user.login,
                        profileImage: user.profileImage,
                        lastMessage: '',
                        lastMessageDate: '',
                        seen: false,
                        status: user.status,
                    
                    });
                }
                else {
                    console.log('chat room does not exist', res)
                    axios.post(`http://localhost:3000/api/v1/chatrooms/private`, {
                        senderId: sender_id,
                        receiverId: receiver_id
                    })
                        .then((res) => {
                            console.log('chat room created', res);
                            setDummySelectedChat({
                                chatRoomid: res.data.id,
                                messageId: '',
                                sender_id: sender_id,
                                receiver_id: receiver_id,
                                login: user.login,
                                profileImage: user.profileImage,
                                lastMessage: '',
                                lastMessageDate: '',
                                seen: false,
                                status: user.status
                            });

                        }).catch((err) => {
                            console.log('error while creating chat room', err);
                        }
                        )
                }
            })
    }, [user]);


    return (
        showTempChat && (
            <TmpChatStyle className="rounded-b-n rounded-b-n rounded-tr-lg shadow-2xl  " >
                {dummySelectedChat &&
                    <ChatBox size="small" selectedChat={dummySelectedChat} key={user}
                        chatSocket={chatSocket} connected={connected}
                    />
                }
            </TmpChatStyle >
        )

    );
};

export default TmpChatBox;
