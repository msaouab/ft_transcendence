/*
The chat.service.ts file contain the 
service class that implements the business logic 
for the chat feature, such as storing or retrieving 
messages from a database
*/



import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Socket } from 'socket.io';
import { createHash } from 'crypto';
import { UserService } from 'src/user/user.service';
import { Server } from 'socket.io'
import {
    PrivateChatRoom,
    PrivateMessage
} from '@prisma/client';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService,
        private readonly UserService: UserService,
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

    async joinPrivateChatRoom(client: Socket, payload: {
        senderId: string,
        receiverId: string
    }) {
        const { senderId, receiverId } = payload;
        const hashedRoomName = await this.getRoomId(senderId, receiverId);
        client.join(hashedRoomName);
        console.log("Im sender and I joined the room: ", hashedRoomName);
        // if senderId or receiverId doesn't exist, return 404
        await this.UserService.getUser(senderId);
        await this.UserService.getUser(receiverId);
        // create a new private chat room if it doesn't exist
        const privateChatRoom = await this.prisma.privateChatRoom.findUnique({
            where: {
                id: hashedRoomName
            }
        });
        if (privateChatRoom) {
            return privateChatRoom;
        } else {
            return await this.prisma.privateChatRoom.create({
                data: {
                    id: hashedRoomName,
                    sender_id: senderId,
                    receiver_id: receiverId
                }
            });

        }
    }

    /* sendPrivateMessage(senderId: string, receiverId: string, message: string) */
    async sendPrivateMessage(client: Socket, payload: {
        senderId: string,
        receiverId: string,
        message: string
    }) {
        // if room doesn't exist, call joinPrivateChatRoom
        const privateRoom = await this.joinPrivateChatRoom(client, payload);
        // if (privateRoom == undefined) {
        //     throw new HttpException('User not found', 404);
        // }
        const { senderId, receiverId, message } = payload;
        // generate a new private message  id 
        const privateMessageId = privateRoom.id + '-' + senderId + '-' + receiverId + '-' + new Date().getTime();


        // create a new private message, and adds it to the private chat room
        const privateMessage = await this.prisma.privateMessage.create({
            data: {
                id: privateMessageId,
                content: message,
                chatRoom_id: privateRoom.id
            }
        });
        console.log("We're sending the event to room: ", privateRoom);
        // send the private message to the all the clients in the private chat room 
        client.to(privateRoom.id).emit('chatPrivately', privateMessage);
    }

}









