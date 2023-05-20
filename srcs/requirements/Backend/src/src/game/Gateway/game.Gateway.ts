import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GameService } from "../game.service";
import { createHash } from "crypto";
import { PrismaService } from "prisma/prisma.service";
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	Req,
} from "@nestjs/common";
import { Response, Request } from "express";
import { UserService } from "src/user/user.service";
import { string } from "joi";
// import io from "socket.io-client";

@WebSocketGateway({
	cors: {
		origin: "*",
	},
	namespace: "game",
})
export class GameGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server: Server;

	constructor(
		// private gameService: GameService,
		private prisma: PrismaService,
		private UserService: UserService
	) {}

	// private roomArr: { [key: string]: Socket[] } = {};
	private roomMap = new Map();
	private roomObj: {
		members: number;
		socket: Socket[];
		player1: { id: string };
		player2: { id: string };
		score: { player1: number; player2: number };
		status: "waiting" | "OnGoing" | "Finished";
		type: "Time" | "Round";
		mode: "random" | "friend";
	}
	handleConnection(client) {
		console.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
		this.roomMap.forEach((value, key) => {
			if (value.player1.id === client.handshake.query.userId || value.player2.id === client.handshake.query.userId) {
				value.members--;
				const index = value.socket.indexOf(client);
				if (index !== -1) {
					value.socket.splice(index, 1);
					client.leave(client.id);
					if (value.members === 0) {
						this.roomMap.delete(key);
					}
					else if (value.members === 1) {
						if (value.player1.id === client.handshake.query.userId.toString())
							value.player1 = { id: "" };
						else
							value.player2 = { id: "" };
						value.status = "Finished";
					}
				}
			}
			if (value.status === 'Finished')
				this.roomMap.delete(key);
		});
		console.log('room disconnected: ', this.roomMap);
	}

	private IPlayer: {
		roomId: string,
		player1: {
			id: string,
			name: string,
		},
		player2: {
			id: string,
			name: string,
		},
	};
	afterInit(server: any) {
		console.log("WebSocket server initialized");
	}
	// key: { width: 80, height: 10, x: 310, y: 980 }
	@SubscribeMessage("requesteMouse")
	async handleKey(client: Socket, data: any) {
		if (data.x >= 0 && data.x <= data.width && data.y <= data.height && data.y >= data.height / 2) {
			let oldX;
			if (data.player1X.x - 10 >= data.x) {
				data.player1X.x -= 7;
				this.server.emit("responseMouse", data);
				oldX = data.x;
			}
			else if (data.player1X.x <= data.x && data.player1X.x + 80 <= data.width) {
				data.player1X.x += 7;
				this.server.emit("responseMouse", data);
			}
			else if (data.x <= 40 && data.x >= oldX) {
				data.player1X.x = 0;
				this.server.emit("responseMouse", data);
				oldX = data.x;
			}
		}
	}

	@SubscribeMessage("requesteBall")
	async handleBall(client: Socket, data: any) {
		const { ball, player1X, player2X, width, height, setScore } = data;
		// console.log("data:", ball);
		// let { x, y, r, vx, vy } = ball;
		const newX = ball.x + ball.vx;
		const newY = ball.y + ball.vy;
		if (newX - ball.r <= 0 || newX + ball.r >= width)
			// wall collision
			ball.vx = -ball.vx;
		if (newY - ball.r <= 0 || newY + ball.r >= height)
			// wall collision
			ball.vy = -ball.vy;
		if (
			newY + ball.r >= player1X.y &&
			newX >= player1X.x &&
			newX <= player1X.x + player1X.width
		)
			// player1 collision
			ball.vy = -Math.abs(ball.vy);
		if (
			newY - ball.r <= player2X.y + player2X.height &&
			newX >= player2X.x &&
			newX <= player2X.x + player2X.width
		)
			// player2 collision
			ball.vy = Math.abs(ball.vy);
		if (newY + ball.r >= player1X.y + player1X.height) {
			// player1 score
			// setScore((prev) => ({ ...prev, player2: prev.player2 + 1 }));
			ball.vx = -3;
			ball.vy = -3;
			ball.x = width / 2;
			ball.y = height / 2;
		}
		if (newY - ball.r <= player2X.y) {
			// player2 score
			// setScore((prev) => ({ ...prev, player1: prev.player1 + 1 }));
			ball.vx = 3;
			ball.vy = 3;
			ball.x = width / 2;
			ball.y = height / 2;
		}
		this.server.emit("responseBall", ball);
	}

	AvailableRoom(client: any, roomMap: any, payload: any): boolean {
		let AvailableRoom: boolean = true;
		console.log("roomMap:", roomMap.size, 'socket.id', client.id);
		if (roomMap.size > 0) {
			roomMap.forEach((value, key) => {
				if (value.members < 2 && value.type === payload.type && value.mode === payload.mode) {
					if (value.player1.id === '') {
						value.player1 = { id: client.handshake.query.userId.toString() };
					}
					else if (value.player2.id === '') {
						value.player2 = { id: client.handshake.query.userId.toString() };
						value.status = "OnGoing";
						value.members++;
						value.socket.push(client);
						value.score = { player1: 0, player2: 0 };
						value.type = payload.type;
						value.mode = payload.mode;
					}
					client.join(key);
					this.server.emit("joinedRoom", key, this.IPlayer);
					this.CreateRoom(value.player1.id, value.player2.id, value.type, value.mode);
					AvailableRoom = false;
				}
			});
		}
		return AvailableRoom;
	}

	@SubscribeMessage("joinRoom")
	async handleJoinRoom(client: Socket, payload: any) {
		let avialableRoom: boolean = this.AvailableRoom(client, this.roomMap, payload);
		console.log("avialableRoom:", avialableRoom);
		console.log("payload:", payload);
		if (avialableRoom && payload.type && payload.mode) {
			console.log('payload:', payload);
			const key = createHash("sha256").update(Date.now().toString()).digest("hex");
			this.roomObj = {
				members: 1,
				socket: [client],
				player1: { id: client.handshake.query.userId.toString() },
				player2: { id: "" },
				score: { player1: 0, player2: 0 },
				status: "waiting",
				type: payload.type,
				mode: payload.mode,
			}
			this.roomMap.set(key, this.roomObj);
			client.join(key);
			this.server.emit("joinedRoom", key);
		}
		this.roomMap.forEach((value, key) => {
			if (value.status === 'Finished') {
				this.roomMap.delete(key);
			}
		});
		console.log("roomMap => :", this.roomMap);
		// console.log("roomArr:", this.roomArr);
		// const room = "testRoom";
		// client.join(room);
		// const adapter = this.server.adapter as any;
		// const roomsize = adapter.rooms?.get(room) // .size ?? 0;
		// console.log("roomsize: ", roomsize);
		// console.log(client.handshake.query);
	}

	async CreateRoom(userId1, userId2, type: string, mode: string) {
		try {
			const Benome = await this.UserService.getUser(userId2);
			if (!Benome) { throw new BadRequestException("User not found") }
			const player = await this.UserService.getUser(userId1);
			await this.prisma.user.update({
				where: { id: player.id },
				data: { status: 'InGame' },
			});
			await this.prisma.user.update({
				where: { id: Benome.id },
				data: { status: 'InGame' },
			});
			const newRoom = await this.prisma.game.create({
				data: {
					dateCreated: new Date(),
					player1_id: player.id,
					player2_id: Benome.id,
					player1_pts: 0,
					player2_pts: 0,
					gameStatus: "OnGoing",
				}
			});
			const roomId = newRoom.id;
			return newRoom;
		}
		catch (e) { throw new BadRequestException(e.message) }
	}

	@SubscribeMessage("Move")
	async handleMove(client, data: any) {
		// console.log(client.id, data);
	}
}
