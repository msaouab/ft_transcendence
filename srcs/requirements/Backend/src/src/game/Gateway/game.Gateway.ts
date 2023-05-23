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
		player1: {
			id: string;
			x: number;
			y: number;
			width: number;
			height: number;
		};
		player2: {
			id: string;
			x: number;
			y: number;
			width: number;
			height: number;
		};
		score: { player1: number; player2: number };
		status: "waiting" | "OnGoing" | "Finished";
		type: "Time" | "Round";
		mode: "random" | "friend";
	};
	handleConnection(client) {
		console.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
		this.roomMap.forEach((value, key) => {
			if (
				value.player1.id === client.handshake.query.userId ||
				value.player2.id === client.handshake.query.userId
			) {
				value.members--;
				const index = value.socket.indexOf(client);
				if (index !== -1) {
					value.socket.splice(index, 1);
					client.leave(client.id);
					if (value.members === 0) {
						this.roomMap.delete(key);
					} else if (value.members === 1) {
						if (value.player1.id === client.handshake.query.userId.toString())
							value.player1 = { id: "" };
						else value.player2 = { id: "" };
						value.status = "Finished";
					}
				}
			}
			if (value.status === "Finished") this.roomMap.delete(key);
		});
		console.log("room disconnected: ", this.roomMap);
	}

	private IPlayer: {
		roomId: string;
		player1: {
			id: string;
			name: string;
		};
		player2: {
			id: string;
			name: string;
		};
	};

	private ball: {
		x: number;
		y: number;
		r: 10;
		dx: number;
		dy: number;
		speed: number;
		c: string;
	};

	afterInit(server: any) {
		console.log("WebSocket server initialized");
	}

	async getRoom(userId: string): Promise<string | undefined> {
		let roomId: string | undefined;
		this.roomMap.forEach((value, key) => {
			if (value.player1.id === userId || value.player2.id === userId)
				roomId = key;
		});
		return roomId;
	}
	// key: { width: 80, height: 10, x: 310, y: 980 }
	@SubscribeMessage("requesteMouse")
	async handleKey(client: Socket, data: any) {
		const userId = client.handshake.query.userId.toString();
		const roomId = await this.getRoom(userId);
		if (
			!roomId ||
			this.roomMap.get(roomId).player1.id === "" ||
			this.roomMap.get(roomId).player2.id === ""
		)
			return;
		const room = this.roomMap.get(roomId);
		
		console.log("requestMouse: ", data);
		room.player1.x = data.player1X.x;
		room.player1.y = data.player1X.y;
		room.player1.width = data.player1X.width;
		room.player1.height = data.player1X.height;
		room.player2.x = data.player2X.x;
		room.player2.y = data.player2X.y;
		room.player2.width = data.player2X.width;
		room.player2.height = data.player2X.height;
		if (
			data.x >= 0 &&
			data.x <= data.width &&
			data.y <= data.height &&
			data.y >= data.height / 2
		) {
			if (data.player1X.x >= data.x) {
				data.player1X.x -= 12;
				data.player2X.x = data.width - data.player1X.x - data.player1X.width;
				this.server.to(client.id).emit("responseMouse", data.player1X);
				const opponentSocketId =
					client.id === room.socket[0].id
						? room.socket[1].id
						: room.socket[0].id;
				this.server.to(opponentSocketId).emit("responsePlayer2", data.player2X);
			} else if (
				data.player1X.x <= data.x - 50 &&
				data.player1X.x <= data.width
			) {
				data.player1X.x += 12;
				data.player2X.x = data.width - data.player1X.x - data.player1X.width;
				this.server.to(client.id).emit("responseMouse", data.player1X);
				const opponentSocketId =
					client.id === room.socket[0].id
						? room.socket[1].id
						: room.socket[0].id;
				this.server.to(opponentSocketId).emit("responsePlayer2", data.player2X);
			}
			room.player1.x = data.player1X.x;
			room.player2.x = data.player2X.x;
			room.player1.y = data.player1X.y;
			room.player2.y = data.player2X.y;
			room.player1.width = data.player1X.width;
			room.player2.width = data.player2X.width;
			room.player1.height = data.player1X.height;
			room.player2.height = data.player2X.height;
		}
	}

	// @SubscribeMessage("requesteBall")
	async handleBall(
		client: Socket,
		roomId: string,
		width: number,
		height: number
	) {
		const room = this.roomMap.get(roomId);
		console.log("ball from room:", room);
		this.ball = {
			x: width / 2,
			y: height / 2,
			r: 10,
			dx: 4,
			dy: 4,
			speed: 1,
			c: "#fff",
		};
		const intervalId = setInterval(() => {
			const newX = this.ball.x + this.ball.dx;
			const newY = this.ball.y + this.ball.dy;
			if (newX - this.ball.r <= 0 || newX + this.ball.r >= width)
				// wall collision
				this.ball.dx = -this.ball.dx;
			if (newY - this.ball.r <= 0 || newY + this.ball.r >= height)
				// wall collision
				this.ball.dy = -this.ball.dy;

			if (this.ball.x + this.ball.r >= room.player1.x) {}
			// if (
			// 	newY + this.ball.r >= room.player1.y &&
			// 	newX >= room.player1.x &&
			// 	newX <= room.player1.x + room.player1.width
			// )
			// 	// player1 collision
			// 	this.ball.dy = -Math.abs(this.ball.dy);
			// if (
			// 	newY - this.ball.r <= room.player2.y + room.player2.height &&
			// 	newX >= room.player2.x &&
			// 	newX <= room.player2.x + room.player2.width
			// )
			// 	// player2 collision
			// 	this.ball.dy = Math.abs(this.ball.dy);
			// else if (newY + this.ball.r >= room.player1.y + room.player1.height) {
			// 	// player1 score
			// 	// setScore((prev) => ({ ...prev, player2: prev.player2 + 1 }));
			// 	this.ball.dx = -3;
			// 	this.ball.dy = -3;
			// 	this.ball.x = width / 2;
			// 	this.ball.y = height / 2;
			// }
			// if (newY - this.ball.r <= room.player2.y) {
			// 	// player2 score
			// 	// setScore((prev) => ({ ...prev, player1: prev.player1 + 1 }));
			// 	this.ball.dx = 3;
			// 	this.ball.dy = 3;
			// 	this.ball.x = width / 2;
			// 	this.ball.y = height / 2;
			// }
			this.ball.x += this.ball.dx;
			this.ball.y += this.ball.dy;

			const client1Ball = { ...this.ball }; // Create a copy of the ball object
			const client2Ball = { ...this.ball }; // Create a copy of the ball object
			// Send ball position to client 1
			this.server.to(room.socket[0].id).emit("responseBall", client1Ball);
			// Reverse ball position for client 2
			client2Ball.x = width - client2Ball.x;
			client2Ball.y = height - client2Ball.y;
			this.server.to(room.socket[1].id).emit("responseBall", client2Ball);
		}, 1000 / 60);
	}

	@SubscribeMessage("requestBall")
	AvailableRoom(client: any, roomMap: any, payload: any): boolean {
		let AvailableRoom: boolean = true;
		console.log("roomMap:", roomMap.size, "socket.id", client.id);
		if (roomMap.size > 0) {
			roomMap.forEach((value, key) => {
				if (
					value.members < 2 &&
					value.type === payload.type &&
					value.mode === payload.mode
				) {
					if (value.player1.id === "") {
						value.player1 = { id: client.handshake.query.userId.toString() };
					} else if (value.player2.id === "") {
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
					this.CreateRoom(
						value.player1.id,
						value.player2.id,
						value.type,
						value.mode
					);
					this.handleBall(client, key, payload.width, payload.height);
					AvailableRoom = false;
				}
			});
		}
		return AvailableRoom;
	}

	@SubscribeMessage("joinRoom")
	async handleJoinRoom(client: Socket, payload: any) {
		let avialableRoom: boolean = this.AvailableRoom(
			client,
			this.roomMap,
			payload
		);
		console.log("avialableRoom:", avialableRoom);
		console.log("payload:", payload);
		if (
			avialableRoom &&
			payload.type &&
			payload.mode &&
			payload.mode !== "play vs player"
		) {
			console.log("payload:", payload);
			const key = createHash("sha256")
				.update(Date.now().toString())
				.digest("hex");
			this.roomObj = {
				members: 1,
				socket: [client],
				player1: {
					id: client.handshake.query.userId.toString(),
					x: 0,
					y: 0,
					width: 0,
					height: 0,
				},
				player2: { id: "", x: 0, y: 0, width: 0, height: 0 },
				score: { player1: 0, player2: 0 },
				status: "waiting",
				type: payload.type,
				mode: payload.mode,
			};
			this.roomMap.set(key, this.roomObj);
			client.join(key);
			this.server.emit("joinedRoom", key);
		}
		this.roomMap.forEach((value, key) => {
			if (value.status === "Finished") {
				this.roomMap.delete(key);
			}
		});
		console.log("roomMap => :", this.roomMap);
	}

	async CreateRoom(userId1, userId2, type: string, mode: string) {
		try {
			const Benome = await this.UserService.getUser(userId2);
			if (!Benome) {
				throw new BadRequestException("User not found");
			}
			const player = await this.UserService.getUser(userId1);
			await this.prisma.user.update({
				where: { id: player.id },
				data: { status: "InGame" },
			});
			await this.prisma.user.update({
				where: { id: Benome.id },
				data: { status: "InGame" },
			});
			const newRoom = await this.prisma.game.create({
				data: {
					dateCreated: new Date(),
					player1_id: player.id,
					player2_id: Benome.id,
					player1_pts: 0,
					player2_pts: 0,
					gameStatus: "OnGoing",
				},
			});
			const roomId = newRoom.id;
			return newRoom;
		} catch (e) {
			throw new BadRequestException(e.message);
		}
	}

	@SubscribeMessage("Move")
	async handleMove(client, data: any) {
		// console.log(client.id, data);
	}
}
