/*
The chat.service.ts file contain the 
service class that implements the business logic 
for the chat feature, such as storing or retrieving 
messages from a database
*/

import { Body, HttpException, Injectable, Param, Query } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { Socket, Server } from "socket.io";
import { createHash } from "crypto";
import { PrivateChatRoom, PrivateMessage, BlockTab } from "@prisma/client";

// dto's
import { createMessageDto } from "./message/message.dto";
import { PostPrivateChatRoomDto } from "./dto/postPrivateChatRoom";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import { clients as onlineClients } from "src/notify/notify.gateway";
// import { clients } from 'src/notify/notify.gateway';

// a type
@Injectable()
export class ChatService {
	constructor(
		private prisma: PrismaService // private MessageService: MessageServic
	) {}

	// a map that contain the id of the user and it's websocket object

	async createPrivateChatRoom(
		postreatePrivateChatRoomDto: PostPrivateChatRoomDto
	) {
		const { senderId, receiverId } = postreatePrivateChatRoomDto;
		const hashedRoomName = await this.getRoomId(senderId, receiverId);
		let privateChatRoom = await this.prisma.privateChatRoom.create({
			data: {
				id: hashedRoomName,
				sender_id: senderId,
				receiver_id: receiverId,
			},
		});
		if (!privateChatRoom) {
			throw new HttpException("Private chat already exist", 409);
		}
		return privateChatRoom;
	}

	async deletePrivateChatRoom(id: string, userId: string) {
		/*
            error handling:
                * if the private chat room doesn't exist
                * if the user is not authorized to delete the private chat room (not the sender or receiver)
        */
		// try {

		const privateChatRoom = await this.prisma.privateChatRoom.findUnique({
			where: {
				id: id,
			},
		});
		if (!privateChatRoom) {
			throw new HttpException("Private chat room not found", 404);
		}
		if (
			privateChatRoom.sender_id != userId &&
			privateChatRoom.receiver_id != userId
		) {
			throw new HttpException("Unauthorized", 401);
		}
		// we're using cascade delete, so we don't need to delete the messages manually
		const deletedPrivateChatRoom = await this.prisma.privateChatRoom.delete({
			where: {
				id: id,
			},
		});
		return deletedPrivateChatRoom;
	}

	/* joinPrivateChatRoom(senderId: string, receiverId: string) 
        will be called when senderId joins the private chat room
        it createa a new private chat room if it doesn't exist
        and set the lastSentMessage to current time
    */
    // get room id using senderId and receiverId
    async getRoomId(senderId: string, receiverId: string): Promise<string> {
        const roomName = [senderId, receiverId].sort().join("-");
        const secretKey = process.env.SECRET_KEY;
        // hash the room name using md5
        const hash = createHash("md5");
        const hashedRoomName = hash.update(roomName + secretKey).digest("hex");
        return hashedRoomName;
    }


    async joinPrivateChatRoom(
        client: Socket,
        payload: {
            senderId: string;
            receiverId: string;
        }
    ) {
        // if (!client.rooms.has(privateRoom.id)) {
        //     console.log("You're not in the private chat room");
        //     // throw new HttpException("You're not in the private chat room", 403);
        //     await this.joinPrivateChatRoom(client, { "senderId": subPayload.senderId, "receiverId": subPayload.receiverId });
        // }

        // console.log("We've got the event to join a private room");
        const { senderId, receiverId } = payload;
        // try {
        const privateChatRoom = await this.prisma.privateChatRoom.findUnique({
            where: {
                id: await this.getRoomId(senderId, receiverId),
            },
        });
        if (!privateChatRoom) {
            throw new HttpException("Private chat doesn't exist", 404);
        }
        // console.log("We're joining the private chat room id: ", privateChatRoom.id);
        await client.join(privateChatRoom.id);
        console.log(
            `User with id: ${senderId} joined the private chat room: ${privateChatRoom.id}`
        );
        return privateChatRoom;
    }

    // one note here is that you can check if the room exist or not
    // by only hashing the sender_id,receiver_id and secret key and 
    // check if room id matches that of client sent room id
    // which would reduce a whole db query, anyways...



