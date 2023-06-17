
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
} from "@material-tailwind/react";
import Avatar from '../../components/chat/Avatar';
import { GetChannelInfo } from '../../api/axios';

interface props {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedGroupChat: any;
}


const ChannelInfo = ({ open, setOpen, selectedGroupChat }: props) => {
    const [channel, setChannel] = React.useState<any>(null);
    const [channelUsers, setChannelUsers] = React.useState<any>(null);
    const [currentUser, setCurrentUser] = React.useState({} as {
        avatar: string;
        id: string;
        login: string;
        role: string;
        status: string;
    });

    const getChannelInfo = async () => {
        console.log("selectedGroupChat: ", selectedGroupChat);
        const res = await GetChannelInfo(selectedGroupChat.group_id);
        console.log("channel: ", res.channel);
        const currentUserId = Cookies.get('id') as string;
        const currentUser = res.subscribers.find((user: any) => user.id === currentUserId);
        console.log("currentUser: ", currentUser);
        setCurrentUser(currentUser);
        setChannel(res.channel);
        setChannelUsers(res.subscribers);
    }

    useEffect(() => {
        getChannelInfo();
    }, [])

    

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
                        </TabsHeader>
                        <TabsBody>
                            <TabPanel value={'Subscribers'}>
                                <div className='text-white/70 flex gap-2 flex-col [&>*]:flex  [&>*]:items-center [&>*]:gap-2' >
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
                                                    (currentUser.role === "Owner" || currentUser.role === "Admin") && user.id !== currentUser.id &&
                                                    <span className='tools'>
                                                        <RxDotsVertical className='text-lg' onClick={() => console.log("hello world")} />
                                                    </span>
                                                }
                                            </button>
                                        ))
                                    }
                                </div>
                            </TabPanel>
                            <TabPanel value={'Muted'}>
                                <div className='text-white/70' >
                                    muted users
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