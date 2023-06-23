import React from "react";
import Styled from "styled-components";
import ChatList from "../../components/chat/ChatList";
import ChatBox from "../../components/chat/ChatBox";

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { PrivateMessage } from "../../types/message";
import { useGlobalContext } from "../../provider/AppContext";
import { GetJoindChannels, HOSTNAME } from "../../api/axios";
import Cookies from "js-cookie";



import { getAvatarUrl } from "../../components/common/CommonFunc";
import axios from "axios";

const ChatStyle = Styled.div`
  display: flex;
  flex-direction: row;
  height: 95vh;
  width: 100%;
  max-height: 90vh;
  justify-content: flex-start;   
  
  .chat-list {
    /* max-width: 500px; */
    width: 40%;
    max-width: 500px;
    height: 100%;
  }
  
  .chat-box-wrapper {
    margin-top: 20px;
    max-width: 1000px;    
    height: 100%;
    // min-height: 80%;
    width: 60%;
  }
  
  @media screen and (max-width: 766px) {
    min-height: 100%;
    flex-direction: column;
    align-items: center;
    padding-inline: 15px;
    padding-bottom: 10px;
    @media screen and (min-width: 720px) and (max-width: 770px) {
      padding-left: 30px;
    } 
    .chat-list {
      
      width: 100%;
      height: auto;
      max-height: 40%;
      margin: 0 auto;
    }
    
    .chat-box-wrapper {
      width: 100%;
      height: auto;
      min-height: 30vh;
      margin-top: 0;
    }
  }
  @media screen and (max-width: 684px) {
    /* background-color: #f5f5f5; */
    /* margin-right: -20px; */
  }

  @media screen and (min-width: 1500px) {
    justify-content: center;
  }

`;