    async leavePrivateChatRoom(
        client: Socket,
        payload: {
            senderId: string;
            receiverId: string;
        }
    ) {
        const { senderId, receiverId } = payload;
        try {
            const privateChatRoom = await this.prisma.privateChatRoom.findUnique({
                where: {
                    id: await this.getRoomId(senderId, receiverId),
                },
            });
            client.leave(privateChatRoom.id);
            console.log(
                `User with id: ${senderId} left the private chat room: ${privateChatRoom.id}`
            );
            return privateChatRoom;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                console.log("Error: ", error);
                throw new HttpException("Private chat doesn't exist", 404);
            }
        }
    }

    /* sendPrivateMessage(senderId: string, receiverId: string, message: string) */
    async sendPrivateMessage(
        client: Socket,
        payload: createMessageDto,
        server: Server,
        clients: Map<string, Socket>
    ) {
        // check if privatchatroom exist.
        const roomId = await this.getRoomId(payload.sender_id, payload.receiver_id);
        try {
            const privateRoom = await this.prisma.privateChatRoom.findUnique({
                where: {
                    id: roomId,
                },
            });

            const block = await this.prisma.blockTab.findFirst({
                where: {
                    OR: [
                        {
                            AND: [
                                {
                                    user_id: payload.sender_id,
                                },
                                {
                                    blockedUser_id: payload.receiver_id,
                                },
                            ],
                        },
                        {
                            AND: [
                                {
                                    user_id: payload.receiver_id,
                                },
                                {
                                    blockedUser_id: payload.sender_id,
                                },
                            ],
                        },
                    ],
                },
            });
            if (block) {
                throw new HttpException(
                    "you can't send a message to this user atm",
                    403
                );
            }

            // if this the first message and the other user is online join him to the room and send him the message
            const messages = await this.prisma.privateMessage.findMany({
                where: {
                    chatRoom_id: privateRoom.id,
                },
                take: 1,
            });
            if (messages.length == 0) {
                console.log("this is the first message");
                // check if the other user is online
                if (clients.has(payload.receiver_id)) {
                    console.log("the other user is online");
                    const otherClientSocket = clients.get(payload.receiver_id);
                    await otherClientSocket.join(privateRoom.id);
                    // emit the event roomJoined to the other user
                    otherClientSocket.emit("roomJoined", { roomId: privateRoom.id });
                }
            }
            // create the message
            let message = await this.prisma.privateMessage.create({
                data: {
                    content: payload.content,
                    seen: payload.seen,
                    sender_id: payload.sender_id,
                    receiver_id: payload.receiver_id,
                    chatRoom_id: payload.chatRoom_id,
                },
            });
            if (!message) {
                throw new HttpException("Error creating private message", 500);
            }
            await this.prisma.privateChatRoom.update({
                where: {
                    id: privateRoom.id,
                },
                data: {
                    lastUpdatedTime: new Date(),
                },
            });
            console.log("We're sending the event to room: ", privateRoom);
            // if not both sockets are connected , we send a private
            server.to(privateRoom.id).emit("newPrivateMessage", message);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                console.log("Error: ", error);
                throw new HttpException("Private chat doesn't exist", 404);
            }
        }
        // if receiver is online notify him
        if (onlineClients.has(payload.receiver_id)) {
            console.log("receiver is online and we're sending him a notification");
            const otherClientSocket = onlineClients.get(payload.receiver_id);
            console.log("We're sending the chatNotif event to the other client");
            otherClientSocket.emit("chatNotif", { num: 1 });
        } else {
            console.log("receiver is offline");
        }
    }


    async getPrivateChatRoom(
        senderId: string,
        receiverId: string
    ): Promise<PrivateChatRoom> {
        const privatChatRoom = await this.prisma.privateChatRoom.findUnique({
            where: {
                id: await this.getRoomId(senderId, receiverId),
            },
        });
        return privatChatRoom;
    }

    // getters
    async getPrivateChatRooms(
        userId: string,
        limit: string
    ): Promise<PrivateChatRoom[]> {
        let limitNumber = Number(limit);
        if (isNaN(limitNumber)) {
            limitNumber = 10;
        }
        return await this.prisma.privateChatRoom.findMany({
            where: {
                OR: [
                    {
                        sender_id: userId,
                    },
                    {
                        receiver_id: userId,
                    },
                ],
            },
            orderBy: {
                lastUpdatedTime: "desc",
            },
            take: limitNumber,
        });
    }

    async getPrivateChatMessages(
        id: string,
        queries: { limit: string; offset: string; seen: string; userId: string }
    ): Promise<[number, PrivateMessage[]] | PrivateMessage[]> {
        let { limit, offset, seen, userId } = queries;
        if ((seen && !userId) || (!seen && userId)) {
            throw new HttpException(
                "'userId' and 'seen' querie are required either is passed",
                400
            );
        }
        let limitNumber = Number(limit);
        if (isNaN(limitNumber)) {
            limitNumber = 100;
        }
        // check if id of room exists
        const privateChatRoom = await this.prisma.privateChatRoom.findUnique({
            where: {
                id: id,
            },
        });
        if (!privateChatRoom) {
            throw new HttpException("Private chat room not found", 404);
        }
        // return all the private messages in the private chat room, sorted by date
        // if seen is passed, get all the messages that seen if (true) or not seen if (false)
        // if (seen == 'true' || seen == 'false') {
        //     console.log("Seen: ", seen);
        // }

        if (seen) {
            const transaction = await this.prisma.$transaction([
                // get count of all the messages in the private chat room
                this.prisma.privateMessage.count({
                    where: {
                        chatRoom_id: id,
                        seen: seen === "true" ? true : false,
                    },
                }),
                // get all the messages in the private chat room
                this.prisma.privateMessage.findMany({
                    where: {
                        chatRoom_id: id,
                        seen: seen === "true" ? true : false,
                    },
                    orderBy: {
                        dateCreated: "desc",
                    },
                }),
            ]);
        }

        if (isNaN(Number(offset))) {
            offset = "0";
        }
        // if seen is not passed, get all the messages
        return await this.prisma.$transaction([
            // get count of all the messages in the private chat room
            this.prisma.privateMessage.count({
                where: {
                    chatRoom_id: id,
                },
            }),
            // get all the messages in the private chat room
            this.prisma.privateMessage.findMany({
                where: {
                    chatRoom_id: id,
                },
                orderBy: {
                    dateCreated: "desc",
                },
                skip: Number(offset),
                take: limitNumber,
            }),
        ]);
    }

    async createMessage(payload: any) {
        const { group_id, sender_id, lastMessage } = payload;
        const groupChatRoom = await this.prisma.channel.findFirst({
            where: {
                id: group_id
            }
        });
        if (!groupChatRoom) {
            throw new HttpException('Group chat room not found', 404);
        }
        const message = await this.prisma.message.create({
            data: {
                sender_id: sender_id,
                receiver_id: group_id,
                content: lastMessage,
                seen: false,
            }
        });
        if (!message) {
            throw new HttpException('Message not created', 400);
        }
        return message;
    }

    async sendGroupMessage(client, payload: any, server: Server) {
        const { group_id } = payload;
        const message = await this.createMessage(payload);
        const newGroupMessage = {
            group_id: payload.group_id,
            sender_id: payload.sender_id,
            name: payload.name,
            profileImage: payload.profileImage,
            lastMessage: message.content,
            lastMessageDate: message.dateCreated,
            role: payload.role
        }
        server.to(group_id).emit('newGroupMessage', newGroupMessage);
        server.to(group_id).emit('GroupMessage', newGroupMessage);
        return message;
    }

    async joinGroupChatRoom(client, payload: any, server: Server) {
        const { group_id } = payload;

        const channel = await this.prisma.channel.findFirst({
            where: {
                id: group_id
            }
        });
        if (!channel) {
            throw new HttpException('Group chat room not found', 404);
        }
        await client.join(group_id);
        console.log("The client has joined the room: ", group_id);
        return channel;
    }

    async leaveGroupChatRoom(client, payload: any, server: Server) {
        const { group_id } = payload;

        const channel = await this.prisma.channel.findFirst({
            where: {
                id: group_id
            }
        });
        if (!channel) {
            throw new HttpException('Group chat room not found', 404);
        }
        await client.leave(group_id);
        console.log("The client has left the room: ", group_id);
        return channel;
    }

    async addChannelMember(client, payload: any, server: Server) {
        const { channel_id, user_id, type, password } = payload;
        console.log(channel_id, user_id, type, password);
        const user = await this.prisma.user.findUnique({
            where: {
                id: user_id
            }
        });
        if (!user) {
            throw new HttpException('User not found', 404);
        }
        const channel = await this.prisma.channel.findUnique({
            where: {
                id: channel_id
            }
        });
        if (!channel) {
            throw new HttpException('Channel not found', 404);
        }
        try {
            if (type === 'Secret' && channel.password !== password) {
                throw new HttpException('Wrong password', 400);
            }
            const memberTab = await this.prisma.membersTab.create({
                data: {
                    member_id: user_id,
                    channel_id: channel_id,
                }
            })
            if (!memberTab) {
                throw new HttpException('Member not added', 400);
            }
            const joindChannel = await this.prisma.channelsJoinTab.create({
                data: {
                    user_id: user_id,
                    channel_name: channel.name,
                    channel_id: channel.id,
                    role: 'Member'
                }
            })
            if (!joindChannel) {
                throw new HttpException('Channel not joined', 400);
            }
            server.to(channel_id).emit('newChannelMember', user);
        } catch (error) {
            client.emit('error', error);
        }
    }

    async getChannel(client, channel_id: string) {
        try {
            const channel = await this.prisma.channel.findUnique({
                where: {
                    id: channel_id
                }
            });
            if (!channel) {
                client.emit('error', 'Channel not found');
            }
            return channel;
        } catch (error) {
            client.emit('error', error);
        }
    }

    async getUser(user_id: string, client) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: user_id
                }
            });
            if (!user) {
                client.emit('error', 'User not found');
            }
            return user;
        } catch (error) {
            client.emit('error', error);
        }
    }
    async removeMember(client, group_id: string, user_id: string) {
        try {
            const memberTab = await this.prisma.membersTab.delete({
                where: {
                    channel_id_member_id: {
                        member_id: user_id,
                        channel_id: group_id
                    }
                }
            })
            if (!memberTab) {
                client.emit('error', 'Member not removed');
            }
            return memberTab;
        } catch (error) {
            client.emit('error', error);
        }
    }
    async removeAdmin(client, group_id: string, user_id: string) {
        try {
            const adminTab = await this.prisma.adminMembers.delete({
                where: {
                    channel_id_admin_id: {
                        admin_id: user_id,
                        channel_id: group_id
                    }
                }
            })
            if (!adminTab) {
                client.emit('error', 'Admin not removed');
            }
            return adminTab;
        } catch (error) {
            client.emit('error', error);
        }
    }

    async addChannelAdmin(client, payload: any, server: Server) {
        const { group_id, userId } = payload;
        try {
            const channel = await this.getChannel(client, group_id);
            const admin = await this.getUser(userId, client);
            const memberTab = await this.removeMember(client, group_id, userId);
            const adminTab = await this.prisma.adminMembers.create({
                data: {
                    admin_id: userId,
                    channel_id: group_id,
                }
            })
            if (!adminTab) {
                client.emit('error', 'Admin not added');
            }
            const joindChannel = await this.prisma.channelsJoinTab.update({
                where: {
                    user_id_channel_id: {
                        user_id: userId,
                        channel_id: group_id
                    }
                },
                data: {
                    role: 'Admin'
                }
            })
            if (!joindChannel) {
                client.emit('error', 'Channel not joined');
            }
            server.to(group_id).emit('newChannelAdmin', {
                avatar: admin.avatar,
                id: admin.id,
                login: admin.login,
                status: admin.status,
                group_id: group_id,
            });
        } catch (error) {
            client.emit('error', error);
        }
    }
    async removeChannelAdmin(client, payload: any, server: Server) {
        const { group_id, userId } = payload;
        try {
            const channel = await this.getChannel(client, group_id);
            const admin = await this.getUser(userId, client);
            const adminTab = await this.removeAdmin(client, group_id, userId);
            const memberTab = await this.prisma.membersTab.create({
                data: {
                    member_id: userId,
                    channel_id: group_id,
                }
            })
            if (!memberTab) {
                client.emit('error', 'Member not added');
            }
            const joindChannel = await this.prisma.channelsJoinTab.update({
                where: {
                    user_id_channel_id: {
                        user_id: userId,
                        channel_id: group_id
                    }
                },
                data: {
                    role: 'Member'
                }
            })
            if (!joindChannel) {
                client.emit('error', 'Channel not joined');
            }
            server.to(group_id).emit('removeChannelAdmin', {
                avatar: admin.avatar,
                id: admin.id,
                login: admin.login,
                status: admin.status,
                group_id: group_id,
            });
        } catch (error) {
            client.emit('error', error);
        }
    }
    async muteUser(client, payload: any, server: Server) {
        const { group_id, userId } = payload;
        try {
            const channel = await this.getChannel(client, group_id);
            const admin = await this.getUser(userId, client);
            const memberTab = await this.removeMember(client, group_id, userId);
            if (!memberTab) {
                const adminTab = await this.removeAdmin(client, group_id, userId);
                if (!adminTab) {
                    client.emit('error', 'Admin not removed');
                }
            }
            const mutedUser = await this.prisma.mutedMembers.create({
                data: {
                    muted_id: userId,
                    channel_id: group_id,
                }
            })
            if (!mutedUser) {
                client.emit('error', 'User not muted');
            }
            const joindChannel = await this.prisma.channelsJoinTab.update({
                where: {
                    user_id_channel_id: {
                        user_id: userId,
                        channel_id: group_id
                    }
                },
                data: {
                    role: 'Muted'
                }
            })
            if (!joindChannel) {
                client.emit('error', 'Channel not joined');
            }
            const res = {
                avatar: admin.avatar,
                id: admin.id,
                login: admin.login,
                status: admin.status,
                group_id: group_id,
                role: 'Muted',
                muteStatus: mutedUser.status,
                status_end_time: mutedUser.status_end_time
            }
            server.to(group_id).emit('muteChannelUser', res);
        } catch (error) {
            client.emit('error', error);
        }
    }
    async unmuteUser(client, payload: any, server: Server) {
        const { group_id, userId } = payload;
        try {
            const channel = await this.getChannel(client, group_id);
            const admin = await this.getUser(userId, client);
            const mutedUser = await this.prisma.mutedMembers.delete({
                where: {
                    channel_id_muted_id: {
                        muted_id: userId,
                        channel_id: group_id
                    }
                }
            })
            if (!mutedUser) {
                client.emit('error', 'User not unmuted');
            }
            const joindChannel = await this.prisma.channelsJoinTab.update({
                where: {
                    user_id_channel_id: {
                        user_id: userId,
                        channel_id: group_id
                    }
                },
                data: {
                    role: 'Member'
                }
            })
            if (!joindChannel) {
                client.emit('error', 'Channel not joined');
            }
            server.to(group_id).emit('unmuteChannelUser', {
                avatar: admin.avatar,
                id: admin.id,
                login: admin.login,
                status: admin.status,
                group_id: group_id,
                role: 'Member',
            });
        } catch (error) {
            client.emit('error', error);
        }
    }
    async kickUser(client, payload: any, server: Server) {
        try {
            const { group_id, userId } = payload;
            const channel = await this.getChannel(client, group_id);
            const admin = await this.getUser(userId, client);
            const memberTab = await this.removeMember(client, group_id, userId);
            if (!memberTab) {
                const adminTab = await this.removeAdmin(client, group_id, userId);
                if (!adminTab) {
                    client.emit('error', 'Admin not removed');
                }
            }
            const joindChannel = await this.prisma.channelsJoinTab.delete({
                where: {
                    user_id_channel_id: {
                        user_id: userId,
                        channel_id: group_id
                    }
                }
            })
            if (!joindChannel) {
                client.emit('error', 'Channel not joined');
            }
            server.to(group_id).emit('kickChannelUser', {
                avatar: admin.avatar,
                id: admin.id,
                login: admin.login,
                status: admin.status,
                group_id: group_id,
            });
        } catch (error) {
            client.emit('error', error);
        }
    }
    async banUser(client, payload: any, server: Server) {
        try {
            const { group_id, userId } = payload;
            const channel = await this.getChannel(client, group_id);
            const admin = await this.getUser(userId, client);
            const memberTab = await this.removeMember(client, group_id, userId);
            if (!memberTab) {
                const adminTab = await this.removeAdmin(client, group_id, userId);
                if (!adminTab) {
                    client.emit('error', 'Admin not removed');
                }
            }
            const bannedUser = await this.prisma.bannedMembers.create({
                data: {
                    banned_id: userId,
                    channel_id: group_id,
                }
            })
            if (!bannedUser) {
                client.emit('error', 'User not banned');
            }
            const joindChannel = await this.prisma.channelsJoinTab.delete({
                where: {
                    user_id_channel_id: {
                        user_id: userId,
                        channel_id: group_id
                    }
                }
            })
            if (!joindChannel) {
                client.emit('error', 'Channel not joined');
            }
            const res = {
                avatar: admin.avatar,
                id: admin.id,
                login: admin.login,
                status: admin.status,
                group_id: group_id,
                role: 'Banned',
                banStatus: bannedUser.status,
                status_end_time: bannedUser.status_end_time
            }
            server.to(group_id).emit('banChannelUser', res);
        } catch (error) {
            client.emit('error', error);
        }
    }
    async unbanUser(client, payload: any, server: Server) {
        try {
            const { group_id, userId } = payload;
            const channel = await this.getChannel(client, group_id);
            const admin = await this.getUser(userId, client);
            const bannedUser = await this.prisma.bannedMembers.delete({
                where: {
                    channel_id_banned_id: {
                        banned_id: userId,
                        channel_id: group_id
                    }
                }
            })
            if (!bannedUser) {
                client.emit('error', 'User not unbanned');
            }
            const memberTab = await this.prisma.membersTab.create({
                data: {
                    member_id: userId,
                    channel_id: group_id,
                }
            })
            if (!memberTab) {
                client.emit('error', 'User not added to members');
            }
            const joindChannel = await this.prisma.channelsJoinTab.create({
                data: {
                    user_id: userId,
                    channel_name: channel.name,
                    channel_id: channel.id,
                    role: 'Member'
                }
            })
            if (!joindChannel) {
                client.emit('error', 'Channel not joined');
            }
            console.log('unbanUser: ', admin);
            server.to(group_id).emit('unbanChannelUser', {
                avatar: admin.avatar,
                id: admin.id,
                login: admin.login,
                status: admin.status,
                role: 'Member',
                group_id: group_id
            });
        } catch (error) {
            client.emit('error', error);
        }
    }
    async joinPrivateChannel(client, payload: any, server: Server) {
        try {
            const { group_id, user_id } = payload;
            const channel = await this.getChannel(client, group_id);
            const user = await this.getUser(user_id, client);
            const memberTab = await this.prisma.membersTab.create({
                data: {
                    member_id: user_id,
                    channel_id: group_id,
                }
            })
            if (!memberTab) {
                client.emit('error', 'User not added to members');
            }
            const joindChannel = await this.prisma.channelsJoinTab.create({
                data: {
                    user_id: user_id,
                    channel_name: channel.name,
                    channel_id: channel.id,
                    role: 'Member'
                }
            })
            if (!joindChannel) {
                client.emit('error', 'Channel not joined');
            }
            await this.joinGroupChatRoom(client, { group_id: channel.id }, server);
            client.emit('newMember', {
                channel: channel,
                user: user,
                role: 'Member',
            });
        } catch (error) {
            client.emit('error', error);
        }
    }
    async sendMessageG(client, payload: any, server: Server) {
        try {
            const { group_id, sender_id, lastMessage } = payload;
            const channel = await this.getChannel(client, group_id);
            const user = await this.getUser(sender_id, client);
            const message = await this.prisma.message.create({
                data: {
                    sender_id: sender_id,
                    receiver_id: group_id,
                    content: lastMessage,
                }
            });
            if (!message) {
                client.emit('error', 'Message not sent');
            }
            server.to(group_id).emit('newMessageG', {
                ...payload,
                lastMessageDate: message.dateCreated,
            });
        } catch (error) {
            client.emit('error', error);
        }
    }
}
