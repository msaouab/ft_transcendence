
import styled from 'styled-components';
import { CiPaperplane, CiChat1 } from 'react-icons/ci';
import { PrivateMessage } from '../../types/message';
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

import Cookies from 'js-cookie';
import { dateToStr } from '../common/CommonFunc';
const SendMessageBoxStyle = styled.div`
    width: 100%;
    height: 8%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: rgba(217, 217, 217, 0.3);
    border-radius: 25px;
    padding: 20px;
    color: #fff;

    input {
        background-color: transparent;
        border: none;
        flex: 1;
        margin-left: 10px;
    }
    input:focus {
        outline: none;
    }

    .message-icon {
        align-self: center;
        color: #ffff;
    }

    .send-icon {
        align-self: center;
        color: #ffff;
        cursor: pointer;
    }
`;


const SendMessageBox = ({ selectedChat, setState, socket, connected }: { selectedChat: any, setState: any, socket: any, connected: boolean }) => {
    const [message, setMessage] = useState<string>('');

    const sendMessage = (messageProp: string) => {
        if (messageProp === '') {
            return;
        }
        let message = {
            dateCreated: dateToStr(new Date()),
            content: messageProp,
            seen: false,
            chatRoom_id: selectedChat.chatRoomid,
            sender_id: Cookies.get('id'),
            receiver_id: selectedChat.sender_id === Cookies.get('id') ? selectedChat.receiver_id : selectedChat.sender_id
        };
        if (connected) {
            console.log('sending the message: ', message);
            socket.current.emit('sendPrivateMessage', message);
            setMessage('');
        }
    };

    return (
        <SendMessageBoxStyle>
            <div className='message-icon text-white'>
                <CiChat1 size={30} color='#ffff' />
            </div>
            <form className='flex flex-row flex-1' onSubmit={(e) => { e.preventDefault(); sendMessage(message); }}>
                <input type='text' placeholder='Type a message...' onChange={(e) => setMessage(e.target.value)} value={message}
                />
            </form>
            <div className='send-icon'>
                <a href='#' onClick={() => sendMessage(message)}>
                    <CiPaperplane size={30} color='#ffff' />
                </a>
            </div>
        </SendMessageBoxStyle>
    );
};

export default SendMessageBox;
