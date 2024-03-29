import { HttpException, Injectable } from "@nestjs/common";
import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { NotificationService } from "./notify.service";
// import { NotificationService } from './notifications.service';
import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";

export const clients = new Map<string, Socket>();
@Injectable()
@WebSocketGateway(
	{ 
	// 	cors: {
	// origin: 'http://' + process.env.HOSTNAME +':5173',
	
// },  

namespace: "/" })
export class NotificationGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server;

	constructor(private notificationService: NotificationService) {}
	// private clients  = new Map<string, Socket>();
	@SubscribeMessage("realStatus")
	async handleStatus(
		client: Socket,
		payload: {
			id: string;
			userStatus: boolean;
		}
	) {
		const { id, userStatus } = payload;
		// console.log("---------------------- We've got the event to add the client to the map");

		// if id is not valid
		if (!id) {
			throw new HttpException("Invalid id", 400);
		}

		// console.log("We've got the event to add the client to the map");

		clients.set(id, client);
		await this.notificationService.updateUserStatus(id, userStatus);
	}

	handleConnection(client: Socket) {
		const { id } = client;
	}

	async handleDisconnect(client: Socket) {
		const { id } = client;
		const user = [...clients.entries()].find(({ 1: v }) => v.id === client.id);
		// if user is not found , return
		if (user) {
			const key = user[0] === undefined ? "" : user[0];
			clients.delete(key);
			if (key === "") {
				return;
			}
			await this.notificationService.updateUserStatus(key, false);
		}
	}
}
