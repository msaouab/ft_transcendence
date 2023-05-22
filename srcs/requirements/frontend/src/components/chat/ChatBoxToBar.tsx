
import styled from 'styled-components';
import { CiCircleMore, CiCircleRemove, CiVolumeMute } from 'react-icons/ci'
import { Link } from 'react-router-dom';
import { useState, useEffect, createRef, useRef } from 'react';
import {
    CiTrash,CiCirclePlus
} from 'react-icons/ci';
import ConfirmDelete from '../common/ConfirmDelete';
import axios from 'axios';
import { useGlobalContext } from '../../provider/AppContext';
import Cookies from 'js-cookie';

const ChatBoxTopBarStyle = styled.div`
    background: transparent;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    padding: 10px;
    justify-content: space-between;
    border-radius: 25px;
    & > *:first-child {
        color: #fff;
    }
    & > *:nth-child(2) {
        cursor: pointer;
        color: #fff;
        margin-right: 0;
    }
`;

// const ChatBoxTopBarPopUpStyle = styled(animated.div)`
const ChatBoxTopBarPopUpStyle = styled.div`
    position: absolute;
    background: #D9D9D9;
    width: 150px;
    height: 100px;
    border-radius: 10px; 
    // bottom: 0;
    top: 1rem;

    right: 2.5rem;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // justify-content: flex-start;
    // align-items: center;
    cursor: pointer;
    shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    & > * {
        color: #000;
    }

`;




