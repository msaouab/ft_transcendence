import styled from "styled-components";
import { useEffect } from "react";
import { GroupMessage, GroupSingleMessage } from "../../types/message";
import React from 'react';
import GroupChatBoxTopBar from "./GroupChatBoxTopBar";
import GroupSendMessageBox from "./GroupSendMessageBox";
import { GetChannelMessages } from "../../api/axios";
import GroupChatInfiniteScroll from "./GroupChatInfiniteScroll";
import { useGlobalContext } from "../../provider/AppContext";



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
  let intialState = {
    messages: [] as GroupSingleMessage[],
    hasMore: true,
    offset: 0,
    totalMessages: 0,
  };

  const { setGroupChatRooms } = useGlobalContext();
  const { group_id } = selectedGroupChat;
  const [totalMessages, setTotalMessages] = React.useState(0);
  const [state, setState] = React.useState(intialState);
  const { messages, hasMore, offset } = state;
  let limit = 20;


  const getMessages = async (currentChat: any) => {
    if (!selectedGroupChat.group_id) {
      return [];
    }
    let res = await GetChannelMessages(currentChat.group_id, limit, offset);
    setTotalMessages(res.count);
    return res.messages;
  };

  const next = () => {
    getMessages(selectedGroupChat).then((newMessages) => {
      setState((prevState) => ({
        ...prevState,
        messages: [...prevState.messages, ...newMessages],
        offset: prevState.offset + newMessages.length,
        hasMore: totalMessages > prevState.offset + newMessages.length
      }));
    })
  };

  useEffect(() => {
    getMessages(selectedGroupChat).then((messages) => {
      if (messages.length == 0
        || (messages[0] && selectedGroupChat.group_id !== messages[0].group_id)) {
        setState({
          messages: messages,
          hasMore: messages.length < totalMessages,
          offset: messages.length,
          totalMessages: totalMessages,
        });
      }
      else {
        setState((prevState) => ({
          ...prevState,
          messages: [...prevState.messages, ...messages],
          offset: prevState.offset + messages.length,
          hasMore: true,
        }));
      }
    });
  }, [selectedGroupChat.group_id]);

  useEffect(() => {
    if (connected) {
      socket.current.on("newGroupMessage", (data: any) => {
        const getNewMessage = async () => {
          const newMessage = await GetChannelMessages(selectedGroupChat.group_id, 1, 0);
          return newMessage.messages[0];
        }
        getNewMessage().then((newMessage) => {
          setState((prevState) => ({
            ...prevState,
            messages: [newMessage, ...prevState.messages],
          }));
        })
        setGroupChatRooms(prev => {
          const index = prev.findIndex((group: GroupMessage) => group.group_id === data.receiver_id);
          const newGroupChatRooms = [...prev];
          newGroupChatRooms[index].lastMessage = data.content;
          newGroupChatRooms[index].lastMessageDate = data.dateCreated;
          return newGroupChatRooms;
        })
      });
    }
    return () => {
      socket.current.off("newGroupMessage");
    }
  }, [connected]);

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
              <GroupChatBoxTopBar selectedGroupChat={selectedGroupChat} />
              <div className="h-px bg-[#B4ABAB] w-[95%] mx-auto opacity-60"></div>
            </div>
            <GroupChatInfiniteScroll
              messages={messages}
              hasMore={hasMore}
              next={next}
            />
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