import { GroupMessage } from "../../types/message";
import GroupChatBox from "../../components/chat/GroupChatBox";
const Chat = () => {
  let chatSocket = useRef(null);
  const [connected, setConnected] = React.useState<boolean>(false);
  const [selectedChat, setSelectedChat] = React.useState<PrivateMessage>(
    {} as PrivateMessage
  );
  const [joinedRooms, setJoinedRooms] = React.useState([] as string[]);
  const [selectedGroupChat, setSelectedGroupChat] = React.useState<GroupMessage>({} as GroupMessage);
  const [newLatestMessage, setNewLatestMessage] = React.useState<{
    chatRoomId: string;
    message: string;
  }>({} as { chatRoomId: string; message: string });
  const { privateChatRooms, groupChatRooms, setChatNotif } = useGlobalContext();
  const [selected, setSelected] = React.useState("");
  const { setGroupChatRooms } = useGlobalContext();


  useEffect(() => {
    // socket connection
    if (!connected) {
      chatSocket.current = io(`http://${HOSTNAME}:3000/chat`);

    }

    chatSocket.current.on('connect', () => {

      // chatSocket.current.emit('alive', {id: Cookies.get("id")});
      setConnected(true);
      chatSocket.current.emit('alive', { id: Cookies.get("id") });
      console.log("connected to the server");
      console.log("groupChatRooms: ", groupChatRooms);
      groupChatRooms.forEach((groupChatRoom: GroupMessage) => {
        console.log("joining the room: ", groupChatRoom.group_id);
        chatSocket.current.emit("joinGroupRoom", { group_id: groupChatRoom.group_id });
        setJoinedRooms(prev => [...prev, groupChatRoom.group_id]);
      });
    });

    chatSocket.current.on("roomJoined", () => {
      console.log("room joined");
    });

    Cookies.set("chatNotif", "0");
    setChatNotif(0);


    // return () => {
    //   console.log("disconnected from the server");
    //   groupChatRooms.forEach((groupChatRoom: GroupMessage) => {
    //     console.log("leaving the room: ", groupChatRoom.group_id);
    //     chatSocket.current.emit("leaveGroupRoom", { group_id: groupChatRoom.group_id });
    //     setJoinedRooms(prev => prev.filter(room => room !== groupChatRoom.group_id));
    //   });
    //   chatSocket.current.disconnect();
    //   setConnected(false);
    // };


  }, []);

  useEffect(() => {
    if (selectedChat.chatRoomid) {
      console.log("joining the room");
      const payload = {
        currentId: Cookies.get("id"),
        senderId: selectedChat.sender_id,
        receiverId: selectedChat.receiver_id,
      };
      chatSocket.current.emit("joinRoom", payload);
    }
    return () => {
      if (selectedChat.chatRoomid) {
        console.log("leaving the room");
        const payload = {
          currentId: Cookies.get("id"),
          senderId: selectedChat.sender_id,
          receiverId: selectedChat.receiver_id,
        };
        chatSocket.current.emit("leaveRoom", payload);

      }
    };
  }, [selectedChat.chatRoomid]);

  useEffect(() => {
    if (!selectedChat.chatRoomid) {
      // console.log("no chat room selected from global context");
      return;
    }
    for (let i = 0; i < privateChatRooms.length; i++) {
      if (privateChatRooms[i].chatRoomid === selectedChat.chatRoomid) {
        return;
      }
    }

    // if there are available chat rooms, select the closest one by date
    if (privateChatRooms.length > 0) {
      let closestChatRoom = privateChatRooms[0];
      let closestDate = new Date(closestChatRoom.latest_message_date);
      for (let i = 1; i < privateChatRooms.length; i++) {
        let date = new Date(privateChatRooms[i].latest_message_date);
        if (date > closestDate) {
          closestChatRoom = privateChatRooms[i];
          closestDate = date;
        }
      }
      // console.log("selecting the closest chat room");
      setSelectedChat(closestChatRoom);
      return;
    } else {
      setSelectedChat({} as PrivateMessage);
    }
  }, [privateChatRooms.length]);


  const { setPrivateChatRooms } = useGlobalContext();
  useEffect(() => {
    if (connected) {
      chatSocket.current.on("newPrivateMessage", (message: any) => {
        const getUser = async (
          sender_id: string,
          receiver_id: string
        ): Promise<{ login: string; avatar: string; status: string }> => {
          const userId =
            sender_id === Cookies.get("id") ? receiver_id : sender_id;
          const url = `http://${HOSTNAME}:3000/api/v1/user/${userId}`;
          const user = await axios.get(
            url
          );
          const avatar = getAvatarUrl();
          return {
            login: user.data.login,
            avatar: avatar,
            status: user.data.status,
          };
        };
        const checkNew = async () => {
          if (
            !privateChatRooms.find(
              (chatRoom: any) => chatRoom.chatRoomid === message.chatRoom_id
            ) &&
            message.sender_id !== Cookies.get("id")
          ) {
            // const login = await getUser(message.sender_id, message.receiver_id).then((user) => user.login);
            // // co
            // const profileImage = await getUser(message.sender_id, message.receiver_id).then((user) => user.profileImage);
            const { login, avatar, status } = await getUser(
              message.sender_id,
              message.receiver_id
            );
            const newPrivatRoom: PrivateMessage = {
              chatRoomid: message.chatRoom_id,
              messageId: message.id,
              sender_id: message.sender_id,
              receiver_id: message.receiver_id,
              lastMessage: message.content,
              lastMessageDate: message.dateCreated,
              seen: message.seen,
              login: login,
              profileImage: avatar,
              blocked: false,
              status: status,
            };
            setPrivateChatRooms((prevState: any) => [
              ...prevState,
              newPrivatRoom,
            ]);
          }
        };
        checkNew();
      });
    }
  }, [connected]);


  useEffect(() => {
    if (connected) {
      console.log("joining the room from global context");
      groupChatRooms.forEach((groupChatRoom: GroupMessage) => {
        console.log("joining the room: ", groupChatRoom.group_id);
        chatSocket.current.emit("joinGroupRoom", { group_id: groupChatRoom.group_id });
        setJoinedRooms(prev => [...prev, groupChatRoom.group_id]);
      });
    }
    return () => {
      if (connected) {
        groupChatRooms.forEach((groupChatRoom: GroupMessage) => {
          console.log("leaving the room: ", groupChatRoom.group_id);
          chatSocket.current.emit("leaveGroupRoom", { group_id: groupChatRoom.group_id });
          setJoinedRooms(prev => prev.filter(room => room !== groupChatRoom.group_id));
        });
      }
    }
  }, [groupChatRooms.length]);

  useEffect(() => {
    if (connected) {
      chatSocket.current.on("newMessageG", (message: any) => {
        console.log("new group message: ", message);
        setSelectedChat({} as PrivateMessage);
        setSelectedGroupChat(message);
        setSelected(message.group_id);
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
      });
    }
    return () => {
      if (connected) {
        chatSocket.current.off("newMessageG");
      }
    }
  }, [connected]);

  // here

  useEffect(() => {
    if (connected) {
      chatSocket.current.on("newChannelAdmin", (message: any) => {
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
      chatSocket.current.on("removeChannelAdmin", (message: any) => {
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
      chatSocket.current.on("muteChannelUser", (message: any) => {
        if (message.id === Cookies.get("id")) {
          const channel = groupChatRooms.find((chat: any) => chat.group_id === message.group_id);
          setSelectedGroupChat({
            ...channel,
            role: "Muted",
          });
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
      chatSocket.current.on("unmuteChannelUser", (message: any) => {
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
      chatSocket.current.on("kickChannelUser", (message: any) => {
        if (message.id === Cookies.get("id")) {
          setSelectedGroupChat({} as GroupMessage);
          setGroupChatRooms((prev: any) => {
            return prev.filter((group: any) => group.group_id !== message.group_id)
          })
        }
      });
      chatSocket.current.on("banChannelUser", (message: any) => {
        if (message.id === Cookies.get('id')) {
          setSelectedGroupChat({} as GroupMessage);
          setGroupChatRooms((prev: any) => {
            return prev.filter((group: any) => group.group_id !== message.group_id)
          })
        }
      });
      chatSocket.current.on("unbanChannelUser", (message: any) => {
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
              setSelectedChat({} as PrivateMessage);
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
      chatSocket.current.on("memberLeaveChannel", (message: any) => {
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
            chatSocket.current.emit("leaveGroupRoom", { group_id: message.group_id });
            chatSocket.current.emit("sendMessageG", {
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
      chatSocket.current.on("channelDeleted", (message: any) => {
        setSelectedGroupChat({} as GroupMessage);
        setGroupChatRooms((prev: any) => {
          return prev.filter((group: any) => group.group_id !== message.group_id)
        })
      });
    }
    return () => {
      chatSocket.current.off("newChannelAdmin");
      chatSocket.current.off("removeChannelAdmin");
      chatSocket.current.off("muteChannelUser");
      chatSocket.current.off("unmuteChannelUser");
      chatSocket.current.off("kickChannelUser");
      chatSocket.current.off("banChannelUser");
      chatSocket.current.off("unbanChannelUser");
      chatSocket.current.off("memberLeaveChannel");
    }
  }, [connected]);

  useEffect(() => {
    if (connected) {
      chatSocket.current.on("channelCreated", (message: any) => {
        console.log("channel created message: ", message);
        setGroupChatRooms((prev: any) => {
          return [...prev, message];
        });
        setSelectedGroupChat(message);
        setSelectedChat({} as PrivateMessage);
        setSelected(message.group_id);
      });
    }
    return () => {
      chatSocket.current.off("channelCreated");
    }
  }), [connected]


  return (
    <ChatStyle>
      <div className="chat-list">
        <ChatList
          setSelectedChat={setSelectedChat}
          newLatestMessage={newLatestMessage}
          setSelectedGroupChat={setSelectedGroupChat}
          socket={chatSocket}
          connected={connected}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
      <div className="chat-box-wrapper">
        {selectedChat.chatRoomid ? (
          <ChatBox

            selectedChat={selectedChat}
            key={selectedChat.chatRoomid}
            size="big"
            setNewLatestMessage={setNewLatestMessage}
            chatSocket={chatSocket}
            connected={connected}
          />
        ) : (
          <GroupChatBox
            selectedGroupChat={selectedGroupChat}
            setSelectedGroupChat={setSelectedGroupChat}
            socket={chatSocket}
            connected={connected}
            key={selectedGroupChat.group_id}
            joinedRooms={joinedRooms}
          />
        )}
      </div>
    </ChatStyle>
  );
};

export default Chat;
