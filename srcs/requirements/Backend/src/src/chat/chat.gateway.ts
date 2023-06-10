
/*
the chat.gateway.ts contain your gateway class that
handles the WebSocket communication with the clients
*/


import { Injectable } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';


import { ChatService } from './chat.service';
import { createMessageDto } from './message/message.dto';
// import { Message } from './message.interface';


@Injectable()
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;


    // adding the chat service to the gateway
    constructor(private chatService: ChatService) { }

    handleConnection(client: Socket) {
        const { id } = client;
        console.log(`Client with id ${id} connected to chat namespace`);
    }

    handleDisconnect(client: Socket) {
        const { id } = client;
        console.log(`Client with id ${id} disconnected`);
    }


    @SubscribeMessage('checkOnline')
    async handleCheckOnline(client: Socket, payload: {
        // senderId: string,
        receiverId: string
    }) {
        // return await this.chatService.checkOnline(client, payload, this.server);
    }


    // @SubscribeMessage('createPrivateRoom')
    // async handleCreateRoom(client: Socket, payload: {
    //     senderId: string,
    //     receiverId: string
    // }) {
    //     return await this.chatService.CreatePrivateChatRoom(client, payload, this.server);
    //     // this.server.to(privatChatRoom.id).emit('privateRoomCreated', privatChatRoom);
    //     // client.emit(callback, privatChatRoom);
    // }

    // 



    @SubscribeMessage('joinRoom')
    async handleJoinRoom(client: Socket, payload: {
        senderId: string,
        receiverId: string
    }) {
        return await this.chatService.joinPrivateChatRoom(client, payload);
    }

    @SubscribeMessage('leaveRoom')
    async handleLeaveRoom(client: Socket, payload: {
        senderId: string,
        receiverId: string
    }) {
        // return aw
        return await this.chatService.leavePrivateChatRoom(client, payload);
    }

    @SubscribeMessage('sendPrivateMessage')
    async handleChat(client: Socket, payload: createMessageDto) {
        return await this.chatService.sendPrivateMessage(client, payload, this.server);

    }



    // @SubscribeMessage('chatPrivately')
    // async handlePrivateChat(client: Socket, payload: createMessageDto) {
    //     return await this.chatService.sendPrivateMessage(client, payload);
    // }

}


