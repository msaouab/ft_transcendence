import styled from "styled-components";
import { GroupMessage } from "../../types/message";
import { CiCircleMore } from "react-icons/ci";
import { useState } from "react";
import ChannelInfo from "./ChannelInfo";

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
            1 subscriber
          </div>
        </div>
      </div>
      <div className="relative">
        <CiCircleMore size={30} />
      </div>
      {
        open && (<ChannelInfo open={open} setOpen={setOpen} selectedGroupChat={selectedGroupChat} setSelectedGroupChat={setSelectedGroupChat} socket={socket}
          connected={connected} />)
      }
    </GroupChatBoxTopBarStyle>
  );
};

export default GroupChatBoxTopBar;
