/*
The chat.service.ts file contain the 
service class that implements the business logic 
for the chat feature, such as storing or retrieving 
messages from a database
*/



import { Body, HttpException, Injectable, Param, Query } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Socket } from 'socket.io';
import { createHash } from 'crypto';

import { Server } from 'socket.io'
import { MessageService } from './message/message.service';
import {
    PrivateChatRoom,
    PrivateMessage
} from '@prisma/client';

import { GetPrivateChatMessagesDto } from './dto/getPrivateChatRoom.dto';
import {
    Inject,
    forwardRef
} from '@nestjs/common';


// dto's
import { createMessageDto } from './message/message.dto';
import { isInstance } from 'class-validator';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService,
        private MessageService: MessageService
    ) { }

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

    // one note here is that you can check if the room exist or not
    // by only hashing the sender_id,receiver_id and secret key and 
    // check if room id matches that of client sent room id
    // which would reduce a whole db query, anyways...
    async CreatePrivateChatRoom(client: Socket, payload: {
        senderId: string,
        receiverId: string
    }) {
        const { senderId, receiverId } = payload;
        const hashedRoomName = await this.getRoomId(senderId, receiverId);
        // client.join(hashedRoomName);
        // console.log("Im sender and I joined the room: ", hashedRoomName);
        // create the private chat room if it doesn't exist, and if it exist, throw an error
        try {
            const privateChatRoom = await this.prisma.privateChatRoom.create({
                data: {
                    id: hashedRoomName,
                    sender_id: senderId,
                    receiver_id: receiverId
                }
            });
            return privateChatRoom;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                console.log("Error: ", error);
                throw new HttpException("Private chat already exist", 409);
            }
        }
    }


    async joinPrivateChatRoom(client: Socket, payload: {
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
            client.join(privateChatRoom.id);
            console.log(`User with id: ${senderId} joined the private chat room: ${privateChatRoom.id}`);
            return privateChatRoom;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                console.log("Error: ", error);
                throw new HttpException("Private chat doesn't exist", 404);
            }
        }
    }


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
    async sendPrivateMessage(client: Socket, payload: createMessageDto) {
        // if room doesn't exist, call joinPrivateChatRoom
        const subPayload = {
            senderId: payload.sender_id,
            receiverId: payload.receiver_id,
            chatRoomId: payload.chatRoom_id,
            seen: payload.seen,
            content: payload.content

        }
        // const privateRoom = await this.CreatePrivateChatRoom(client, subPayload);
        // return "ok";

        // check if privatchatroom exist.
        try {
            const privateRoom = await this.prisma.privateChatRoom.findUnique({
                where: {
                    id: await this.getRoomId(payload.sender_id, payload.receiver_id),
                },
            })
            console.log("Private room: ", privateRoom);
            // if client socket is not joined to the private chat room, throw an exception
            if (!client.rooms.has(privateRoom.id)) {
                throw new HttpException("You're not in the private chat room", 403);
            }
            // create a new private message, and adds it to the private chat room
            const privateMessage = await this.MessageService.createPrivateChatMessage(payload);
            await this.prisma.privateChatRoom.update({
                where: {
                    id: privateRoom.id
                },
                data: {
                    lastUpdatedTime: new Date()
                }
            });
            console.log("We're sending the event to room: ", privateRoom);
            // send the private message to the all the clients in the private chat room
            client.to(privateRoom.id).emit('chatPrivately', privateMessage);

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                console.log("Error: ", error);
                throw new HttpException("Private chat doesn't exist", 404);
            }

        }
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
        if (seen) {

            return await this.prisma.$transaction([
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
                        dateCreated: 'asc'
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
                    dateCreated: 'asc'
                },
                skip: Number(offset),
                take: limitNumber
            }),
        ])

    }
}




