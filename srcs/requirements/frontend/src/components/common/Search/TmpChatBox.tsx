
import ChatBox from "../../chat/ChatBox";
import { PrivateMessage } from "../../../types/message";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from 'react';
import { io } from "socket.io-client";
const TmpChatBox = ({ showTempChat, user }: { showTempChat: boolean, user: any }) => {
    const [dummySelectedChat, setDummySelectedChat] = useState<PrivateMessage | null>(null);
    if (!showTempChat) {
        return null;
    }
    const chatSocket = useRef(null);
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        if (!connected) {
            chatSocket.current = io('http://localhost:3000/chat');
            setConnected(true);
            console.log('connected to the server')
        }
    }, []);

    

    useEffect(() => {
        const sender_id = Cookies.get('id') || '';
        const receiver_id = user.id;
        console.log("heeeelo");
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
                        status: user.status
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
            <div className="tmp-chat 
            absolute bottom-0 right-10 z-50 rounded-tl-lg rounded-tr-lg shadow-2xl w-80 h-96
            transition-all duration-300 ease-in-out rounded-b-n ">
                {dummySelectedChat &&
                    <ChatBox size="small" selectedChat={dummySelectedChat} key={user} chatSocket={chatSocket} connected={connected} />
                }
            </div>
        )

    );
};

export default TmpChatBox;
