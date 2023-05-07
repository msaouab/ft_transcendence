
import { CiCircleRemove } from "react-icons/ci";
import ChatBox from "../../chat/ChatBox";
import { PrivateMessage } from "../../../types/message";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
const TmpChatBox = ({ showTempChat, setShowTempChat, user }: { showTempChat: boolean, setShowTempChat: any, user: any }) => {
    const [dummySelectedChat, setDummySelectedChat] = useState<PrivateMessage | null>(null);

    useEffect(() => {
        setDummySelectedChat({
            chatRoomid: '',
            messageId: '',
            sender_id: Cookies.get('id') || '',
            receiver_id: user.id,
            login: user.login,
            profileImage: user.profileImage,
            lastMessage: '',
            lastMessageDate: '',
            seen: false,
            status: user.status
        });
    }, [showTempChat]);

    return (
        showTempChat && (
            <div className="tmp-chat 
            absolute bottom-0 right-10 z-50 rounded-tl-lg rounded-tr-lg shadow-2xl w-80 h-96
            transition-all duration-300 ease-in-out rounded-b-n ">
                <ChatBox size="small" selectedChat={dummySelectedChat} />
            </div>
        )

    );
};

export default TmpChatBox;
