
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

    // @media (max-width: 768px) {
    //     width: 70%;
    //     margin: 0 auto;
    // }

   
`;

const UsersChatList = ({ setSelectedChat, newLatestMessage }: { setSelectedChat: (chat: PrivateMessage) => void, newLatestMessage: string }) => {

    const [privateChatRooms, setPrivateChatRooms] = useState([]);

    const getUser = async (sender_id: string, receiver_id: string): Promise<{ login: string, profileImage: string }> => {
        const userId = sender_id === Cookies.get('id') ? receiver_id : sender_id;
        const user = await axios.get(`http://localhost:3000/api/v1/user/${userId}`);
        return user.data;
    }

    const getPrivateChats = async (limitRoom: string, limitMsg: string) => {
        // get id from cookies
        const Tabs: any = [];
        let id = Cookies.get('id');
        if (!id) return;
        try {



            const privateRooms = await axios.get(`http://localhost:3000/api/v1/user/${id}/chatrooms/private?limit=${limitRoom}`);
            // console.log(privateRooms.data);
            // check if status is 200 if not throw error
            if (privateRooms.status !== 200) throw new Error('Error while fetching private chat rooms');
            // use Promise.all to wait for all the promises
            await Promise.all(privateRooms.data.map(async (room: { id: string, content: string, dateCreated: Date, seen: boolean }) => {
                const { id } = room;

                const message = await axios.get(`http://localhost:3000/api/v1/chatrooms/private/${id}/messages?limit=${limitMsg}`);
                // console.log(
                let user;
                try {
                    if (message.data[0] === 0) return;

                    user = await getUser(message.data[1][0].sender_id, message.data[1][0].receiver_id)

                } catch (error) {
                    console.error(error);
                    return;
                }

                // if 
                // const
                const data: PrivateMessage = {
                    chatRoomid: id,
                    messageId: message.data[1][0].id,
                    sender_id: message.data[1][0].sender_id,
                    receiver_id: message.data[1][0].receiver_id,
                    lastMessage: message.data[1][0].content,
                    lastMessageDate: message.data[1][0].dateCreated,
                    seen: message.data[1][0].seen,
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
            setPrivateChatRooms(Tabs)

        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        getPrivateChats('5', '1')
    }, [newLatestMessage]);

    useEffect(() => {
        privateChatRooms.length > 0 ? setSelectedChat(privateChatRooms[0]) : null;
    }, [privateChatRooms])

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

            {/* if there no privatechatrooms to show
                we should show a message to the user
            */}
            <div className='overflow-y-scroll scrollbar-hide h-[100%] mt-2 flex flex-col gap-2'>
                {privateChatRooms.length === 0 ?
                    <div className='flex flex-col items-center justify-center h-full text-center'>
                        <div className='text-2xl text-white'>Your chat history is looking a little empty</div>
                        <div>
                            <div className='text-xl text-white'>want to fix that?</div>
                        </div>

                    </div> :

                    (
                        privateChatRooms.map((props: PrivateMessage) => {
                            return (
                                <div key={props.chatRoomid} onClick={() => {
                                    setSelectedChat(props);
                                    // on hover it should move up a little bit
                                }} >
                                    <ChatTab {...props} key={props.chatRoomid} />
                                    {/* seperator should show under all compontes excpet the last one */}
                                    {props.chatRoomid !== privateChatRooms[privateChatRooms.length - 1].chatRoomid ?
                                        <div className='h-px bg-[#B4ABAB] w-[99%] mx-auto mt-1.5 opacity-60'></div> : null}

                                </div>
                            )
                        })

                    )
                }
            </div>
        </UsersChatListStyle>
    );
};

export default UsersChatList;
