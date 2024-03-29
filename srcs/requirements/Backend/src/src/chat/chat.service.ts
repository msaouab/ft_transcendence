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
import { PrivateChatRoom, PrivateMessage, BlockTab, Prisma } from "@prisma/client";
import * as bcrypt from 'bcrypt';

// dto's
import { createMessageDto } from "./message/message.dto";
import { PostPrivateChatRoomDto } from "./dto/postPrivateChatRoom";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import { clients as onlineClients } from "src/notify/notify.gateway";
import e from "express";
import { ChannelDto } from "./dto/createChannel.dto";
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
                // check if the other user is online
                if (clients.has(payload.receiver_id)) {
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
            const otherClientSocket = onlineClients.get(payload.receiver_id);
            otherClientSocket.emit("chatNotif", { num: 1 });
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
        await this.unbanUsers(client, server);
        await this.unMuteUsers(client, server);
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
        await this.unbanUsers(client, server);
        await this.unMuteUsers(client, server);
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
        return channel;
    }

    async leaveGroupChatRoom(client, payload: any, server: Server) {
        await this.unbanUsers(client, server);
        await this.unMuteUsers(client, server);
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
        return channel;
    }

    async addChannelMember(client, payload: any, server: Server) {
        await this.unbanUsers(client, server);
        await this.unMuteUsers(client, server);
        const { channel_id, user_id, type, password } = payload;
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
            if (type === 'Secret') {
                const isPasswordMatch = await bcrypt.compare(password, channel.password);
                if (!isPasswordMatch) {
                    client.emit('error', 'Password does not match');
                    return;
                }
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
                client.emit('UserError', 'User not found');
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
        await this.unbanUsers(client, server);
        await this.unMuteUsers(client, server);
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
        await this.unbanUsers(client, server);
        await this.unMuteUsers(client, server);
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
        await this.unbanUsers(client, server);
        await this.unMuteUsers(client, server);
        const { group_id, userId, muteTime } = payload;
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
            const endMuteTime = new Date();
            endMuteTime.setMinutes(endMuteTime.getMinutes() + parseInt(muteTime));
            const mutedUser = await this.prisma.mutedMembers.create({
                data: {
                    muted_id: userId,
                    channel_id: group_id,
                    status_end_time: endMuteTime,
                    status: 'Temporary'
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
        await this.unbanUsers(client, server);
        await this.unMuteUsers(client, server);
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
        await this.unbanUsers(client, server);
        await this.unMuteUsers(client, server);
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
        await this.unbanUsers(client, server);
        await this.unMuteUsers(client, server);
        try {
            const { group_id, userId, banTime } = payload;
            // the banTime is in minutes like 2 minutes, 5 minutes
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
            const end_time = new Date();
            end_time.setMinutes(end_time.getMinutes() + parseInt(banTime));
            const bannedUser = await this.prisma.bannedMembers.create({
                data: {
                    banned_id: userId,
                    channel_id: group_id,
                    status_end_time: end_time,
                    status: 'Temporary'
                }
            })
            if (!bannedUser) {
                client.emit('error', 'User not banned');
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
        await this.unbanUsers(client, server);
        await this.unMuteUsers(client, server);
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
                client.emit('bannedError', 'User not unbanned');
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
        await this.unbanUsers(client, server);
        await this.unMuteUsers(client, server);
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
        await this.unbanUsers(client, server);
        await this.unMuteUsers(client, server);
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
    async removeMeuted(client, payload: any, server: Server) {
        await this.unbanUsers(client, server);
        await this.unMuteUsers(client, server);
        try {
            const { group_id, user_id } = payload;
            const mutedUser = await this.prisma.mutedMembers.delete({
                where: {
                    channel_id_muted_id: {
                        muted_id: user_id,
                        channel_id: group_id
                    }
                }
            })
            if (!mutedUser) {
                client.emit('error', 'User not unmuted');
            }
            return mutedUser;
        }
        catch (error) {
            client.emit('error', error);
        }
    }
    async leaveChannel(client, payload: any, server: Server) {
        await this.unbanUsers(client, server);
        await this.unMuteUsers(client, server);
        try {
            const { group_id, user_id } = payload;
            const channel = await this.getChannel(client, group_id);
            const user = await this.getUser(user_id, client);
            const joindChannel = await this.prisma.channelsJoinTab.delete({
                where: {
                    user_id_channel_id: {
                        user_id: user_id,
                        channel_id: group_id
                    }
                }
            })
            if (!joindChannel) {
                client.emit('error', 'Channel not joined');
            }
            if (joindChannel.role === 'Member') {
                const memberTab = await this.removeMember(client, group_id, user_id);
                if (!memberTab) {
                    client.emit('error', 'Member not removed');
                }
            } else if (joindChannel.role === 'Admin') {
                const adminTab = await this.removeAdmin(client, group_id, user_id);
                if (!adminTab) {
                    client.emit('error', 'Admin not removed');
                }
            } else if (joindChannel.role === "Muted") {
                const mutedTab = await this.removeMeuted(client, group_id, user_id);
                if (!mutedTab) {
                    client.emit('error', 'Muted not removed');
                }
            }
            server.to(group_id).emit('memberLeaveChannel', {
                avatar: user.avatar,
                id: user.id,
                login: user.login,
                status: user.status,
                group_id: group_id
            });
        } catch (error) {
            client.emit('error', error);
        }
    }
    async deleteChannel(client, payload: any, server: Server) {
        await this.unbanUsers(client, server);
        await this.unMuteUsers(client, server);
        try {
            const { group_id, user_id } = payload;
            const channel = await this.getChannel(client, group_id);
            const user = await this.getUser(user_id, client);
            const deletedChannelMembersTab = await this.prisma.membersTab.deleteMany({
                where: {
                    channel_id: group_id
                }
            })
            if (!deletedChannelMembersTab) {
                client.emit('error', 'Channel not deleted from members tab');
            }
            const deletedChannelBannedTab = await this.prisma.bannedMembers.deleteMany({
                where: {
                    channel_id: group_id
                }
            })
            if (!deletedChannelBannedTab) {
                client.emit('error', 'Channel not deleted from banned tab');
            }
            const deletedChannelMutedTab = await this.prisma.mutedMembers.deleteMany({
                where: {
                    channel_id: group_id
                }
            })
            if (!deletedChannelMutedTab) {
                client.emit('error', 'Channel not deleted from muted tab');
            }
            const deletedChannelAdminsTab = await this.prisma.adminMembers.deleteMany({
                where: {
                    channel_id: group_id
                }
            })
            if (!deletedChannelAdminsTab) {
                client.emit('error', 'Channel not deleted from admins tab');
            }
            const deletedMessages = await this.prisma.message.deleteMany({
                where: {
                    receiver_id: group_id
                }
            })
            if (!deletedMessages) {
                client.emit('error', 'Channel messages not deleted');
            }
            const deletedChannel = await this.prisma.channel.delete({
                where: {
                    id: group_id
                }
            })
            if (!deletedChannel) {
                client.emit('error', 'Channel not deleted');
            }
            const joinedChannel = await this.prisma.channelsJoinTab.deleteMany({
                where: {
                    channel_id: group_id
                }
            })
            if (!joinedChannel) {
                client.emit('error', 'Channel not deleted from joined tab');
            }
            server.to(group_id).emit('channelDeleted', {
                group_id: group_id
            });
        } catch (error) {
            client.emit('error', error);
        }
    }
    async createChannel(client, payload: ChannelDto, server: Server) {
        await this.unbanUsers(client, server);
        await this.unMuteUsers(client, server);
        const { name, status, password, limitUsers, description, avatar, owner } = payload;
        const ownerUser = await this.getUser(owner, client);
        try {
            let hashedPassword = await bcrypt.hash(password, 10); // Hash the password using bcrypt
            if (password === ''){
                hashedPassword = "";
            }
            const channel = await this.prisma.channel.create({
                data: {
                    name: name,
                    chann_type: status,
                    password: hashedPassword,
                    owner_id: owner,
                    limit_members: -1,
                    description: description,
                    avatar: avatar
                }
            });
            if (!channel) {
                client.emit('error', 'Channel not created');
            }
            const channelJoinTab = await this.prisma.channelsJoinTab.create({
                data: {
                    user_id: owner,
                    channel_name: name,
                    channel_id: channel.id,
                    role: 'Owner',
                }
            });
            if (!channelJoinTab) {
                client.emit('error', 'Channel not created in join tab');
            }
            const message = await this.prisma.message.create({
                data: {
                    sender_id: channel.id,
                    receiver_id: channel.id,
                    content: `${ownerUser.login} created channel`,
                }
            });
            client.emit('channelCreated', {
                group_id: channel.id,
                sender_id: channel.id,
                name: channel.name,
                profileImage: channel.avatar,
                lastMessage: message.content,
                lastMessageDate: message.dateCreated,
                role: "Server",
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                client.emit('errorExistChannel', 'Channel already exist');
            }
            else {
                client.emit('error', error);
            }
        }
    }

    // unban users if the now date is greater than the banned date
    async unbanUsers(client, server: Server) {
        try {
            const bannedUsers = await this.prisma.bannedMembers.findMany({
                where: {
                    status_end_time: {
                        lte: new Date()
                    }
                }
            });
            if (!bannedUsers) {
                client.emit('BannedError', 'Banned users not found');
                return;
            }
            for (let i = 0; i < bannedUsers.length; i++) {
                this.unbanUser(client, {
                    userId: bannedUsers[i].banned_id,
                    group_id: bannedUsers[i].channel_id
                }, server);
            }
        } catch (error) {
            client.emit('error', error);
        }
    }

    // unMute users if the now date is greater than the muted date
    async unMuteUsers(client, server: Server) {
        try {
            const mutedUsers = await this.prisma.mutedMembers.findMany({
                where: {
                    status_end_time: {
                        lte: new Date()
                    }
                }
            });
            if (!mutedUsers) {
                client.emit('MutedError', 'Muted users not found');
                return;
            }
            for (let i = 0; i < mutedUsers.length; i++) {
                this.unmuteUser(client, {
                    userId: mutedUsers[i].muted_id,
                    group_id: mutedUsers[i].channel_id
                }, server);
            }
        } catch (error) {
            client.emit('error', error);
        }
    }

    async updateChannelPassword(client, payload: any, server: Server) {
        await this.unbanUsers(client, server);
        await this.unMuteUsers(client, server);
        try {
            const { group_id, password } = payload;
            const channel = await this.getChannel(client, group_id);
            let updatedChannel;
            if (channel.password !== '' && password === '') {
                updatedChannel = await this.prisma.channel.update({
                    where: {
                        id: group_id
                    },
                    data: {
                        password: "",
                        chann_type: 'Public',
                    }
                })
            }
            else {
                let hashedPassword = await bcrypt.hash(password, 10); // Hash the password using bcrypt
                updatedChannel = await this.prisma.channel.update({
                    where: {
                        id: group_id
                    },
                    data: {
                        password: hashedPassword,
                        chann_type: 'Secret',
                    }
                });
            }
            if (!updatedChannel) {
                client.emit('error', 'Channel not updated');
            }
            server.to(group_id).emit('channelUpdated', {
                ...channel,
                password: updatedChannel.password,
                chann_type: updatedChannel.chann_type,
            });
        } catch (error) {
            client.emit('error', error);
        }
    }
}
