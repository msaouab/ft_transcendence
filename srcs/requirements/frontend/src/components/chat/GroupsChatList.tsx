
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import CreateChannel from './CreateChannel/CreateChannel';
import { GroupMessage, PrivateMessage } from '../../types/message';
import { useGlobalContext } from '../../provider/AppContext';
import GroupTab from './GroupTab';
import Cookies from "js-cookie";
import { GetJoindChannels } from "../../api/axios";
import { Card, Dialog } from '@material-tailwind/react';


const GroupChatListStyle = styled.div`
    width: 100%;
    height: 100%;
    background: rgba(217, 217, 217, 0.3);
    border-radius: 25px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Button = styled.button`
    cursor: pointer;
    color: #fff;
    background: rgb(233, 217, 144);
    border: transparent;
    border-radius: 0.25rem;
    padding: 0.05rem 0.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    text-transform: capitalize;
    display: inline-block;
    font-size: 1.1rem;
`;

interface GroupChatListProps {
  setSelectedGroupChat: (chat: GroupMessage) => void;
  setSelectedChat: (chat: PrivateMessage) => void,
  socket: any,
  connected: boolean,
  selected: string,
  setSelected: (selected: string) => void
}

const GroupChatList = ({ setSelectedGroupChat, setSelectedChat, socket, connected, selected, setSelected }: GroupChatListProps) => {
  const [newChat, setNewChat] = useState(false);
  const { groupChatRooms, setGroupChatRooms } = useGlobalContext();

  const getGroupChatRooms = async () => {
    let id = Cookies.get("id");
    if (!id) return;
    try {
      const channels = await GetJoindChannels(id);
      const res = await Promise.all(
        channels.map(async (channel: any) => {
          return { ...channel };
        })
      );
      if (groupChatRooms.length === 0) {
        setGroupChatRooms(res);
      }
      else {
        setGroupChatRooms(res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getGroupChatRooms();
  }, []);


  useEffect(() => {
    if (connected) {
      socket.current.on("newGroupMessage", (data: any) => {
        setGroupChatRooms(prev => {
          const index = prev.findIndex((group: GroupMessage) => group.group_id === data.group_id);
          if (index === -1) {
            return [data, ...prev];
          }
          const newGroupChatRooms = [...prev];
          newGroupChatRooms[index].lastMessage = data.lastMessage;
          newGroupChatRooms[index].lastMessageDate = data.lastMessageDate;
          return newGroupChatRooms;
        })
        setSelectedChat({} as PrivateMessage);
        setSelected(data.group_id);
        setSelectedGroupChat(data);
      });
    }
    return () => {
      socket.current.off("newGroupMessage");
    }
  }, [connected]);

  const [joinPrivateChannel, setJoinPrivateChannel] = useState(false);
  const [privateChannelId, setPrivateChannelId] = useState("");
  const handleJoinPrivateChannel = () => {

    if (privateChannelId === "") return;
    if (connected) {
      socket.current.emit("joinPrivateChannel", {
        group_id: privateChannelId,
        user_id: Cookies.get("id")
      });
    }
    setJoinPrivateChannel(!joinPrivateChannel);
    setPrivateChannelId("");
  };

  useEffect(() => {
    if (connected) {
      socket.current.on("newMember", (data: any) => {
        const newGroupMessage: GroupMessage = {
          group_id: data.channel.id,
          sender_id: data.channel.id,
          name: data.channel.name,
          profileImage: data.channel.avatar,
          lastMessage: `${data.user.login} joined the group`,
          lastMessageDate: new Date().toISOString(),
          role: data.role,
        };
        setGroupChatRooms(prev => {
          const index = prev.findIndex((group: GroupMessage) => group.group_id === data.channel.id);
          if (index === -1) {
            return [newGroupMessage, ...prev];
          }
          const newGroupChatRooms = [...prev];
          newGroupChatRooms[index].lastMessage = newGroupMessage.lastMessage;
          newGroupChatRooms[index].lastMessageDate = newGroupMessage.lastMessageDate;
          return newGroupChatRooms;
        })
        setSelectedChat({} as PrivateMessage);
        setSelected(data.channel.id);
        socket.current.emit("sendMessageG", newGroupMessage);
      });
    }
    return () => {
      socket.current.off("newMember");
    }
  }, [connected]);


  useEffect(() => {
    if (connected) {
      socket.current.on("newMessageG", (message: any) => {
        setGroupChatRooms(prev => {
          const index = prev.findIndex((group: GroupMessage) => group.group_id === message.group_id);
          if (index === -1) {
            return [message, ...prev];
          }
          return prev;
        });
      });
    }
    return () => {
      socket.current.off("newMessageG");
    }
  }, [connected]);

  return (
    <GroupChatListStyle>
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-bold sm:text-2xl text-white text-xl flex justify-between">
          Groups
        </h1>
        <div className="flex flex-row gap-2">
          <Button onClick={() => setNewChat(!newChat)}>New</Button>
          <Button onClick={() => setJoinPrivateChannel(!joinPrivateChannel)}>Join</Button>
        </div>
        <Dialog
          size="sm"
          open={joinPrivateChannel}
          handler={setJoinPrivateChannel}
          className="flex flex-col justify-center items-center max-w-sm p-5 bg-[#6e6a6a]"
        >
          <Card className="w-full max-w-sm p-5 bg-[#6e6a6a] 
              shadow-none" >
            <h2 className="text-gray-200 text-2xl text-center mb-2">Join Private Channel</h2>
            <div className="px-6">
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Enter Channel ID"
                  className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-200
                      bg-[#6e6a6a] text-gray-200 "
                  value={privateChannelId}
                  onChange={(e) => setPrivateChannelId(e.target.value)}
                />
                <Button
                  className="bg-[#6e6a6a] text-gray-200
                      hover:bg-gray-200 hover:text-gray-800"
                  onClick={handleJoinPrivateChannel}
                >Join</Button>
              </div>
            </div>
          </Card>
        </Dialog>
        {
          newChat && (<CreateChannel
            setSelectedGroupChat={setSelectedGroupChat}
            show={newChat}
            setShow={setNewChat}
            socket={socket}
            connected={connected}
          />)
        }
        
      </div>
      <div className="h-px mt-[-10px] shadow-lg bg-[#A8A8A8] w-[99%] mx-auto opacity-60"></div>
      <div className="">
        {groupChatRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center ">
            <div className=" sm:text-xl text-white max-w-[200px] ">
              Your chat history is looking a little empty
            </div>
            <div>
              <div className="text-base text-[#A8A8A8] max-w-[200px]">
                make use of the search bar{" "}
              </div>
            </div>
          </div>
        ) : (
          groupChatRooms.sort((a: GroupMessage, b: GroupMessage) => {
            return (
              new Date(b.lastMessageDate).getTime() -
              new Date(a.lastMessageDate).getTime()
            );
          }).map((props: GroupMessage) => {
            return (
              <div
                key={props.group_id}
                onClick={() => {
                  console.log("selected group: ", props);
                  setSelected(props.group_id);
                  setSelectedChat({} as PrivateMessage);
                  setSelectedGroupChat(props);
                }}
              >
                <GroupTab
                  groupMessage={props}
                  selected={props.group_id === selected}
                />
                {props.group_id !==
                  groupChatRooms[groupChatRooms.length - 1].group_id ? (
                  <div className="h-px bg-[#B4ABAB] w-[99%] mx-auto mt-1.5 mb-1.5 opacity-60"></div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </GroupChatListStyle>
  );
}


export default GroupChatList;