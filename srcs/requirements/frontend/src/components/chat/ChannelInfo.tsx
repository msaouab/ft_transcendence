
import React, { useEffect } from 'react'
import { AiOutlineEdit, AiOutlineClose, AiOutlineLink } from 'react-icons/ai'
import { RxDotsVertical } from 'react-icons/rx'
import Cookies from 'js-cookie'

import Drawer from '../../components/chat/drawer'
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Dialog,
} from "@material-tailwind/react";
import Avatar from '../../components/chat/Avatar';
import { GetChannelInfo } from '../../api/axios';
import { useGlobalContext } from '../../provider/AppContext'
import { GroupMessage } from '../../types/message'

interface props {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedGroupChat: any;
    socket: any;
    connected: boolean;
    setSelectedGroupChat: (chat: GroupMessage) => void;
}


const ChannelInfo = ({ open, setOpen, selectedGroupChat, socket, connected, setSelectedGroupChat }: props) => {
    const [channel, setChannel] = React.useState<any>(null);
    const [channelUsers, setChannelUsers] = React.useState<any>(null);
    const [currentUser, setCurrentUser] = React.useState({} as {
        avatar: string;
        id: string;
        login: string;
        role: string;
        status: string;
    });
    const [mutedUsers, setMutedUsers] = React.useState<any>(null);
    const [bannedUsers, setBannedUsers] = React.useState<any>(null);
    const [selectedUser, setSelectedUser] = React.useState<any>(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    const { setGroupChatRooms } = useGlobalContext();


    const getChannelInfo = async () => {
        await GetChannelInfo(selectedGroupChat.group_id).then(res => {
            const currentUserId = Cookies.get('id') as string;
            let currentUser;
            currentUser = res.subscribers.find((user: any) => user.id === currentUserId);
            if (currentUser === undefined) {
                currentUser = res.mutedMembers.find((data: any) => {
                    return data.id === currentUserId
                });
            }
            console.log("channel subscribers", res.subscribers[0]);
            setCurrentUser(currentUser);
            setChannel(res.channel);
            setChannelUsers(res.subscribers);
            setMutedUsers(res.mutedMembers);
            setBannedUsers(res.bannedMembers);
        }).catch(err => console.log(err));
    }

    const handleOpen = () => {
        setOpenDialog(!openDialog);
    }
    const handleChanelUser = (user: any) => () => {
        setSelectedUser(user);
        handleOpen();
    }

    const handleAdminRole = (user: any) => {
        if (user.role === "Member") {
            socket.current.emit("addAdmin", { group_id: selectedGroupChat.group_id, userId: user.id });
        }
        else {
            socket.current.emit("removeAdmin", { group_id: selectedGroupChat.group_id, userId: user.id });
        }
        handleOpen();
    }

    const handleMuteUser = (user: any) => {
        if (user.role !== "Muted") {
            socket.current.emit("muteUser", { group_id: selectedGroupChat.group_id, userId: user.id });
        }
        else {
            socket.current.emit("unmuteUser", { group_id: selectedGroupChat.group_id, userId: user.id });
        }
        handleOpen();
    }
    const handleKickUser = (user: any) => {
        socket.current.emit("kickUser", { group_id: selectedGroupChat.group_id, userId: user.id });
        handleOpen();
    }
    const handleBanUser = (user: any) => {
        if (user.role !== "Banned") {
            socket.current.emit("banUser", { group_id: selectedGroupChat.group_id, userId: user.id });
        }
        else {
            socket.current.emit("unbanUser", { group_id: selectedGroupChat.group_id, userId: user.id });
        }
        handleOpen();
    }

    useEffect(() => {
        getChannelInfo();
    }, [])

    useEffect(() => {
        if (connected) {
            socket.current.on("newChannelAdmin", (data: any) => {
                console.log("newChannelAdmin: ", data);
                setCurrentUser((prev: any) => {
                    if (prev.id === data.id) {
                        return { ...prev, role: "Admin" }
                    }
                    return prev;
                })
                setChannelUsers((prev: any) => {
                    return prev.map((user: any) => {
                        if (user.id === data.id) {
                            return { ...user, role: "Admin" }
                        }
                        return user;
                    })
                })
            });
            socket.current.on("removeChannelAdmin", (data: any) => {
                console.log("removeChannelAdmin: ", data);
                setCurrentUser((prev: any) => {
                    if (prev.id === data.id) {
                        return { ...prev, role: "Member" }
                    }
                    return prev;
                })
                setChannelUsers((prev: any) => {
                    return prev.map((user: any) => {
                        if (user.id === data.id) {
                            return { ...user, role: "Member" }
                        }
                        return user;
                    })
                })
            });
            socket.current.on("muteChannelUser", (data: any) => {
                console.log("muteChannelUser: ", data);
                setChannelUsers((prev: any) => {
                    return prev.filter((user: any) => user.id !== data.id)
                })
                setMutedUsers((prev: any) => {
                    return [...prev, data]
                })
                setCurrentUser((prev: any) => {
                    if (prev.id === data.id) {
                        return { ...prev, role: "Muted" }
                    }
                    return prev;
                })
            });
            socket.current.on("unmuteChannelUser", (data: any) => {
                console.log("unmuteChannelUser: ", data);
                setMutedUsers((prev: any) => {
                    return prev.filter((user: any) => user.id !== data.id)
                })
                setChannelUsers((prev: any) => {
                    return [...prev, data]
                })
                setCurrentUser((prev: any) => {
                    if (prev.id === data.id) {
                        return { ...prev, role: "Member" }
                    }
                    return prev;
                })
            });
            socket.current.on("kickChannelUser", (data: any) => {
                console.log("kickChannelUser: ", data);
                setChannelUsers((prev: any) => {
                    return prev.filter((user: any) => user.id !== data.id)
                })
                // if (data.id === Cookies.get('id')) {
                //     const newGroupMessage: GroupMessage = {
                //         group_id: selectedGroupChat.group_id,
                //         sender_id: selectedGroupChat.group_id,
                //         name: selectedGroupChat.name,
                //         profileImage: selectedGroupChat.profileImage,
                //         lastMessage: `${data.login} was kicked from the group`,
                //         lastMessageDate: new Date().toISOString(),
                //         role: selectedGroupChat.role,
                //     }
                //     socket.current.emit("sendGroupMessage", newGroupMessage);
                //     socket.current.emit("leaveGroupRoom", { group_id: selectedGroupChat.group_id });
                //     setSelectedGroupChat({} as GroupMessage);
                //     setGroupChatRooms((prev: any) => {
                //         return prev.filter((group: any) => group.group_id !== selectedGroupChat.group_id)
                //     })
                // }
            });
            socket.current.on("banChannelUser", (data: any) => {
                console.log("banChannelUser: ", data);
                setChannelUsers((prev: any) => {
                    return prev.filter((user: any) => user.id !== data.id)
                })
                setBannedUsers((prev: any) => {
                    return [...prev, data]
                })
                if (data.id === Cookies.get('id')) {
                    const newGroupMessage: GroupMessage = {
                        group_id: selectedGroupChat.group_id,
                        sender_id: selectedGroupChat.group_id,
                        name: selectedGroupChat.name,
                        profileImage: selectedGroupChat.profileImage,
                        lastMessage: `${data.login} was banned from the group`,
                        lastMessageDate: new Date().toISOString(),
                        role: selectedGroupChat.role,
                    }
                    socket.current.emit("sendGroupMessage", newGroupMessage);
                    socket.current.emit("leaveGroupRoom", { group_id: selectedGroupChat.group_id });
                    setSelectedGroupChat({} as GroupMessage);
                    setGroupChatRooms((prev: any) => {
                        return prev.filter((group: any) => group.group_id !== selectedGroupChat.group_id)
                    })
                }
            });
            socket.current.on("unbanChannelUser", (data: any) => {
                console.log("unbanChannelUser: ", data);
                setBannedUsers((prev: any) => {
                    return prev.filter((user: any) => user.id !== data.id)
                })
                setChannelUsers((prev: any) => {
                    return [...prev, data]
                })
            });
        }
        return () => {
            if (connected) {
                socket.current.off("newChannelAdmin");
                socket.current.off("removeChannelAdmin");
                socket.current.off("muteChannelUser");
                socket.current.off("unmuteChannelUser");
                socket.current.off("kickChannelUser");
                socket.current.off("banChannelUser");
                socket.current.off("unbanChannelUser");
            }
        }
    }, [connected])

    const buttonStyle = "py-2 px-4  shadow-md shadow-white/10 hover:scale-105 transition-all ease-in-out duration-200 rounded-md text-blue-gray-50 text-lg w-[8rem]"

    return (
        <div className='flex flex-col p-6 gap-6'>
            <Drawer open={open} onClose={() => setOpen(false)} placement='right' className='flex flex-col !bg-[#6e6a6a] !max-w-[30rem]'>
                <div className='h-16 flex gap-2'>
                    <button className='flex justify-center items-center h-full aspect-square 
                        hover:bg-white/10 active:bg-white/20' onClick={() => setOpen(false)}>
                        <AiOutlineClose className='text-lg ' />
                    </button>
                    <div className='flex-1 h-full flex items-center'>
                        Channels Info
                    </div>
                    <button className='flex justify-center items-center h-full aspect-square 
                        hover:bg-white/10 active:bg-white/20' >
                        <AiOutlineEdit className='text-lg ' />
                    </button>
                </div>
                <div className='w-full aspect-square bg-gray-500'>
                    <img src={channel?.avatar} alt="" className='w-full h-full object-cover' />
                </div>
                <button className='flex items-center aspect-square 
                        hover:bg-white/10 active:bg-white/20 h-16' >
                    <span className='flex justify-center items-center h-full aspect-square'>
                        <AiOutlineLink className='text-xl ' />
                    </span>
                    <span className='flex-1 flex flex-col text-left p-1 gap-1'>
                        <span className='font-bold '>
                            https://discord.gg/2Y8bQ4
                        </span>
                        <span className='text-xs text-gray-400'>
                            Click to copy
                        </span>
                    </span>
                </button>
                <div className='flex-1 flex flex-col gap-2 p-2 overflow-auto '>
                    <Tabs value="Subscribers">
                        <TabsHeader
                            className="rounded-none border-b border-blue-gray-50 bg-transparent p-0 [&>*]:text-white"
                            indicatorProps={{
                                className: "bg-transparent border-b-2 border-blue-500 shadow-none rounded-none",
                            }}
                        >
                            <Tab value={'Subscribers'}>
                                Subscribers
                            </Tab>
                            <Tab value={'Muted'}>
                                Muted
                            </Tab>
                            <Tab value={'Banned'}>
                                Banned
                            </Tab>
                        </TabsHeader>
                        <TabsBody>
                            <TabPanel value={'Subscribers'}>
                                <div className='text-white/70 flex gap-2 flex-col [&>*]:flex [&>*]:items-center [&>*]:gap-2 overflow-y-scroll h-[35rem]'>
                                    {
                                        channelUsers && channelUsers.map((user: any) => (
                                            <button key={user.id} className='hover:bg-white/10 active:bg-white/20 text-left flex  items-center gap-2 px-2 rounded'>
                                                <Avatar user={user} className='w-8 h-8 !bg-blue-500' />
                                                <div className='flex-1 flex flex-col p-1'>
                                                    <span className='font-bold '>
                                                        {user.login}
                                                    </span>
                                                    <span className='text-xs text-gray-400'>
                                                        {user.status}
                                                    </span>
                                                </div>
                                                <span className=''>
                                                    {user.role}
                                                </span>
                                                {
                                                    (currentUser.role === "Owner" || currentUser.role === "Admin") && user.id !== currentUser.id && user.role !== "Owner" &&
                                                    <span className='tools'>
                                                        <RxDotsVertical className='text-lg' onClick={handleChanelUser(user)} />
                                                    </span>
                                                }
                                            </button>
                                        ))
                                    }
                                </div>
                            </TabPanel>
                            {
                                currentUser && (
                                    <Dialog key={selectedGroupChat.group_id} size="sm" open={openDialog} handler={handleOpen} className="flex flex-col gap-4 items-center justify-center p-10 " >
                                        <div className='flex flex-col gap-2 items-center justify-center'>
                                            <Avatar user={selectedUser} className='w-16 h-16 !bg-blue-500' />
                                            <span className='font-bold text-xl'>
                                                {selectedUser?.login}
                                            </span>
                                            <span className='text-xs text-gray-400'>
                                                {selectedUser?.status}
                                            </span>
                                        </div>
                                        <div className='flex gap-6 items-center justify-center w-full flex-wrap max-w-[50rem]'>
                                            {
                                                currentUser.role === "Owner" && (
                                                    <button className={`${buttonStyle}  bg-cyan-800`} onClick={() => handleAdminRole(selectedUser)}>
                                                        {(selectedUser && selectedUser.role === "Admin") ? "Remove Admin" : "Make Admin"}
                                                    </button>
                                                )
                                            }
                                            <button className={`${buttonStyle}  bg-red-800`} onClick={() => handleKickUser(selectedUser)} >
                                                Kick
                                            </button>
                                            <button className={`${buttonStyle}  bg-red-800`} onClick={() => handleMuteUser(selectedUser)}>
                                                {selectedUser && selectedUser.role === "Muted" ? "Unmute" : "Mute"}
                                            </button>
                                            <button className={`${buttonStyle}  bg-red-800`} onClick={() => handleBanUser(selectedUser)}>
                                                {selectedUser && selectedUser.role === "Banned" ? "Unban" : "Ban"}
                                            </button>
                                        </div>
                                    </Dialog>
                                )
                            }
                            <TabPanel value={'Muted'}>
                                <div className='text-white/70 flex gap-2 flex-col [&>*]:flex [&>*]:items-center [&>*]:gap-2 overflow-y-scroll h-[45rem]'>
                                    {
                                        mutedUsers && mutedUsers.map((el: any) => (
                                            <button key={el.id} className='hover:bg-white/10 active:bg-white/20 text-left flex  items-center gap-2 px-2 rounded'>
                                                <Avatar user={el} className='w-8 h-8 !bg-blue-500' />
                                                <div className='flex-1 flex flex-col p-1'>
                                                    <span className='font-bold '>
                                                        {el.login}
                                                    </span>
                                                    <span className='text-xs text-gray-400'>
                                                        {el.status}
                                                    </span>
                                                </div>
                                                <span className=''>
                                                    {el.role}
                                                </span>
                                                {
                                                    (currentUser.role === "Owner" || currentUser.role === "Admin") && el.id !== currentUser.id &&
                                                    <span className='tools'>
                                                        <RxDotsVertical className='text-lg' onClick={handleChanelUser(el)} />
                                                    </span>
                                                }
                                            </button>
                                        ))
                                    }
                                </div>
                            </TabPanel>
                            <TabPanel value={'Banned'}>
                                <div className='text-white/70 flex gap-2 flex-col [&>*]:flex [&>*]:items-center [&>*]:gap-2 overflow-y-scroll h-[45rem]'>
                                    {
                                        bannedUsers && bannedUsers.map((el: any) => (
                                            <button key={el.id} className='hover:bg-white/10 active:bg-white/20 text-left flex  items-center gap-2 px-2 rounded'>
                                                <Avatar user={el} className='w-8 h-8 !bg-blue-500' />
                                                <div className='flex-1 flex flex-col p-1'>
                                                    <span className='font-bold '>
                                                        {el.login}
                                                    </span>
                                                    <span className='text-xs text-gray-400'>
                                                        {el.status}
                                                    </span>
                                                </div>
                                                <span className=''>
                                                    {el.role}
                                                </span>
                                                {
                                                    (currentUser.role === "Owner" || currentUser.role === "Admin") && el.id !== currentUser.id &&
                                                    <span className='tools'>
                                                        <RxDotsVertical className='text-lg' onClick={handleChanelUser(el)} />
                                                    </span>
                                                }
                                            </button>
                                        ))
                                    }
                                </div>
                            </TabPanel>
                        </TabsBody>
                    </Tabs>
                </div>
            </Drawer>
        </div>
    )
}

export default ChannelInfo