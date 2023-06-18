import styled from "styled-components";
import { CiPaperplane, CiChat1 } from "react-icons/ci";
import { useState } from "react";

import Cookies from "js-cookie";
import { dateToStr } from "../common/CommonFunc";

import { useGlobalContext } from "../../provider/AppContext";
import ConfirmDelete from "../common/ConfirmDelete";
import axios from "axios";
import { HOSTNAME } from "../../api/axios";
const SendMessageBoxStyle = styled.div`
	width: 100%;
	/* height: 8%; */
	height: ${(props: { size: any }) =>
		props.size === "small" ? `1rem` : `2.5rem`};

	min-height: ${(props: { size: any }) =>
		props.size === "small" ? `1rem` : `60px`};

	/* max-height: 60px; */
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
		${(props: { size: any }) =>
			props.size === "big"
				? `
        padding: 5px;
        padding-left: 10px;
        padding-right: 10px;
    

        .message-icon {
            display: none;
        }
        input {
            margin-left: 0px;
        }
        `
				: ``}
	}
`;

const SendMessageBox = ({
	selectedChat,
	socket,
	connected,
	setNewLatestMessage,
	size,
}: {
	selectedChat: any;
	socket: any;
	connected: boolean;
	setNewLatestMessage: any;
	size: string;
}) => {
	const [message, setMessage] = useState<string>("");

	const [confirmData, setConfirmData] = useState<any>({
		show: false,
		title: "Message not sent",
		message: "you cannot send a message to this user at the moment",
		actionName: "",
		confirm: () => {
			setConfirmData({
				...confirmData,
				show: false,
			});
		},
	});

	const { setPrivateChatRooms } = useGlobalContext();

	const sendMessage = async (messageProp: string) => {
		// if the user is blocked, don't send the message
		// console.log(selectedChat);
		if (selectedChat.blocked) {
			setConfirmData({
				...confirmData,
				show: true,
			});
			setMessage("");
			return;
		}
		const myId = Cookies.get("id");
		const otherUserId =
			selectedChat.sender_id === myId
				? selectedChat.receiver_id
				: selectedChat.sender_id;

		const userBlocks = await axios.get(
			`http://${HOSTNAME}:3000/api/v1/user/${myId}/blockedusers/${otherUserId}`
		);
		if (userBlocks.data.length > 0) {
			setConfirmData({
				...confirmData,
				show: true,
			});
			setMessage("");
			setPrivateChatRooms((prev) => {
				const index = prev.findIndex(
					(chatRoom: any) => chatRoom.chatRoomid === selectedChat.chatRoomid
				);
				if (index === -1) {
					return [...prev, selectedChat];
				} else {
					return [...prev];
				}
			});
			return;
		}

		// ge

		if (messageProp === "") {
			return;
		}

		let message = {
			dateCreated: dateToStr(new Date()),
			content: messageProp,
			seen: false,
			chatRoom_id: selectedChat.chatRoomid,
			sender_id: Cookies.get("id"),
			receiver_id:
				selectedChat.sender_id === Cookies.get("id")
					? selectedChat.receiver_id
					: selectedChat.sender_id,
		};
		if (connected) {
			socket.current.emit("sendPrivateMessage", message);
			setMessage("");

			if (setNewLatestMessage) {
				setNewLatestMessage({
					chatRoomId: selectedChat.chatRoomid,
					message: message.content,
				});
			}
			const newPrivateChatRoom = {
				...selectedChat,
				lastMessage: message.content,
				lastMessageDate: Date.now(),
			};

			setPrivateChatRooms((prev) => {
				const index = prev.findIndex(
					(chatRoom: any) => chatRoom.chatRoomid === selectedChat.chatRoomid
				);
				if (index === -1) {
					return [...prev, newPrivateChatRoom];
				} else {
					prev[index] = newPrivateChatRoom;
					return [...prev];
				}
			});
		}
	};

	return (
		<SendMessageBoxStyle size={size}>
			<div className="message-icon text-white">
				<CiChat1 size={30} color="#ffff" />
			</div>
			<form
				className="flex flex-row flex-1"
				onSubmit={(e) => {
					e.preventDefault();
					sendMessage(message);
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
				<a href="#" onClick={() => sendMessage(message)}>
					<CiPaperplane size={30} color="#ffff" />
				</a>
			</div>
			{confirmData.show && (
				<ConfirmDelete
					setShow={setConfirmData}
					confirmData={confirmData}
					id={""}
				/>
			)}
		</SendMessageBoxStyle>
	);
};

export default SendMessageBox;
