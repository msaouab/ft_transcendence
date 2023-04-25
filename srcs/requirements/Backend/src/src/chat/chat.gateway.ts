
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
    
    @SubscribeMessage('chatPrivately')
    async handleSendPrivateMessage(client: Socket, payload: {
        senderId: string,
        receiverId: string,
        message: string
    }) {
        console.log("We've got the event");
        return await this.chatService.sendPrivateMessage(client, payload);
    }

}


