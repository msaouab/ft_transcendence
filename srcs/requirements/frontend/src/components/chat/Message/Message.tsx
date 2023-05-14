
import styled from 'styled-components';

import Cookies from 'js-cookie';

//  common functions
import { dateStrToNum } from '../../common/CommonFunc';
const MessageStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-self: ${props => props.sender_id === Cookies.get('id') ? 'flex-end' : 'flex-start'};

    // border: 1px solid #fff;
    .message__dot {
        align-self: ${props => props.sender_id === Cookies.get('id') ? 'flex-end' : 'flex-start'};
        background: ${props => props.sender_id === Cookies.get('id') ? '#E9D990' : '#E7E7E7'};
        margin-top: -12px;

    }
    // date
   .message__date {
        align-self: ${props => props.sender_id === Cookies.get('id') ? 'flex-end' : 'flex-start'};
        font-size: 0.7rem;
        color: #fff;
        margin-right: ${props => props.sender_id === Cookies.get('id') ? '15px' : '-10px'};

    }

    `;



import MessageContent from './MessageContent';
import { singleMessage } from '../../../types/message';
import { getDateChat } from '../../common/CommonFunc';



const Message = ({ message, prevMessage, setState }: { message: singleMessage, prevMessage: singleMessage, setState: any }) => {


    return (


        <MessageStyle color={'#fff'} sender_id={message.sender_id} >
            <MessageContent content={message.content} sender_id={message.sender_id} id={message.id} chatRoomId={message.chatRoom_id} setState={setState} />
            {/* if prev is undefined show the stuff   */}
            {prevMessage === undefined && <p className="mx-4 message__date">{getDateChat(message.dateCreated)}</p>}
            {prevMessage === undefined && <div className='message__dot w-3 h-3 rounded-full'></div>}
            {
                prevMessage !== undefined && message.sender_id !== prevMessage.sender_id
                && (dateStrToNum(message.dateCreated) - dateStrToNum(prevMessage.dateCreated)) < 60000 && <p className="mx-4 message__date">{getDateChat(message.dateCreated)}</p>
            }
            {
                prevMessage !== undefined && message.sender_id !== prevMessage.sender_id
                && (dateStrToNum(message.dateCreated) - dateStrToNum(prevMessage.dateCreated)) < 60000 && <div className='message__dot w-3 h-3 rounded-full'></div>
            }

        </MessageStyle >
    );
};

export default Message;
