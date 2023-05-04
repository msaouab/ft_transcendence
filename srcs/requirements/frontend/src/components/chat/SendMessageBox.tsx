
import styled from 'styled-components';
import { CiPaperplane, CiChat1 } from 'react-icons/ci';
import { PrivateMessage } from '../../types/message';
import { useState } from 'react';


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


const SendMessageBox = (selectedChat: PrivateMessage) => {

    const [message, setMessage] = useState<string>('');



    const sendMessage = (messageProp: string) => {

        // open a websocket connection, send the messageProp to the server
        // the server will then send the messageProp to the other user

        setMessage(messageProp);
        // console.log(messageProp);
        // console.log(selectedChat);
    };

    return (
        <SendMessageBoxStyle>
            <div className='message-icon text-white'>
                <CiChat1 size={30} color='#ffff' />
            </div>
            <form className='flex flex-row flex-1' onSubmit={(e) => { e.preventDefault(); sendMessage(message); }}>
                <input type='text' placeholder='Type a message...' onChange={(e) => setMessage(e.target.value)} />
            </form>
            <div className='send-icon'>
                <CiPaperplane size={30} color='#ffff' />
            </div>
        </SendMessageBoxStyle>
    );
};

export default SendMessageBox;
