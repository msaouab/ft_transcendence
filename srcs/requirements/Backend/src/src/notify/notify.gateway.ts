

import { HttpException, Injectable } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notify.service';
// import { NotificationService } from './notifications.service';


@Injectable()
@WebSocketGateway({ namespace: '/' })
export class NotificationGateway {
    @WebSocketServer()
    server: Server;
    
    constructor(private notificationService: NotificationService) { }
    private clients  = new Map<string, Socket>();

    @SubscribeMessage('status')
    async handleStatus(client: Socket, payload: {
        id: string,
        userStatus: string,
    }) {
        const { id, userStatus } = payload;
        console.log("id : ", id);
        console.log("userStatus : ", userStatus);
        // console.log("We've got the event to add the client to the map"); 
        this.clients.set(id, client);
        console.log("keys: ", this.clients.keys());
        await this.notificationService.updateUserStatus(id, userStatus);
    }

    handleConnection(client: Socket, ) {
        const { id } = client; 
        console.log(`Client with id ${id} connected to root namespace`);
    }
    async handleDisconnect(client: Socket) {
        const { id } = client;
        console.log(`Client with id ${id} disconnected`);
        const user = [...this.clients.entries()].find(({ 1: v }) => v.id === client.id);
        if (user) {

            const key = user[0] === undefined ? '' : user[0];
            
            this.clients.delete(key);
            
            await this.notificationService.updateUserStatus(key, 'Offline');
        }
    }
}