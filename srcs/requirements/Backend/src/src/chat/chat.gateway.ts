
/*
the chat.gateway.ts contain your gateway class that
handles the WebSocket communication with the clients
*/


import { Injectable } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
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
        // this.clients.delete(id);
    }


    @SubscribeMessage('checkOnline')
    async handleCheckOnline(client: Socket, payload: {
        // currentId: string,
        senderId: string,
        receiverId: string,
    }) {
        console.log("We've got the event");
        // return await this.chatService.checkOnline(client, payload, this.server);
    }

    @SubscribeMessage('alive')
    async handleAlive(client: Socket, payload: {
        id: string,
        
    }) {
        // this.clients.set(payload.id, client);
        console.log("We've got the event to add the client to the map");
        // return await this.chatService.checkOnline(client, payload, this.server);
    }

    @SubscribeMessage('joinRoom')
    async handleJoinRoom(client: Socket, payload: {
        senderId: string,
        receiverId: string
    }) { 
        const privateRoom = await this.chatService.joinPrivateChatRoom(client, payload);
        return privateRoom;
    }

    @SubscribeMessage('leaveRoom')
    async handleLeaveRoom(client: Socket, payload: {
        senderId: string,
        receiverId: string
    }) {
        const privateRoom = await this.chatService.leavePrivateChatRoom(client, payload);
        return privateRoom;
    }   

    @SubscribeMessage('sendPrivateMessage')
    async handleChat(client: Socket, payload: createMessageDto) {
        console.log("We've got the event of sending a private message");
        // return await this.chatService.sendPrivateMessage(client, payload, this.server, this.clients);
        return await  this.chatService.sendPrivateMessage(client, payload, this.server);

    }




    // @SubscribeMessage('chatPrivately')
    // async handlePrivateChat(client: Socket, payload: createMessageDto) {
    //     console.log("We've got the event");
    //     return await this.chatService.sendPrivateMessage(client, payload);
    // }

}


