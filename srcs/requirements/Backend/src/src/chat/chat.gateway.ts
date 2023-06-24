
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
@WebSocketGateway({
//     cors: {
//         origin: 'http://' + process.env.HOSTNAME +':5173',
        
//  }, 
 namespace: 'chat'
})
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
        this.clients.forEach((value, key) => {
            if (value.id === id) {
                this.clients.delete(key);
            }
        });
        }
        @SubscribeMessage('alive')
    async handleAlive(client: Socket, payload: {
        id: string,
        
    }) {
        // adding the client to the map
        this.clients.set(payload.id, client);
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
        return privateRoom;
    }

    @SubscribeMessage('leaveRoom')
    async handleLeaveRoom(client: Socket, payload: {
        currentId: string
        senderId: string,
        receiverId: string, 
    }) {
        const privateRoom = await this.chatService.leavePrivateChatRoom(client, payload);
        return privateRoom;
    }   

    @SubscribeMessage('sendPrivateMessage')
    async handleChat(client: Socket, payload: createMessageDto) {
        return await  this.chatService.sendPrivateMessage(client, payload, this.server, this.clients);
    }




    // @SubscribeMessage('chatPrivately')
    // async handlePrivateChat(client: Socket, payload: createMessageDto) {
    //     console.log("We've got the event");
    //     return await this.chatService.sendPrivateMessage(client, payload);
    // }

    @SubscribeMessage('joinGroupRoom')
    async handleJoinGroupRoom(client: Socket, payload: any) {
        console.log("We've got the event to join a group room");
        return await this.chatService.joinGroupChatRoom(client, payload, this.server);
    }

    @SubscribeMessage('leaveGroupRoom')
    async handleLeaveGroupRoom(client: Socket, payload: any) {
        console.log("We've got the event to leave a group room");
        return await this.chatService.leaveGroupChatRoom(client, payload, this.server);
    }

    @SubscribeMessage('sendGroupMessage')
    async handleGroupChat(client: Socket, payload: any) {
        console.log("We've got the event to send a group message: ", payload);
        return await this.chatService.sendGroupMessage(client, payload, this.server);
    }

    @SubscribeMessage('addChannelMember')
    async handleAddChannelMember(client: Socket, payload: any) {
        console.log("We've got the event to add a channel member: ", payload);
        return await this.chatService.addChannelMember(client, payload, this.server);
    }

    @SubscribeMessage('addAdmin')
    async handleAddChannelAdmin(client: Socket, payload: any) {
        console.log("We've got the event to add a channel admin: ", payload);
        return await this.chatService.addChannelAdmin(client, payload, this.server);
    }
    @SubscribeMessage('removeAdmin')
    async handleRemoveChannelAdmin(client: Socket, payload: any) {
        console.log("We've got the event to remove a channel admin: ", payload);
        return await this.chatService.removeChannelAdmin(client, payload, this.server);
    }
    @SubscribeMessage('muteUser')
    async handleMuteUser(client: Socket, payload: any) {
        console.log("We've got the event to mute a user: ", payload);
        return await this.chatService.muteUser(client, payload, this.server);
    }
    @SubscribeMessage('unmuteUser')
    async handleUnmuteUser(client: Socket, payload: any) {
        console.log("We've got the event to unmute a user: ", payload);
        return await this.chatService.unmuteUser(client, payload, this.server);
    }
    @SubscribeMessage('kickUser')
    async handleKickUser(client: Socket, payload: any) {
        console.log("We've got the event to kick a user: ", payload);
        return await this.chatService.kickUser(client, payload, this.server);
    }
    @SubscribeMessage('banUser')
    async handleBanUser(client: Socket, payload: any) {
        console.log("We've got the event to ban a user: ", payload);
        return await this.chatService.banUser(client, payload, this.server);
    }
    @SubscribeMessage('unbanUser')
    async handleUnbanUser(client: Socket, payload: any) {
        console.log("We've got the event to unban a user: ", payload);
        return await this.chatService.unbanUser(client, payload, this.server);
    }
    @SubscribeMessage('joinPrivateChannel')
    async handleJoinPrivateChannel(client: Socket, payload: any) {
        console.log("We've got the event to join a private channel: ", payload);
        return await this.chatService.joinPrivateChannel(client, payload, this.server);
    }
    @SubscribeMessage('sendMessageG')
    async handleSendMessageG(client: Socket, payload: any) {
        console.log("We've got the event to send a message in a group: ", payload);
        return await this.chatService.sendMessageG(client, payload, this.server);
    }
    @SubscribeMessage('leaveChannel')
    async handleLeaveChannel(client: Socket, payload: any) {
        console.log("We've got the event to leave a channel: ", payload);
        return await this.chatService.leaveChannel(client, payload, this.server);
    }
    @SubscribeMessage('deleteChannel')
    async handleDeleteChannel(client: Socket, payload: any) {
        console.log("We've got the event to delete a channel: ", payload);
        return await this.chatService.deleteChannel(client, payload, this.server);
    }
    @SubscribeMessage('createChannel')
    async handleCreateChannel(client: Socket, payload: any) {
        console.log("We've got the event to create a new channel: ", payload);
        return await this.chatService.createChannel(client, payload, this.server);
    }
    @SubscribeMessage('updateChannelPassword')
    async handleUpdateChannelPassword(client: Socket, payload: any) {
        console.log("We've got the event to update a channel password: ", payload);
        return await this.chatService.updateChannelPassword(client, payload, this.server);
    }
}


