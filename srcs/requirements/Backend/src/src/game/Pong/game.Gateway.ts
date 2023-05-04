import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway, 
	WebSocketServer
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
	cors:{
		origin: "*",
	}, 
	namespace: 'game'
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	
	@SubscribeMessage('createGame')
	async handleMove(client, data) {
		this.server.emit('paddleUpdate', data);
	}
	@SubscribeMessage('move')
	async handleCreateGame(client, data) {
		this.server.emit('paddleUpdate', data);
	}
	handleDisconnect(client) {
		console.log(`Client disconnected: ${client.id}`);
	}
	handleConnection(client) {
		console.log(`Client connected: ${client.id}`);
		this.server.emit('HELLO', "Player joined");
	}
	afterInit(server: any) {
		console.log('WebSocket server initialized');
	}
}
