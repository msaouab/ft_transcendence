
import styled from 'styled-components';

import axios from 'axios';
import { useEffect, useState } from 'react';

import Cookies from 'js-cookie'
import ChatTab from './ChatTab';
import { PrivateMessage, UserMessage } from '../../types/message';
import { CiEdit } from 'react-icons/ci';
const UsersChatListStyle = styled.div`
    border: 2 solid #fff;
    width: 100%;
    height: 100%;
    background: rgba(217, 217, 217, 0.3);
    border-radius: 25px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    h1 {
        color: #fff;
        text-align: start;

        font-size: 1.5rem;
    }
`;

const UsersChatList = () => {
    const [privateChatRooms, setPrivateChatRooms] = useState([]);
    const getUser = async (message: any): Promise<{ login: string, profileImage: string }> => {
        const { sender_id, receiver_id } = message;
        const userId = sender_id === Cookies.get('id') ? receiver_id : sender_id;
        const user = await axios.get(`http://localhost:3000/api/v1/user/${userId}`);
        return user.data;
    }
    const getPrivateChats = async () => {
        // get id from cookies
        const Tabs: any = [];
        let id = Cookies.get('id');
        try {
            // getting the first five private chat rooms only, by date 
            const privateRooms = await axios.get(`http://localhost:3000/api/v1/user/${id}/chatrooms/private?limit=5`);
            // use Promise.all to wait for all the promises
            await Promise.all(privateRooms.data.map(async (room: { id: string, content: string, dateCreated: Date, seen: boolean }) => {
                const { id } = room;
                const message = await axios.get(`http://localhost:3000/api/v1/chatrooms/private/${id}/messages?limit=1`);
                const user = await getUser(message.data[0]);
                const data: PrivateMessage = {
                    chatRoomid: id,
                    messageId: message.data[0].id,
                    sender_id: message.data[0].sender_id,
                    receiver_id: message.data[0].receiver_id,
                    lastMessage: message.data[0].content,
                    lastMessageDate: message.data[0].dateCreated,
                    seen: message.data[0].seen,
                    login: user.login,
                    profileImage: user.profileImage,
                    status: user.status
                }
                Tabs.push(data);
            }));
            // filter tabs by date
            Tabs.sort((a: any, b: any) => {
                return new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime();
            });

            setPrivateChatRooms(Tabs);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getPrivateChats();
    }, []);
    return (
        <UsersChatListStyle>
            <div className='flex justify-between'>
                <h1 className='text-2xl font-bold'>
                    People
                </h1>
                {/* add newmessage action later */}
                <div className='flex justify-end items-center'>
                    <CiEdit className='text-2xl text-white' />
                </div>
            </div>
            {
                privateChatRooms.map((props: PrivateMessage) => {
                    return (
                        <div key={props.chatRoomid}>
                            <ChatTab {...props} key={props.chatRoomid} />
                            {/* seperator should show under all compontes excpet the last one */}
                            {props.chatRoomid !== privateChatRooms[privateChatRooms.length - 1].chatRoomid ?
                                <div className='h-px bg-[#B4ABAB] w-[99%] mx-auto mt-1.5 opacity-60'></div> : null}
                        </div>
                    )
                })
            }
        </UsersChatListStyle>
    );
};

export default UsersChatList;
