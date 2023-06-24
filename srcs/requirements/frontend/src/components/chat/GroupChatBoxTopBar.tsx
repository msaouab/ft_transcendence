import styled from "styled-components";
import { GroupMessage } from "../../types/message";
import { useEffect, useState } from "react";
import ChannelInfo from "./ChannelInfo";
import { GetChannelInfo } from '../../api/axios';
import Cookies from 'js-cookie';
import { channel } from "diagnostics_channel";

const GroupChatBoxTopBarStyle = styled.div`
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
    margin-right: 0;
  }
  .info {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
  }
`;

const GroupChatBoxTopBar = ({
  selectedGroupChat,
  setSelectedGroupChat,
  socket,
  connected,
}: {
  selectedGroupChat: GroupMessage;
  setSelectedGroupChat: (chat: GroupMessage) => void;
  socket: any;
  connected: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [subscribers, setSubscribers] = useState(0);
  const [channel, setChannel] = useState<any>(null);

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
      console.log("channel subscribers", res);
      setChannel(res.channel);
      setSubscribers(res.subscribers.length);
    }).catch(err => console.log(err));
  }

  useEffect(() => {
    getChannelInfo();
  }, [selectedGroupChat.group_id])


  return (
    <GroupChatBoxTopBarStyle>
      <div className="info" onClick={() => setOpen(true)}>
        <div className="">
          <img
            src={selectedGroupChat.profileImage}
            alt="profile"
            className="rounded-full w-10 h-10"
          />
        </div>
        <div className="flex flex-col  ml-2 font-black ">
          <div className="chat-box-top-bar__info__name font-black ">
            <h3>{selectedGroupChat.name}</h3>
          </div>
          <div className="chat-box-top-bar__info__status text-xs font-thin opacity-50 text-[#E9D990] ">
            {
              channel && (
                subscribers === 1 ? `${subscribers} subscriber` : `${subscribers} subscribers`
              )
            }
          </div>
        </div>
      </div>
      {
        open && (<ChannelInfo open={open} setOpen={setOpen} selectedGroupChat={selectedGroupChat} setSelectedGroupChat={setSelectedGroupChat} socket={socket}
          connected={connected} />)
      }
    </GroupChatBoxTopBarStyle>
  );
};

export default GroupChatBoxTopBar;
