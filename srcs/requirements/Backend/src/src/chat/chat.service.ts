/*
The chat.service.ts file contain the 
service class that implements the business logic 
for the chat feature, such as storing or retrieving 
messages from a database
*/



import { Body, HttpException, Injectable, Param, Query } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Socket, Server } from 'socket.io';
import { createHash } from 'crypto';
import {
    PrivateChatRoom,
    PrivateMessage,
    BlockTab
} from '@prisma/client';


// dto's
import { createMessageDto } from './message/message.dto';
import { PostPrivateChatRoomDto } from './dto/postPrivateChatRoom';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService,
        // private MessageService: MessageService
    ) { }

    async createPrivateChatRoom(postreatePrivateChatRoomDto: PostPrivateChatRoomDto) {
        const { senderId, receiverId } = postreatePrivateChatRoomDto;
        const hashedRoomName = await this.getRoomId(senderId, receiverId);
        let privateChatRoom = await this.prisma.privateChatRoom.create({
            data: {
                id: hashedRoomName,
                sender_id: senderId,
                receiver_id: receiverId
            }
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

        const privateChatRoom = await this.prisma.privateChatRoom.findUnique(
            {
                where: {
                    id: id
                }
            }
        );
        if (!privateChatRoom) {
            throw new HttpException("Private chat room not found", 404);
        }
        if (privateChatRoom.sender_id != userId && privateChatRoom.receiver_id != userId) {
            throw new HttpException("Unauthorized", 401);
        }
        // we're using cascade delete, so we don't need to delete the messages manually
        const deletedPrivateChatRoom = await this.prisma.privateChatRoom.delete({
            where: {
                id: id

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
        const roomName = [senderId, receiverId].sort().join('-');
        const secretKey = process.env.SECRET_KEY;
        // hash the room name using md5
        const hash = createHash('md5');
        const hashedRoomName = hash.update(roomName + secretKey).digest('hex');
        return hashedRoomName;
    }


    async joinPrivateChatRoom(client: Socket, payload: {
        senderId: string,
        receiverId: string
    }) {
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
        })
        if (!privateChatRoom) {
            throw new HttpException("Private chat doesn't exist", 404);
        }
        // console.log("We're joining the private chat room id: ", privateChatRoom.id);
        await client.join(privateChatRoom.id);
        console.log(`User with id: ${senderId} joined the private chat room: ${privateChatRoom.id}`);
        return privateChatRoom;
    }

    // one note here is that you can check if the room exist or not
    // by only hashing the sender_id,receiver_id and secret key and 
    // check if room id matches that of client sent room id
    // which would reduce a whole db query, anyways...


    // catch (error) {
    //     if (error instanceof PrismaClientKnownRequestError) {
    //         console.log("Error: ", error);
    //         throw new HttpException("Private chat already exist", 409);
    //     }
    // }



    async leavePrivateChatRoom(client: Socket, payload: {
        senderId: string,
        receiverId: string
    }) {
        const { senderId, receiverId } = payload;
        try {
            const privateChatRoom = await this.prisma.privateChatRoom.findUnique({
                where: {
                    id: await this.getRoomId(senderId, receiverId),
                },
            })
            client.leave(privateChatRoom.id);
            console.log(`User with id: ${senderId} left the private chat room: ${privateChatRoom.id}`);
            return privateChatRoom;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                console.log("Error: ", error);
                throw new HttpException("Private chat doesn't exist", 404);
            }
        }
    }

    /* sendPrivateMessage(senderId: string, receiverId: string, message: string) */
    async sendPrivateMessage(client: Socket, payload: createMessageDto, server: Server
        ) {

        // if client 
        // if room doesn't exist, call joinPrivateChatRoom
        // const subPayload = {
        //     senderId: payload.sender_id,
        //     receiverId: payload.receiver_id,
        //     chatRoomId: payload.chatRoom_id,
        //     seen: payload.seen,
        //     content: payload.content
        // }

        
        // check if privatchatroom exist.
        try {
            const privateRoom = await this.prisma.privateChatRoom.findUnique({
                where: {
                    id: await this.getRoomId(payload.sender_id, payload.receiver_id),
                },
            })
 
            // create a new private message, and adds it to the private chat room
    
            // if both sockets are connected, set seen to true
            // if (server.sockets.sockets.get(payload.receiver_id) && server.sockets.sockets.get(payload.sender_id)) {
            //     payload.seen = true;
            // }
            // if (!privateRoom) {
            //     // check if the usr
            let message = await this.prisma.privateMessage.create({
                data: {
                    content: payload.content,
                    seen: payload.seen,
                    sender_id: payload.sender_id,
                    receiver_id: payload.receiver_id,
                chatRoom_id: payload.chatRoom_id,
                }
            });
            if (!message) {
                throw new HttpException("Error creating private message", 500);
            }
            console.log("Private message: ", message);
            await this.prisma.privateChatRoom.update({
                where: {
                    id: privateRoom.id
                },
                data: {
                    lastUpdatedTime: new Date()
                }
            });
            console.log("We're sending the event to room: ", privateRoom);
            // if not both sockets are connected , we send a private 
            server.to(privateRoom.id).emit('newPrivateMessage', message);

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                console.log("Error: ", error);
                throw new HttpException("Private chat doesn't exist", 404);
            }

        }
    }


    async getPrivateChatRoom(senderId: string, receiverId: string): Promise<PrivateChatRoom> {
        // console.log("We've got a request to get private chat room with id: ", await this.getRoomId(senderId, receiverId));
        const privatChatRoom = await this.prisma.privateChatRoom.findUnique({
            where: {
                id: await this.getRoomId(senderId, receiverId)
            }
        });
        return privatChatRoom;
    }

    // getters
    async getPrivateChatRooms(userId: string, limit: string): Promise<PrivateChatRoom[]> {
        let limitNumber = Number(limit);
        if (isNaN(limitNumber)) {
            limitNumber = 10;
        }
        return await this.prisma.privateChatRoom.findMany({
            where: {
                OR: [
                    {
                        sender_id: userId
                    },
                    {
                        receiver_id: userId
                    }
                ]
            },
            orderBy: {
                lastUpdatedTime: 'desc'
            },
            take: limitNumber
        });
    }

    async getPrivateChatMessages(id: string, queries: { limit: string, offset: string, seen: string, userId: string }): Promise<[number, PrivateMessage[]] | PrivateMessage[]> {
        let { limit, offset, seen, userId } = queries;
        if (seen && !userId || !seen && userId) {
            throw new HttpException('\'userId\' and \'seen\' querie are required either is passed', 400);
        }
        let limitNumber = Number(limit);
        if (isNaN(limitNumber)) {
            limitNumber = 100;
        }
        // check if id of room exists
        const privateChatRoom = await this.prisma.privateChatRoom.findUnique({
            where: {
                id: id
            }
        });
        if (!privateChatRoom) {
            throw new HttpException('Private chat room not found', 404);
        }
        // return all the private messages in the private chat room, sorted by date
        // if seen is passed, get all the messages that seen if (true) or not seen if (false)
        // if (seen == 'true' || seen == 'false') {
        //     console.log("Seen: ", seen);
        // }

        if (seen) {
            const transaction =  await this.prisma.$transaction([
                // get count of all the messages in the private chat room
                this.prisma.privateMessage.count({
                    where: {
                        chatRoom_id: id,
                        seen: seen === 'true' ? true : false
                    }
                }),
                // get all the messages in the private chat room
                this.prisma.privateMessage.findMany({
                    where: {
                        chatRoom_id: id,
                        seen: seen === 'true' ? true : false

                    },
                    orderBy: {
                        dateCreated: 'desc'
                    }
                })
            ]);
        }

        if (isNaN(Number(offset))) {
            offset = '0';
        }
        // if seen is not passed, get all the messages
        return await this.prisma.$transaction([
            // get count of all the messages in the private chat room
            this.prisma.privateMessage.count({
                where: {
                    chatRoom_id: id
                }
            }),
            // get all the messages in the private chat room
            this.prisma.privateMessage.findMany({
                where: {
                    chatRoom_id: id
                },
                orderBy: {
                    dateCreated: 'desc'
                },
                skip: Number(offset),
                take: limitNumber
            }),
        ])

    }
}




