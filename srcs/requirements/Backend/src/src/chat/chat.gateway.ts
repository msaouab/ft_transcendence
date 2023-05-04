
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
        console.log(`Client with id ${id} connected`);
    }

    handleDisconnect(client: Socket) {
        const { id } = client;
        console.log(`Client with id ${id} disconnected`);
    }

    @SubscribeMessage('createPrivateRoom')
    async handleCreateRoom(client: Socket, payload: {
        senderId: string,
        receiverId: string
    }) {
        console.log("We've got the event");
        await this.chatService.CreatePrivateChatRoom(client, payload);
        // 
    }

    @SubscribeMessage('joinRoom')
    async handleJoinRoom(client: Socket, payload: {
        senderId: string,
        receiverId: string
    }) {
        console.log("We've got the event");
    }

    @SubscribeMessage('leaveRoom')
    async handleLeaveRoom(client: Socket, payload: {
        senderId: string,
        receiverId: string
    }) {
        console.log("We've got the event");
    }

    @SubscribeMessage('sendPrivateMessage')
    async handleChat(client: Socket, payload: createMessageDto) {
        console.log("We've got the event");
        return await this.chatService.sendPrivateMessage(client, payload);
    }



    // @SubscribeMessage('chatPrivately')
    // async handlePrivateChat(client: Socket, payload: createMessageDto) {
    //     console.log("We've got the event");
    //     return await this.chatService.sendPrivateMessage(client, payload);
    // }

}


