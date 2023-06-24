import styled from "styled-components";
import { useEffect } from "react";
import { GroupMessage, GroupSingleMessage } from "../../types/message";
import React from 'react';
import GroupChatBoxTopBar from "./GroupChatBoxTopBar";
import GroupSendMessageBox from "./GroupSendMessageBox";
import { GetChannelMessages } from "../../api/axios";
import GroupChatInfiniteScroll from "./GroupChatInfiniteScroll";
import { useGlobalContext } from "../../provider/AppContext";
import Cookies from 'js-cookie';
import { GetJoindChannels } from "../../api/axios";


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
  setSelectedGroupChat: (chat: GroupMessage) => void;
  socket: any;
  connected: boolean;
  joinedRooms: string[];
}

const GroupChatBox = ({
  selectedGroupChat,
  setSelectedGroupChat,
  socket,
  connected,
  joinedRooms,
}: GroupChatBoxProps) => {
  let intialState = {
    messages: [] as GroupSingleMessage[],
    hasMore: true,
    offset: 0,
    totalMessages: 0,
  };

  const { group_id } = selectedGroupChat;
  const [totalMessages, setTotalMessages] = React.useState(0);
  const [state, setState] = React.useState(intialState);
  const { messages, hasMore, offset } = state;
  const { setGroupChatRooms, groupChatRooms } = useGlobalContext();
  let limit = 20;


  const getMessages = async () => {
    if (!selectedGroupChat.group_id) {
      return [];
    }
    let res = await GetChannelMessages(group_id, limit, offset);
    setTotalMessages(res.count);
    return res.messages;
  };

  useEffect(() => {
    if (connected && !joinedRooms.includes(selectedGroupChat.group_id)) {
      socket.current.emit("joinGroupRoom", { group_id: selectedGroupChat.group_id });
    }
  }, [selectedGroupChat.group_id]);

  const next = () => {
    getMessages().then((newMessages) => {
      setState((prevState) => {
        const allMessages = [...prevState.messages, ...newMessages];
        const uniqueMessages = allMessages.filter(
          (message, index, self) =>
            index ===
            self.findIndex(
              (m) => m.id === message.id && m.group_id === message.group_id
            )
        );

        return {
          ...prevState,
          messages: uniqueMessages,
          offset: prevState.offset + newMessages.length,
          hasMore: totalMessages > prevState.offset + newMessages.length,
        };
      });
    });
  };

  useEffect(() => {
    getMessages().then((messages) => {
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
        console.log("new group message from GroupChatBox: ", data);
        setGroupChatRooms(prev => {
          const index = prev.findIndex((group: GroupMessage) => group.group_id === data.group_id);
          if (index === -1) {
            return [data, ...prev];
          }
          const newGroupChatRooms = [...prev];
          newGroupChatRooms[index].lastMessage = data.lastMessage;
          newGroupChatRooms[index].lastMessageDate = data.lastMessageDate;
          return newGroupChatRooms;
        });
        if (selectedGroupChat.group_id === data.group_id) {
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
        }
        else {
          setSelectedGroupChat(data);
        }
      });
    }
    return () => {
      socket.current.off("newGroupMessage");
    }
  }, [connected]);

  useEffect(() => {
    if (connected) {
      socket.current.on("newMessageG", (message: any) => {
        setSelectedGroupChat(message);
        setGroupChatRooms(prev => {
          const index = prev.findIndex((group: GroupMessage) => group.group_id === message.group_id);
          if (index === -1) {
            return [message, ...prev];
          }
          const newGroupChatRooms = [...prev];
          newGroupChatRooms[index].lastMessage = message.lastMessage;
          newGroupChatRooms[index].lastMessageDate = message.lastMessageDate;
          return newGroupChatRooms;
        });
        if (selectedGroupChat.group_id === message.group_id) {
          const getNewMessage = async () => {
            const newMessage = await GetChannelMessages(selectedGroupChat.group_id, 1, 0);
            return newMessage.messages[0];
          }
          getNewMessage().then((newMessage) => {
            setState((prevState) => ({
              ...prevState,
              messages: [newMessage, ...prevState.messages],
            }));
          });
        }
      });
    }
    return () => {
      socket.current.off("newMessageG");
    }
  }, [connected]);


  useEffect(() => {
    if (connected) {
      socket.current.on("newChannelAdmin", (message: any) => {
        if (message.id === Cookies.get("id")) {
          const channel = groupChatRooms.find((chat: any) => chat.group_id === message.group_id);
          setSelectedGroupChat({
            ...channel,
            role: "Admin",
          });
          setGroupChatRooms((prev: any) => {
            return prev.map((chat: any) => {
              if (chat.group_id === message.group_id) {
                return { ...chat, role: "Admin" }
              }
              return chat;
            })
          });
        }
      });
      socket.current.on("removeChannelAdmin", (message: any) => {
        if (message.id === Cookies.get("id")) {
          const channel = groupChatRooms.find((chat: any) => chat.group_id === message.group_id);
          setSelectedGroupChat({
            ...channel,
            role: "Member",
          });
          setGroupChatRooms((prev: any) => {
            return prev.map((chat: any) => {
              if (chat.group_id === message.group_id) {
                return { ...chat, role: "Member" }
              }
              return chat;
            })
          });
        }
      });
      socket.current.on("muteChannelUser", (message: any) => {
        if (message.id === Cookies.get("id")) {
          const channel = groupChatRooms.find((chat: any) => chat.group_id === message.group_id);
          if (selectedGroupChat.group_id === message.group_id) {
            setSelectedGroupChat({
              ...channel,
              role: "Muted",
            });
          }
          setGroupChatRooms((prev: any) => {
            return prev.map((chat: any) => {
              if (chat.group_id === message.group_id) {
                return { ...chat, role: "Muted" }
              }
              return chat;
            })
          });
        }
      });
      socket.current.on("unmuteChannelUser", (message: any) => {
        if (message.id === Cookies.get("id")) {
          const channel = groupChatRooms.find((chat: any) => chat.group_id === message.group_id);
          if (selectedGroupChat.group_id === message.group_id) {
            setSelectedGroupChat({
              ...channel,
              role: "Member",
            });
          }
          setGroupChatRooms((prev: any) => {
            return prev.map((chat: any) => {
              if (chat.group_id === message.group_id) {
                return { ...chat, role: "Member" }
              }
              return chat;
            })
          });
        }
      });
      socket.current.on("kickChannelUser", (message: any) => {
        if (message.id === Cookies.get("id")) {
          setSelectedGroupChat({} as GroupMessage);
          setGroupChatRooms((prev: any) => {
            return prev.filter((group: any) => group.group_id !== message.group_id)
          })
        }
      });
      socket.current.on("banChannelUser", (message: any) => {
        if (message.id === Cookies.get('id')) {
          setSelectedGroupChat({} as GroupMessage);
          setGroupChatRooms((prev: any) => {
            return prev.filter((group: any) => group.group_id !== message.group_id)
          })
        }
      });
      socket.current.on("unbanChannelUser", (message: any) => {
        if (message.id === Cookies.get('id')) {
          try {
            const getJoindChannels = async () => {
              const channels = await GetJoindChannels(message.id);
              const res = await Promise.all(
                channels.map(async (channel: any) => {
                  return { ...channel };
                })
              );
              return res;
            };
            getJoindChannels().then((res) => {
              const channel = res.find((chat: any) => chat.group_id === message.group_id);
              // setSelectedChat({} as PrivateMessage);
              setSelectedGroupChat(channel);
              setGroupChatRooms(res);
            }).catch((err) => {
              console.log(err);
            });
          }
          catch (err) {
            console.log(err);
          }
        }
      });
      socket.current.on("memberLeaveChannel", (message: any) => {
        try {
          if (message.id === Cookies.get('id')) {
            console.log("member leave channel message: ", groupChatRooms);
            setSelectedGroupChat({} as GroupMessage);
            let channel: GroupMessage = {} as GroupMessage;
            setGroupChatRooms((prev: any) => {
              return prev.filter((group: any) => {
                if (group.group_id !== message.group_id) {
                  return { ...group };
                }
                channel = { ...group };
                return false;
              })
            })
            socket.current.emit("leaveGroupRoom", { group_id: message.group_id });
            socket.current.emit("sendMessageG", {
              ...channel,
              sender_id: channel.group_id,
              lastMessage: `${message.login} has left the channel`,
              lastMessageDate: new Date().toISOString(),
              role: "Server",

            });
          }
        } catch (err) {
          console.log(err);
        }
      });
      socket.current.on("channelDeleted", (message: any) => {
        setSelectedGroupChat({} as GroupMessage);
        setGroupChatRooms((prev: any) => {
          return prev.filter((group: any) => group.group_id !== message.group_id)
        })
      });
    }
    return () => {
      socket.current.off("newChannelAdmin");
      socket.current.off("removeChannelAdmin");
      socket.current.off("muteChannelUser");
      socket.current.off("unmuteChannelUser");
      socket.current.off("kickChannelUser");
      socket.current.off("banChannelUser");
      socket.current.off("unbanChannelUser");
      socket.current.off("memberLeaveChannel");
      socket.current.off("channelDeleted");
    }
  }, [connected]);

  return (
    <>
      <GroupChatBoxStyle id="chat-box">
        {selectedGroupChat.group_id === undefined ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-2xl text-white">nothing to see here</div>
            <div className="text-xl text-white">try selecting a chat</div>
          </div>
        ) : (
          <>
            <div>
              <GroupChatBoxTopBar selectedGroupChat={selectedGroupChat} setSelectedGroupChat={setSelectedGroupChat} socket={socket}
                connected={connected} />
              <div className="h-px bg-[#B4ABAB] w-[95%] mx-auto opacity-60"></div>
            </div>
            <GroupChatInfiniteScroll
              messages={messages}
              hasMore={hasMore}
              next={next}
            />
            {
              selectedGroupChat.role !== "Muted" && (
                <GroupSendMessageBox
                  selectedGroupChat={selectedGroupChat}
                  socket={socket}
                  connected={connected}
                />
              )
            }
          </>
        )}
      </GroupChatBoxStyle>
    </>
  );
};



export default GroupChatBox;
