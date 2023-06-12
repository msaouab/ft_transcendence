import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import { CiPaperplane, CiChat1 } from "react-icons/ci";
import Cookies from "js-cookie";
import { GroupMessage } from '../../types/message';
import { useGlobalContext } from '../../provider/AppContext';

const GroupSendMessageBoxStyle = styled.div`
  width: 100%;
  height: 2.5rem;
  min-height: 60px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: rgba(217, 217, 217, 0.3);
  border-radius: 25px;
  padding: 20px;
  color: #fff;

  input {
    background-color: transparent;
    border: none;
    flex: 1;
    margin-left: 10px;
  }
  input:focus {
    outline: none;
  }

  .message-icon {
    align-self: center;
    color: #ffff;
  }

  .send-icon {
    align-self: center;
    color: #ffff;
    cursor: pointer;
  }

  @media (max-width: 400px) {
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
    .message-icon {
        display: none;
    }
    input {
        margin-left: 0px;
    }
  }
`;

interface GroupSendMessageBoxProps {
  groupId: string;
  socket: any;
  connected: boolean;
}

const GroupSendMessageBox = ({
  groupId,
  socket,
  connected,
}: GroupSendMessageBoxProps) => {
  const [message, setMessage] = useState<string>("");

  const sendMessage = () => {
    if (message.trim() === "") return;

    const userId = Cookies.get("id");
    if (!userId) return;

    if (connected) {
      socket.current.emit("sendGroupMessage", {
        group_id: groupId,
        sender_id: userId,
        lastMessage: message,
      });
    }
    setMessage("");
  };

  return (
    <GroupSendMessageBoxStyle >
      <div className="message-icon text-white">
        <CiChat1 size={30} color="#ffff" />
      </div>
      <form
        className="flex flex-row flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          type="text"
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
      </form>
      <div className="send-icon">
        <a href="#" onClick={() => sendMessage()}>
          <CiPaperplane size={30} color="#ffff" />
        </a>
      </div>
    </GroupSendMessageBoxStyle>
  );
};

export default GroupSendMessageBox