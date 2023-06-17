import styled from "styled-components";

import axios from "axios";
import { useEffect, useState } from "react";

import ChatTab from './ChatTab';
import { PrivateMessage } from '../../types/message';
import { HOSTNAME } from '../../api/axios';
import Cookies from "js-cookie";
import { useGlobalContext } from "../../provider/AppContext";
const UsersChatListStyle = styled.div`
	width: 100%;
	height: 100%;
	background: rgba(217, 217, 217, 0.3);
	border-radius: 25px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const UsersChatList = ({
	setSelectedChat,
	newLatestMessage,
}: {
	setSelectedChat: (chat: PrivateMessage) => void;
	newLatestMessage: { chatRoomId: string; message: string };
}) => {
	// privatChatroom context

	const { privateChatRooms, setPrivateChatRooms } = useGlobalContext();
	const [selected, setSelected] = useState<string>("");

	const getUser = async (
		sender_id: string,
		receiver_id: string
	): Promise<{ login: string; avatar: string; status: string }> => {
		const userId = sender_id === Cookies.get("id") ? receiver_id : sender_id;
		const user = await axios.get(`http://${HOSTNAME}:3000/api/v1/user/${userId}`);
		// cons
		const avatar = getAvatarUrl();
		return { login: user.data.login, avatar: avatar, status: user.data.status };
		// return user.data
	};

	const getPrivateChats = async (limitRoom: string, limitMsg: string) => {
		const Tabs: any = [];
		let id = Cookies.get("id");
		if (!id) return;
		try {
			const privateRooms = await axios.get(
				`http://${HOSTNAME}:3000/api/v1/user/${id}/chatrooms/private?limit=${limitRoom}`
			);
			if (privateRooms.status !== 200)
				throw new Error("Error while fetching private chat rooms");
			await Promise.all(
				privateRooms.data.map(
					async (room: {
						id: string;
						content: string;
						dateCreated: Date;
						seen: boolean;
						blocked: boolean;
					}) => {
						const { id } = room;
						const message = await axios.get(
							`http://${HOSTNAME}:3000/api/v1/chatrooms/private/${id}/messages?limit=${limitMsg}`
						);
						// console.log(

						let user;
						try {
							if (message.data[0] === 0) return;
							user = await getUser(
								message.data[1][0].sender_id,
								message.data[1][0].receiver_id
							);
						} catch (error) {
							console.error(error);
							return;
						}

						// const chattingUserId = message.data[1][0].sender_id === Cookies.get('id') ? message.data[1][0].receiver_id : message.data[1][0].sender_id;

						const data: PrivateMessage = {
							chatRoomid: id,
							messageId: message.data[1][0].id,
							sender_id: message.data[1][0].sender_id,
							receiver_id: message.data[1][0].receiver_id,
							lastMessage: message.data[1][0].content,
							lastMessageDate: message.data[1][0].dateCreated,
							seen: message.data[1][0].seen,
							login: user.login,
							// profileImage: await GetAvatar(chattingUserId),
							profileImage: user.avatar,
							blocked: room.blocked,
							// change this later
							status: user.status,
						};
						Tabs.push(data);
					}
				)
			);
			// filter tabs by date
			Tabs.sort((a: any, b: any) => {
				return (
					new Date(b.lastMessageDate).getTime() -
					new Date(a.lastMessageDate).getTime()
				);
			});
			setPrivateChatRooms(Tabs);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getPrivateChats("5", "1");
	}, []);

	useEffect(() => {
		const newPrivateChatRooms = [...privateChatRooms];
		const index = newPrivateChatRooms.findIndex(
			(chat: PrivateMessage) => chat.chatRoomid === newLatestMessage.chatRoomId
		);
		if (index === -1) return;
		const newChat = newPrivateChatRooms[index];
		newChat.lastMessage = newLatestMessage.message;
		newPrivateChatRooms.splice(index, 1);
		newPrivateChatRooms.unshift(newChat);
		setPrivateChatRooms(newPrivateChatRooms);
	}, [newLatestMessage]);

	useEffect(() => {
		privateChatRooms.length > 0 ? setSelectedChat(privateChatRooms[0]) : null;
		setSelected(privateChatRooms[0]?.chatRoomid);
	}, [privateChatRooms]);

	return (
		<UsersChatListStyle>
			<div className="flex justify-between">
				<h1 className="font-bold sm:text-2xl text-white text-xl">People</h1>
				{/* add newmessage action later */}
			</div>
			<div className="h-px mt-[-10px] shadow-lg bg-[#A8A8A8] w-[99%] mx-auto opacity-60"></div>
			<div className="">
				{privateChatRooms.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full text-center ">
						<div
							className="
                        sm:text-xl text-white max-w-[200px] "
						>
							Your chat history is looking a little empty
						</div>
						<div>
							<div
								className="text-base text-[#A8A8A8] max-w-[200px]
                            "
							>
								make use of the search bar
							</div>
						</div>
					</div>
				) : (
					privateChatRooms.map((props: PrivateMessage) => {
						return (
							<div
								key={props.chatRoomid}
								onClick={() => {
									setSelectedChat(props);
									setSelected(props.chatRoomid);
								}}
							>
								{/* if the chat is currently selected , show the selected style
                                    else show the normal style

                                     */}
								<ChatTab
									privateMessage={props}
									key={props.chatRoomid}
									selected={props.chatRoomid === selected}
								/>
								{/* <ChatTab privateMessage={props} key={props.chatRoomid} selected={false} /> */}
								{/* seperator should show under all compontes excpet the last one */}
								{props.chatRoomid !==
								privateChatRooms[privateChatRooms.length - 1].chatRoomid ? (
									<div
										className="h-px bg-[#B4ABAB] w-[99%] mx-auto mt-1.5 mb-1.5
                                         opacity-60"
									></div>
								) : null}
							</div>
						);
					})
				)}
			</div>
		</UsersChatListStyle>
	);
};

export default UsersChatList;
