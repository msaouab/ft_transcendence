
import styled from "styled-components";
import Cookies from 'js-cookie';


import { PrivateMessage } from "../../types/message";
import axios from "axios";
import SeenIcon from '../../assets/seen.svg';
import notSeenIcon from '../../assets/notSeen.svg';
import { useEffect, useState } from "react";
import { getDateChat } from "../common/CommonFunc"
import { useGlobalContext } from "../../provider/AppContext";
import { HOSTNAME } from "../../api/axios";

const SeenNotSeenIconStyle = styled.img`
    width: 17px;
    height: 17px;
    margin-left: 10px;
    margin-top: 5px; 
`;

const MessageDateStyle = styled.div`
    background: transparent;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    font-size: 0.6rem;
    gap: 5px;
    color: #fff;
    


    // @media (max-width: 768px) {
    //     opacity: 0;
    // }
    `;


// use a function expression and use props parameter
const MessageDate = (props: PrivateMessage) => {

    const {privateChatRooms} = useGlobalContext();
    // use useState hook to store count
    const [count, setCount] = useState(0);
    const [seen, setSeen] = useState(props.seen);
    // move getNumberOfNotSeeMessages inside the component and use props parameter
    const getNumberOfNotSeeMessages = async () => {
        const url = `http://${HOSTNAME}:3000/api/v1/chatrooms/private/${props.chatRoomid}/messages?seen=false&userId=${Cookies.get('id')}`;
        // console.log("url: ", url);
        let count = await axios.get(
            `http://${HOSTNAME}:3000/api/v1/chatrooms/private/${props.chatRoomid}/messages?seen=false&userId=${Cookies.get('id')}`,
        );  
        return count.data[0];
    };

    useEffect(() => {
        // get the last message \in the chat room
        // console.log("privateChatRooms: ", privateChatRooms);
        const  privateChatRoom = privateChatRooms.find((chatRoom) => chatRoom.id === props.chatRoomid);
        if (privateChatRoom) {

            privateChatRoom.seen === true ? setSeen(true) : setSeen(false);
        }
    // lastMessage.seen === true ? setSeen(true) : setSeen(false);
    }, [privateChatRooms]);

    // use useEffect hook to call getNumberOfNotSeeMessages and update count
    useEffect(() => {
        
        getNumberOfNotSeeMessages().then((count) => {
            // console.log("number of not seen messages: ", count.length);
            count = count.length;
            setCount(count);
        });
        // use an empty dependency array to run only once
    }, []);

    if (props.receiver_id === Cookies.get('id') && count > 0) {
        return (
            <MessageDateStyle>
                <div>{getDateChat(props.lastMessageDate)}</div>
                <div className="rounded-full bg-[#E9D990] text-[#1E1D18] text-xs w-4 h-4 flex justify-center items-center p-2">{count}</div>
            </MessageDateStyle >
        );
    }
    return (
        <div className="chat-tab__date__seen">

            {getDateChat(props.lastMessageDate)}
            {
                seen ? <SeenNotSeenIconStyle src={SeenIcon} alt="seen" />
                    :
                    <SeenNotSeenIconStyle src={notSeenIcon} alt="not seen" />
            }
        </div>
    )
}



export default MessageDate;

