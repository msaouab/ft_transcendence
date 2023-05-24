
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
// import { clients } from 'src/notify/notify.gateway';
// creating a type of rooms , where a room define a map of room id as key and a arr of object that contain 
// the id of the  of the user and it's websocket object 
// type rooms = Map<string, { id: string, client: Socket }[]>;


@Injectable()
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    
    // creating a map of rooms
    // private roomsClientsMap : rooms = new Map();



    private clients: Map<string, Socket> = new Map();
    // adding the chat service to the gateway
    constructor(private chatService: ChatService) { }

    handleConnection(client: Socket) {
        const { id } = client;
        console.log(`Client with id ${id} connected to chat namespace`);
    }
    handleDisconnect(client: Socket) {
        const { id } = client;
        console.log(`Client with id ${id} disconnected`);
        // delete the client from the map
        // this.clients.delete(id);
        // id exist in client.id value in the map


        this.clients.forEach((value, key) => {
            if (value.id === id) {
                this.clients.delete(key);
            }
        });
        
        console.log("the map after deleting the client: ", this.clients.keys());
        // this.roomsClientsMap.forEach((value, key) => {
        //     this.roomsClientsMap.set(key, value.filter(element => element.client.id !== id));
        // });
        // console.log("the map after deleting the client: ", this.roomsClientsMap);
        }
        @SubscribeMessage('alive')
    async handleAlive(client: Socket, payload: {
        id: string,
        
    }) {
        // adding the client to the map
        this.clients.set(payload.id, client);
        console.log("the map after adding the client: ", this.clients.keys());
    }

    


        // delete the client from the map
        // const newClients = this.roomsClientsMap.get(privateRoom.id).filter(clientId => clientId !== payload.currentId);
        // console.log("the new clients after leaving the room: ", newClients);
        // this.roomsClientsMap.set(privateRoom.id, newClients);

       
        // console.log("the map after deleting the client: ", this.roomsClientsMap);

        // this.clients.delete(id);


    // @SubscribeMessage('checkOnline')
    // async handleCheckOnline(client: Socket, payload: {
    //     // currentId: string,
    //     senderId: string,
    //     receiverId: string,
    // }) {
    //     console.log("We've got the event");
    //     // return await this.chatService.checkOnline(client, payload, this.server);
    // }

    

    @SubscribeMessage('joinRoom')
    async handleJoinRoom(client: Socket, payload: {
        currentId: string
        senderId: string,
        receiverId: string, 
    }) { 
        const privateRoom = await this.chatService.joinPrivateChatRoom(client, payload);         
        // if the room is not in the map then add it
        // if(!this.roomsClientsMap.has(privateRoom.id)) {
        //     this.roomsClientsMap.set(privateRoom.id, [{ id: payload.currentId, client }]);
        // } else {
        //     // if the room is in the map then add the client to the array of clients
        //     const newClients = [...this.roomsClientsMap.get(privateRoom.id), { id: payload.currentId, client }];
        //     this.roomsClientsMap.set(privateRoom.id, newClients);
        // }

        // console.log("the map after adding the client: ", this.roomsClientsMap);
        return privateRoom;
    }

    @SubscribeMessage('leaveRoom')
    async handleLeaveRoom(client: Socket, payload: {
        currentId: string
        senderId: string,
        receiverId: string, 
    }) {
        const privateRoom = await this.chatService.leavePrivateChatRoom(client, payload);
       
        // this.roomsClientsMap.forEach((value, key) => {
        //     if (key === privateRoom.id) {
        //         const newClients = this.roomsClientsMap.get(privateRoom.id).filter(element => element.id !== payload.currentId);
        //         console.log("the new clients after leaving the room: ", newClients);
        //         this.roomsClientsMap.set(privateRoom.id, newClients);
        //     }
        // });

        return privateRoom;
    }   

    @SubscribeMessage('sendPrivateMessage')
    async handleChat(client: Socket, payload: createMessageDto) {
        console.log("We've got the event of sending a private message");
        return await  this.chatService.sendPrivateMessage(client, payload, this.server, this.clients);
    }




    // @SubscribeMessage('chatPrivately')
    // async handlePrivateChat(client: Socket, payload: createMessageDto) {
    //     console.log("We've got the event");
    //     return await this.chatService.sendPrivateMessage(client, payload);
    // }

}


