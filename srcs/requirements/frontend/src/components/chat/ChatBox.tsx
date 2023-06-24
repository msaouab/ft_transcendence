import styled from "styled-components";
import React from "react";
// import socket from '../../socket';
import { useEffect } from "react";
import Cookies from "js-cookie";
import { GetJoindChannels } from "../../api/axios";


const ChatBoxStyle = styled.div`
	background: transparent;
	width: 100%;
	height: ${(props) => (props.size === "small" ? "100%" : "95%")};
	display: flex;
	flex-direction: column;
	background: ${(props) =>
		props.size === "small" ? "black" : " rgba(217, 217, 217, 0.298)"};
	border-radius: ${(props) =>
		props.size === "small" ? "10px 10px 0px 0px" : "25px"};
	font-size: ${(props) => (props.size === "small" ? "0.8rem" : "1.1rem")};
	padding: 20px;

	@media (max-width: 768px) {
		max-height: 74vh;
		// height: 100%;
		padding: 10px;
	}
`;

import { useGlobalContext } from "../../provider/AppContext";
import { GroupMessage, PrivateMessage } from "../../types/message";
import { singleMessage } from "../../types/message";
// components
import ChatBoxTopBar from "./ChatBoxToBar";
import SendMessageBox from "./SendMessageBox";
import axios from "axios";
import ChatInfiniteScroll from "./ChatInfiniteScroll";
// import { GetAvatar } from "../../api/axios";
import { getAvatarUrl } from "../common/CommonFunc";
import { HOSTNAME } from "../../api/axios";

