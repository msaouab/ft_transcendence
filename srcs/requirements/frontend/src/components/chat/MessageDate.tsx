
import styled from "styled-components";
import Cookies from 'js-cookie';


import { PrivateMessage } from "../../types/message";
import axios from "axios";
import SeenIcon from '../../assets/seen.svg';
import notSeenIcon from '../../assets/notSeen.svg';
import { useEffect, useState } from "react";
const SeenNotSeenIconStyle = styled.img`
    width: 17px;
    height: 17px;
    margin-left: 10px;
    margin-top: 5px; 
`;
const SenderComponent = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
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
    
    `;

const getDate = (date: string) => {
    const d = new Date(date);
    const day = d.toLocaleDateString("en-US", { weekday: "short" });
    const hour = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    return `${day}, ${hour} `;
};


// interface UserMessageProps {
//     user: PrivateMessage;
// }

// use a function expression and use props parameter
const MessageDate = (props: PrivateMessage) => {
    // use useState hook to store count
    const [count, setCount] = useState(0);

    // move getNumberOfNotSeeMessages inside the component and use props parameter
    const getNumberOfNotSeeMessages = async () => {
        // console.log(`http://localhost:${process.env.BACKEND_PORT}/api/v1/user/${id}/chatrooms/private/${chatId}/messages/unseencount/`)
        let count = await axios.get(
            `http://localhost:${3000}/api/v1/chatrooms/private/${props.chatRoomid}/messages?seen=false&userId=${Cookies.get('id')}`,
        );
        return count.data;
    };

    // use useEffect hook to call getNumberOfNotSeeMessages and update count
    useEffect(() => {
        getNumberOfNotSeeMessages().then((count) => {
            count = count.length;
            setCount(count);
        });
        // use an empty dependency array to run only once
    }, []);

    // count how many messages are not seen
    if (props.receiver_id === Cookies.get('id') && count > 0) {
        return (
            <MessageDateStyle>
                <div>{getDate(props.lastMessageDate)}</div>
                <div className="rounded-full bg-[#E9D990] text-[#1E1D18] text-xs w-4 h-4 flex justify-center items-center">{count}</div>
            </MessageDateStyle >
        );
    }
    return (
        <div className="chat-tab__date__seen">

            {getDate(props.lastMessageDate)}
            {
                props.seen ? <SeenNotSeenIconStyle src={SeenIcon} alt="seen" />
                    :
                    <SeenNotSeenIconStyle src={notSeenIcon} alt="not seen" />
            }
        </div>
    )
}



export default MessageDate;

