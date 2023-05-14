
import styled from 'styled-components';
import { CiCircleMore, CiCircleRemove, CiVolumeMute } from 'react-icons/ci'
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
    CiTrash
} from 'react-icons/ci';
import ConfirmDelete from '../common/ConfirmDelete';
import axios from 'axios';

// show react spring to animate the popup
// import { useSpring, animated, useTransition } from '@react-spring/web';

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
    height: 150px;
    border-radius: 10px; 
    right: 5.1rem;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    shadow: 0 0 10px rgba(0, 0, 0, 0.5);

    & > * {
        color: #000;
    }
`;




const ChatBoxTopBar = (props: { login: string, profileImage: string, status: string, id: string, chatRoomId: string }) => {
    let confirmData = {
        show: false,
        title: "Delete Chat",
        message: "Are you sure you want to delete this chat?",
        actionName: "Delete",
        confirm: () => handleDeleteChat(props.chatRoomId),
    }


    // animation stuff





    const [showConfirm, setshowConfirm] = useState(confirmData);
    const [showMore, setShowMore] = useState(false);
    // const [showConfirm, setshowConfirm] = useState(false);

    const menuRef = useRef(null);
    useEffect(() => {
        // console.log("clicked outside");
        const handleClickOutside = (e) => {
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
                console.log("deleted chat: ", res);
                setshowConfirm({ ...showConfirm, show: false });
                window.location.href = "/chat";
            })
            .catch(err => {
                console.log("error deleting chat: ", err);
            })
    }

    const handleBlockUser = (userId: string) => {
        console.log("block user: ", userId);
        axios.post(`http://localhost:3000/api/v1/user/${userId}/blockedusers/`, {
            withCredentials: true
        })
            .then(res => {
                console.log("blocked user: ", res);
                setshowConfirm({ ...showConfirm, show: false });
                window.location.href = "/chat";
            })
            .catch(err => {
                console.log("error blocking user: ", err);
            })

    }
    // const popupTransition = useTransition(showMore, {
    //     from: { opacity: 0, transform: "translateY(-10px)" },

    //     enter: { opacity: 1, transform: "translateY(0px)" },
    //     leave: { opacity: 0, transform: "translateY(-10px)" },
    //     reverse: showMore,
    //     delay: 0,
    //     duration: 200,

    // });










    return (
        <ChatBoxTopBarStyle>
            <div className="flex flex-row ">
                <div className="">
                    {/* uncomment later */}
                    {/* <img src={props.profileImage} alt="profile" className="rounded-full" /> */}
                    <img src="https://picsum.photos/200" alt="profile" className="rounded-full w-10 h-10" />
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
            <div className="close-chat-button flex justify-center items-center 
                    top-0 right-0 w-10 h-10 rounded-full 
                    hover:bg-[#27272a] hover:text-white
                    transition-all duration-300 ease-in-out cursor-pointer
                    ">
                <CiCircleMore size={30} onClick={() => setShowMore(!showMore)} />
            </div>




            {
                // popupTransition((style, item) =>
                //     item ? (
                showMore &&
                // <ChatBoxTopBarPopUpStyle ref={menuRef} style={style}>
                <ChatBoxTopBarPopUpStyle ref={menuRef}>
                    <div className="flex flex-col justify-center items-center w-full h-full">

                        <div className="flex flex-row justify-center items-center w-full h-1/3 hover:bg-[#27272a] hover:text-white  cursor-pointer hover:rounded-t-md">
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
                        <div className="flex flex-row justify-center items-center w-full h-1/3 hover:bg-[#27272a] hover:text-white  cursor-pointer">
                            <a className="text-sm font-bold"
                                onClick={() => {
                                    setshowConfirm({
                                        show: true,
                                        title: "Block User",
                                        message: "Are you sure you want to block this user?",
                                        actionName: "Block",
                                        confirm: () => handleBlockUser(props.id),
                                    })
                                    //    handleBlockUser(props.id);
                                }}
                            >Block User</a>
                            <CiCircleRemove size={20} className="ml-2" />
                        </div>
                        <div className="flex flex-row justify-center items-center w-full h-1/3 hover:bg-[#27272a] hover:text-white cursor-pointer hover:rounded-b-md">
                            <a className="text-sm font-bold"
                                onClick={() => {

                                    //    handleMuteUser(props.id);
                                }}
                            >Mute User</a>
                            <CiVolumeMute size={20} className="ml-2" />


                        </div>
                    </div>
                </ChatBoxTopBarPopUpStyle >
                // ) : null
                // )
            }
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