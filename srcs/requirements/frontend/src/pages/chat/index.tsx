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
    margin-top: 10px;
    max-width: 1000px;    
    height: 98.5%;
    // min-height: 80%;
    width: 60%;
  }
  
  @media screen and (max-width: 766px) {
    min-height: 100%;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding-inline: 15px;
    padding-bottom: 10px;
    @media screen and (min-width: 720px) and (max-width: 770px) {
      padding-left: 30px;
    } 
    .chat-list {
      
      width: 100%;
      height: 50%;
      margin: 0 auto;
    }
    
    .chat-box-wrapper {
      width: 100%;
      height: 50%;      
      /* min-height: 30vh; */
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
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // socket connection
    if (!connected) {
      chatSocket.current = io(`http://${HOSTNAME}:3000/chat`);

    }

    chatSocket.current.on('connect', () => {

      // chatSocket.current.emit('alive', {id: Cookies.get("id")});
      setConnected(true);
      chatSocket.current.emit('alive', { id: Cookies.get("id") });

      getGroupChatRooms().then((res: any) => {
        setGroupChatRooms(res);
        res.forEach((groupChatRoom: GroupMessage) => {
          chatSocket.current.emit("joinGroupRoom", { group_id: groupChatRoom.group_id });
          setJoinedRooms(prev => [...prev, groupChatRoom.group_id]);
        });
      }).catch(err => {
        console.log(err);
      });



      // groupChatRooms.forEach((groupChatRoom: GroupMessage) => {
      //   console.log("joining the room: ", groupChatRoom.group_id);
      //   chatSocket.current.emit("joinGroupRoom", { group_id: groupChatRoom.group_id });
      //   setJoinedRooms(prev => [...prev, groupChatRoom.group_id]);
      // });
    });


    Cookies.set("chatNotif", "0");
    setChatNotif(0);


    return () => {
      groupChatRooms.forEach((groupChatRoom: GroupMessage) => {
        chatSocket.current.emit("leaveGroupRoom", { group_id: groupChatRoom.group_id });
        setJoinedRooms(prev => prev.filter(room => room !== groupChatRoom.group_id));
      });
      chatSocket.current.disconnect();
      setConnected(false);
    };


  }, []);

  useEffect(() => {
    if (selectedChat.chatRoomid) {
      const payload = {
        currentId: Cookies.get("id"),
        senderId: selectedChat.sender_id,
        receiverId: selectedChat.receiver_id,
      };
      chatSocket.current.emit("joinRoom", payload);
    }
    return () => {
      if (selectedChat.chatRoomid) {
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
          const avatar = user.data.avatar;
          return {
            login: user.data.login,
            avatar: avatar,
            status: user.data.status,
          };
        };
        const getUserFunc = async () => {
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
          setPrivateChatRooms((prevState: any) => {
            const index = prevState.findIndex((chatRoom: PrivateMessage) => chatRoom.chatRoomid === message.chatRoom_id);
            if (index === -1) {
              return [newPrivatRoom, ...prevState];
            }
            const newPrivateChatRooms = [...prevState];
            newPrivateChatRooms[index].lastMessage = message.content;
            newPrivateChatRooms[index].lastMessageDate = message.dateCreated;
            return newPrivateChatRooms;
          });
          setSelected(newPrivatRoom.chatRoomid);
        };
        getUserFunc();
      });

    }
  }, [connected]);


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
      chatSocket.current.on("unmuteChannelUser", (message: any) => {
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
      if (connected) {
        chatSocket.current.off("muteChannelUser");
        chatSocket.current.off("unmuteChannelUser");
        chatSocket.current.off("kickChannelUser");
        chatSocket.current.off("banChannelUser");
        chatSocket.current.off("unbanChannelUser");
        chatSocket.current.off("memberLeaveChannel");
        chatSocket.current.off("channelDeleted");
        chatSocket.current.off("newGroupMessage");
      }
    }
  }, [connected && groupChatRooms.length !== 0]);


  // useEffect(() => {
  //   if (connected) {

  //   }
  //   // return () => {
  //   //   chatSocket.current.off("newGroupMessage");
  //   // }
  // }, [connected]);

  useEffect(() => {
    if (connected) {
      chatSocket.current.on("channelCreated", (message: any) => {
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
    <ChatStyle className="">
      <div className="chat-list  h-full">
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
      <div className="chat-box-wrapper ">
        {selectedChat.chatRoomid ? (
          <ChatBox
            setSelectedChat={setSelectedChat}
            selectedChat={selectedChat}
            key={selectedChat.chatRoomid}
            size="big"
            setNewLatestMessage={setNewLatestMessage}
            chatSocket={chatSocket}
            connected={connected}
            selectedGroupChat={selectedGroupChat}
            setSelectedGroupChat={setSelectedGroupChat}
            setSelected={setSelected}
          />
        ) : (
          <GroupChatBox
            selectedGroupChat={selectedGroupChat}
            setSelectedGroupChat={setSelectedGroupChat}
            socket={chatSocket}
            connected={connected}
            key={selectedGroupChat.group_id}
            joinedRooms={joinedRooms}
            setSelected={setSelected}
          />
        )}
      </div>
    </ChatStyle>
  );
};

export default Chat;
