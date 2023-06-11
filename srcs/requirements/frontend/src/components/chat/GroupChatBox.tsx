import styled from "styled-components";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { GroupMessage } from "../../types/message";
import axios from "axios";
import GroupChatBoxTopBar from "./GroupChatBoxTopBar";
import GroupSendMessageBox from "./GroupSendMessageBox";



const GroupChatBoxStyle = styled.div`
  background: transparent;
  width: 100%;
  height: 95%;
  display: flex;
  flex-direction: column;
  background: rgba(217, 217, 217, 0.298);
  border-radius: 25px;
  font-size: 1.1rem;
  padding: 20px;

  @media (max-width: 768px) {
    max-height: 74vh;
    padding: 10px;
  }
`;

interface GroupChatBoxProps {
  selectedGroupChat: GroupMessage;
  socket: any;
  connected: boolean;
}

const GroupChatBox = ({
  selectedGroupChat,
  socket,
  connected,
}: GroupChatBoxProps) => {

  const { group_id } = selectedGroupChat;

  return (
    <>
      <GroupChatBoxStyle  id="chat-box">
        {selectedGroupChat.group_id === undefined ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-2xl text-white">nothing to see here</div>
            <div className="text-xl text-white">try selecting a chat</div>
          </div>
        ) : (
            <>
              <div>
                <GroupChatBoxTopBar
                  selectedGroupChat={selectedGroupChat}
                />
                <div className="h-px bg-[#B4ABAB] w-[95%] mx-auto opacity-60"></div>
              </div>
                <GroupSendMessageBox
                  groupId={group_id}
                  socket={socket}
                  connected={connected}
                />
            </>
        )}
      </GroupChatBoxStyle>
    </>
  );
};



export default GroupChatBox;
