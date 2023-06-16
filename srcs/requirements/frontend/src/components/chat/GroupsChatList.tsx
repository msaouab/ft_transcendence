
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import CreateChannel from './CreateChannel/CreateChannel';
import { GroupMessage } from '../../types/message';
import { useGlobalContext } from '../../provider/AppContext';
import GroupTab from './GroupTab';
import Cookies from "js-cookie";
import { GetJoindChannels } from "../../api/axios";


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
  socket: any,
  connected: boolean,
}

const GroupChatList = ({ setSelectedGroupChat, socket, connected }: GroupChatListProps) => {
  const [newChat, setNewChat] = useState(false);
  const { groupChatRooms, setGroupChatRooms } = useGlobalContext();
  const [selected, setSelected] = useState("");
  const [joinToGroup, setJoinToGroup] = useState(false);

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
        setJoinToGroup(true);
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
      groupChatRooms.forEach((groupChatRoom: GroupMessage) => {
        console.log("joining the room: ", groupChatRoom.group_id);
        socket.current.emit("joinGroupRoom", { group_id: groupChatRoom.group_id });
      });
    }
    return () => {
      groupChatRooms.forEach((groupChatRoom: GroupMessage) => {
        console.log("leaving the room: ", groupChatRoom.group_id);
        socket.current.emit("leaveGroupRoom", { group_id: groupChatRoom.group_id });
      });
    }
  }, [joinToGroup]);

  return (
    <GroupChatListStyle>
      <div className="">
        <h1 className="font-bold sm:text-2xl text-white text-xl flex justify-between">
          Groups
          <Button onClick={() => setNewChat(!newChat)}>New</Button>
        </h1>
            <CreateChannel
              setSelectedGroupChat={setSelectedGroupChat}
              show={newChat}
              setShow={setNewChat}
              socket={socket}
              connected={connected}
            />
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
                  setSelected(props.group_id);
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