const ChatBox = ({
	selectedChat,
	size,
	setNewLatestMessage,
	chatSocket,
	connected,
	selectedGroupChat,
    setSelectedGroupChat,
	setSelectedChat,

}: {
	selectedChat: PrivateMessage;
	size: string;
	setNewLatestMessage?: any;
	chatSocket: any;
	connected: boolean;

	selectedGroupChat: GroupMessage;
	setSelectedGroupChat: any;
	setSelectedChat: any;
	


}) => {
	let initialState = {
		messages: [] as singleMessage[],
		hasMore: true,
		offset: 0,
		totalMessages: 0,
	};

	const { privateChatRooms, setPrivateChatRooms, groupChatRooms, setGroupChatRooms } = useGlobalContext();

	const updateSeenStatus = (messages: singleMessage[]) => {
		messages.forEach((message: any) => {
			if (message.seen === false && message.sender_id !== Cookies.get("id")) {
				const url = `http://${HOSTNAME}:3000/api/v1/chatrooms/private/${message.chatRoom_id}/message/${message.id}`; 
                axios
					.put(
						url,
						{
							seen: true,
						}
					)
					.then((response) => {
						if (response.status !== 200) {
							alert("error updating the seen status of the messages");
						}
					})
					.catch((error) => {
						console.log("error", error);
					});
			}
		});
	};

	

	useEffect(() => {
		console.log("chatbox useeffect");
		if (connected) {
			console.log("chatbox useeffect connected");
			chatSocket.current.on("newPrivateMessage", (message: any) => {
				// console.log("new private message", message);
				// // if privatechatroom doesn't exist yet in the list of privatechatrooms, add it
				// const getUser = async (
				// 	sender_id: string,
				// 	receiver_id: string
				// ): Promise<{ login: string; avatar: string; status: string }> => {
				// 	const userId =
				// 		sender_id === Cookies.get("id") ? receiver_id : sender_id;
                //     const url = `http://${HOSTNAME}:3000/api/v1/user/${userId}`;
				// 	const user = await axios.get(
				// 		url
				// 	);
				// 	const avatar = getAvatarUrl();
				// 	return {
				// 		login: user.data.login,
				// 		avatar: avatar,
				// 		status: user.data.status,
				// 	};
				// };
				// // getPrivateRoom(message.chatRoom_id).then((privateRoom) => {
				// const checkNew = async () => {
				// 	if (
				// 		!privateChatRooms.find(
				// 			(chatRoom: any) => chatRoom.chatRoomid === message.chatRoom_id
				// 		) &&
				// 		message.sender_id !== Cookies.get("id")
				// 	) {
				// 		// const login = await getUser(message.sender_id, message.receiver_id).then((user) => user.login);
				// 		// // co
				// 		// const profileImage = await getUser(message.sender_id, message.receiver_id).then((user) => user.profileImage);
				// 		const { login, avatar, status } = await getUser(
				// 			message.sender_id,
				// 			message.receiver_id
				// 		);
				// 		const newPrivatRoom: PrivateMessage = {
				// 			chatRoomid: message.chatRoom_id,
				// 			messageId: message.id,
				// 			sender_id: message.sender_id,
				// 			receiver_id: message.receiver_id,
				// 			lastMessage: message.content,
				// 			lastMessageDate: message.dateCreated,
				// 			seen: message.seen,
				// 			login: login,
				// 			profileImage: avatar,
				// 			blocked: false,
				// 			status: status,
				// 		};
				// 		setPrivateChatRooms((prevState: any) => [
				// 			...prevState,
				// 			newPrivatRoom,
				// 		]);
				// 	}
				// };
				// checkNew();
				setState((prevState: any) => ({
					...prevState,
					messages: [message, ...prevState.messages],
				}));
				updateSeenStatus([message]);
			});
		}
		// return () => {
		// 	chatSocket.current.off("newPrivateMessage");
		// };
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

			chatSocket.current.on("newMessageG", (message: any) => {
				setSelectedChat({} as PrivateMessage);
				setSelectedGroupChat(message);
				// setSelected(message.group_id);
				setGroupChatRooms(prev => {
					const index = prev.findIndex((group: GroupMessage) => group.group_id === message.group_id);
					if (index === -1) {
						return [message, ...prev];
					}
					return prev;
				});
			});

			chatSocket.current.on("newGroupMessage", (data: any) => {
				// console.log("jkadhsjkdhsakjldsaklsd", data);
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
				// setSelected(data.group_id);
				setSelectedGroupChat(data);
			});
		}
		return () => {
			if (connected) {
				// groupChatRooms.forEach((group: any) => {
				// 	chatSocket.current.emit("leaveGroupRoom", { group_id: group.group_id });
				// });
				chatSocket.current.off("newMessage");
				chatSocket.current.off("newMessageG");
				chatSocket.current.off("newGroupMessage");
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
	}, [connected]);

	const { chatRoomid } = selectedChat;
	const [totalMessages, setTotalMessages] = React.useState(0);
	const [state, setState] = React.useState(initialState);
	const { messages, hasMore, offset } = state;
	let limit = 20;

	const getMessages = async (currentChat: any) => {
		if (!selectedChat.chatRoomid) {
			return [];
		}
		// making the url dynamic
		const url = `http://${HOSTNAME}:3000/api/v1/chatrooms/private/${currentChat.chatRoomid}/messages?limit=${limit}&offset=${offset}`;
        let responseMessages = await axios.get(
			url
		);
		setTotalMessages(responseMessages.data[0]);
		updateSeenStatus(responseMessages.data[1]);
		return responseMessages.data[1];
	};

	const next = () => {
		getMessages(selectedChat).then((newMessages) => {
			setState((prevState) => ({
				...prevState,
				messages: [...prevState.messages, ...newMessages],
				offset: prevState.offset + newMessages.length,
				hasMore: totalMessages > prevState.offset + newMessages.length,
			}));
		});
	};

	useEffect(() => {
		getMessages(selectedChat).then((messages) => {
			if (
				messages.length == 0 ||
				(messages[0] && selectedChat.chatRoomid !== messages[0].chatRoom_id)
			) {
				setState({
					messages: messages,
					hasMore: messages.length < totalMessages,
					offset: messages.length,
					totalMessages: totalMessages,
				});
			} else {
				setState((prevState) => ({
					...prevState,
					messages: [...prevState.messages, ...messages],
					offset: prevState.offset + messages.length,
					hasMore: true,
				}));
			}
		});
	}, [selectedChat.chatRoomid]);

	return (
		<ChatBoxStyle size={size} id="chat-box">
			{selectedChat.sender_id === undefined &&
			selectedChat.receiver_id === undefined ? (
				<div className="flex flex-col items-center justify-center h-full">
					<div className="text-2xl text-white">nothing to see here</div>
					<div className="text-xl text-white">try selecting a chat</div>
				</div>
			) : (
				<>
					<div>
						<ChatBoxTopBar
							login={selectedChat.login}
							profileImage={selectedChat.profileImage}
							status={selectedChat.status}
							id={
								selectedChat.sender_id === Cookies.get("id")
									? selectedChat.receiver_id
									: selectedChat.sender_id
							}
							chatRoomId={chatRoomid}
							size={size}
							blocked={selectedChat.blocked}
						/>
						<div className="h-px bg-[#B4ABAB] w-[95%] mx-auto opacity-60"></div>
					</div>
					<ChatInfiniteScroll
						messages={messages}
						next={next}
						hasMore={hasMore}
						setState={setState}
					/>
					<SendMessageBox
						selectedChat={selectedChat}
						socket={chatSocket}
						connected={connected}
						setNewLatestMessage={setNewLatestMessage}
						size={size}
					/>
				</>
			)}
		</ChatBoxStyle>
	);
};

export default ChatBox;

/* 
                when clicked, opening a websocket connection to the server 
                and sending the user id to the server
                the server will send back the messages between the two users
                and the client will display them
                also we need to fetch old messages

*/