const ChatBoxTopBar = (props: { login: string, profileImage: string, status: string, id: string, chatRoomId: string, size: any, blocked: boolean}) => {
    let confirmData = {
        show: false,
        title: "Delete Chat",
        message: "Are you sure you want to delete this chat?",
        actionName: "Delete",
        confirm: () => handleDeleteChat(props.chatRoomId),
    }
    // update the state when the user is blocked 

    // console.log("props: ", props.blocked);
    const [UserIsBlocker, setUserIsBlocker] = useState(false);

``
    
    const {setPrivateChatRooms} = useGlobalContext();
    const [showConfirm, setshowConfirm] = useState(confirmData);
    const [showMore, setShowMore] = useState(false);


    const menuRef = useRef(null);

    useEffect(() => {
        // getting request to check if the user is blocked
        if (!props.blocked) {
            return;
        }

        axios.get(`http://localhost:3000/api/v1/user/${Cookies.get('id')}/blockedusers`,
            { withCredentials: true }
        )
            .then(res => {
                // console.log("blocked users: ", res.data);
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].blockedUser_id === props.id) {
                        setUserIsBlocker(true);
                        // console.log("user is a blocker");
                        return;
                    }
                }
                // console.log("user is not a blocker");
                setUserIsBlocker(false);
            })
            .catch(err => {
                console.log("error getting blocked users: ", err);
            })
    }, [])


                
    useEffect(() => {
        // console.log("clicked outside");
        const handleClickOutside = (e: any) => {
            // here we check if the target of the click isn't the menuRef
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMore(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);




    const handleDeleteChat = (chatRoomId: string) => {
        axios.delete(`http://localhost:3000/api/v1/chatrooms/private/${chatRoomId}`,
            { withCredentials: true }
        )
            .then(res => {
                setshowConfirm({ ...showConfirm, show: false });
                setPrivateChatRooms((prev: any) => {
                    return prev.filter((chatRoom: any) => {
                        return chatRoom.chatRoomid !== res.data.id;
                    })
                })
            })
            .catch(err => {
                console.log("error deleting chat: ", err);
            })
    }

    const handleBlockUser = () => {
        const meId = Cookies.get("id");
        const blockedUserId = props.id;
        // console.log("meId: ", meId);
        // console.log("blockedUserId: ", blockedUserId);
        axios.post(`http://localhost:3000/api/v1/user/${meId}/blockedusers/`,     
        {
            blockedUser_id: blockedUserId,
            withCredentials: true
        })
            .then(res => {
                // console.log("blocked user: ", res);
                setshowConfirm({ ...showConfirm, show: false });
                setPrivateChatRooms((prev: any) => {
                   // set blocked to true
                    return prev.map((chatRoom: any) => {
                        if (chatRoom.chatRoomid === props.chatRoomId) {
                            return { ...chatRoom, blocked: true };
                        }
                        return chatRoom;
                    })})
                setUserIsBlocker(true);
            })
            .catch(err => {
                console.log("error blocking user: ", err);
            })
    }

    const handleUnblockUser = () => {
        const meId = Cookies.get("id");
        const blockedUserId = props.id;
        axios.delete(`http://localhost:3000/api/v1/user/${meId}/blockedusers/${blockedUserId}`,
            {
                    withCredentials: true
            })

            .then(res => {
                // console.log("unblocked user: ", res);
                setshowConfirm({ ...showConfirm, show: false });
                setPrivateChatRooms((prev: any) => {
                    // set blocked to false
                    return prev.map((chatRoom: any) => {
                        if (chatRoom.chatRoomid === props.chatRoomId) {
                            return { ...chatRoom, blocked: false };
                        }
                        return chatRoom;
                    }
                    )
                })
                setUserIsBlocker(false);
            })
            .catch(err => {
                console.log("error unblocking user: ", err);
            })



        // 
    };

    return (
        <ChatBoxTopBarStyle>
            <div className="flex flex-row ">
                <div className="">
                    <img src={props.profileImage} alt="profile" className="rounded-full w-10 h-10" />
                </div>
                <div className="flex flex-col  ml-2 font-black ">
                    <div className="chat-box-top-bar__info__name font-black 
                    ">
                        <Link to={`/user/${props.id}`} className="hover:underline">
                            {props.login}
                        </Link>
                    </div>
                    <div className="chat-box-top-bar__info__status text-xs font-thin opacity-50 text-[#E9D990] ">
                        {props.status}
                    </div>
                </div>
            </div >

            <div className='relative'>
                {
                    props.size !== "small" &&
                <div className="close-chat-button flex justify-center items-center 
                top-0 right-0 w-10 h-10 rounded-full 
                hover:bg-[#27272a] hover:text-white
                transition-all duration-300 ease-in-out cursor-pointer
                ">
                <CiCircleMore size={30} onClick={() => 
                setShowMore(!showMore)
                
            }
             />
            </div>
}

            {
                showMore && 
                <ChatBoxTopBarPopUpStyle ref={menuRef}>
                    <div className="flex flex-col flex-start w-full h-full items-center">

                        <div className="flex flex-row justify-center items-center w-full h-1/2 hover:bg-[#27272a] hover:text-white  cursor-pointer hover:rounded-t-md">
                            <a className="text-sm font-bold"
                                onClick={() => {
                                    setshowConfirm({
                                        show: true,
                                        title: "Delete Chat",
                                        message: "Are you sure you want to delete this chat?",
                                        actionName: "Delete",
                                        confirm: () => handleDeleteChat(props.chatRoomId),
                                    })
                                }}
                            >Delete Chat</a>
                            <CiTrash size={20} className="ml-2"
                            />

                        </div>
                        <div className="flex flex-row justify-center items-center w-full h-1/2 hover:bg-[#27272a] hover:text-white  cursor-pointer hover:rounded-b-md">
                            
                            {props.blocked
                            ? 
                            // if me the blocker 
                            (UserIsBlocker ?
                            (
                                <>
                                <a className="text-sm font-bold" onClick={() => {
                                    setshowConfirm({
                                        show: true,
                                        title: "Unblock User",
                                        message: "Are you sure you want to unblock this user?",
                                        actionName: "Unblock",
                                        confirm: () => handleUnblockUser(),
                                    })
                                }} > Unblock User</a>
                                <CiCirclePlus size={20} className="ml-2" /> 
                                </>
                                ) : (
                                    <>
                                <a className="text-sm font-bold"
                                    onClick={() => {
                                        setshowConfirm({
                                            show: true,
                                            title: "Block User",
                                            message: "Are you sure you want to block this user?",
                                            actionName: "Block",
                                            confirm: () => handleBlockUser(),
                                        })
                                    }} > Block User</a>
                                    <CiCircleRemove size={20} className="ml-2" />     
                                    </>
                                )
                            ) : (
                                <>
                                <a className="text-sm font-bold" onClick={() => {
                                    setshowConfirm({
                                        show: true,
                                        title: "Block User",
                                        message: "Are you sure you want to block this user?",
                                        actionName: "Block",
                                        confirm: () => handleBlockUser(),
                                    })
                                }} > Block User</a>
                                <CiCircleRemove size={20} className="ml-2" />
                                </>
                            )
                            }
                        </div>
                    </div>
                </ChatBoxTopBarPopUpStyle >

}
</div>
            {
                showConfirm.show &&
                <ConfirmDelete setShow={setshowConfirm} id={props.chatRoomId} confirmData={showConfirm} />
            }

    
        </ChatBoxTopBarStyle >
    );

};

export default ChatBoxTopBar;

{/* show more will be a poupe beside the show more icon that show three option
                    1. delete chat
                    2. block user
                    3. mute user
        */}
{/* the popup is in the style of discord poup */ }