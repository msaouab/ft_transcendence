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
import { AchvService } from "src/achievements/achv.service";
// import { date } from "joi";
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
		private prisma: PrismaService,
		private UserService: UserService // private readonly achvService: AchvService
	) {}

	private roomMap = new Map();
	private roomObj: {
		members: number;
		socket: Socket[];
		player1: {
			id: string;
			score: number;
			paddle1: {
				x: number;
				y: number;
				width: number;
				height: number;
			};
			paddle2: {
				x: number;
				y: number;
				width: number;
				height: number;
			};
		};
		player2: {
			id: string;
			score: number;
			paddle1: {
				x: number;
				y: number;
				width: number;
				height: number;
			};
			paddle2: {
				x: number;
				y: number;
				width: number;
				height: number;
			};
		};
		ball: {
			x: number;
			y: number;
			r: 10;
			dx: number;
			dy: number;
			speed: number;
			c: string;
		};
		status: "waiting" | "OnGoing" | "Finished";
		type: "Time" | "Round";
		mode: "Random" | "Friend" | "Bot";
		time: number;
	};
	// private ball: {
	// 	x: number;
	// 	y: number;
	// 	r: 10;
	// 	dx: number;
	// 	dy: number;
	// 	speed: number;
	// 	c: string;
	// };

	afterInit(server: any) {
		console.log(`WebSocket server initialized ${server}`);
	}
	handleConnection(client) {
		console.log(`Client connected: ${client.id}`);
	}
	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
		this.roomMap.forEach((value, key) => {
			if (
				value.player1.id === client.handshake.query.userId.toString() ||
				value.player2.id === client.handshake.query.userId.toString()
			) {
				value.status = "Finished";
				client.leave(key);
				this.roomMap.delete(key);
			}
		});
		console.log("roomMap Disconnect => :", this.roomMap);
	}

	AvailableRoom(client: Socket, payload, roomMap: any): boolean {
		let AvailableRoom: boolean = false;
		console.log(`roomSize: ${roomMap.size}`);
		if (roomMap.size > 0) {
			roomMap.forEach((value, key) => {
				if (
					value.members === 1 &&
					value.type === payload.type &&
					value.mode === payload.mode
				) {
					value.members++;
					value.player2 = {
						id: client.handshake.query.userId.toString(),
						score: 0,
						paddle1: {
							x: 0,
							y: 0,
							width: 0,
							height: 0,
						},
						paddle2: {
							x: 0,
							y: 0,
							width: 0,
							height: 0,
						},
					};
					value.status = "OnGoing";
					value.socket.push(client);
					value.time = new Date().getTime();
					client.join(key);
					const room = this.roomMap.get(key);
					this.server.to(room.socket[0].id).emit("BenomeId", room.player2.id);
					this.server.to(room.socket[1].id).emit("BenomeId", room.player1.id);
					this.createPrismaGame(room);
					AvailableRoom = true;
				}
			});
		}
		return AvailableRoom;
	}

	CreateRandomRoom(client: Socket, payload) {
		let avialableRoom: boolean = this.AvailableRoom(
			client,
			payload,
			this.roomMap
		);
		console.log(`avialableRoom: ${avialableRoom}`);
		if (avialableRoom === false) {
			const key = createHash("sha256")
				.update(Date.now().toString())
				.digest("hex");
			console.log(`key: ${key}`);
			this.roomMap.set(key, {
				members: 1,
				socket: [client],
				player1: {
					id: client.handshake.query.userId.toString(),
					score: 0,
					paddle1: {
						x: payload.width / 2 - 40,
						y: 10,
						width: 80,
						height: 10,
					},
					paddle2: {
						x: payload.width / 2 - 40,
						y: payload.height - 20,
						width: 80,
						height: 10,
					},
				},
				player2: {
					id: "",
					score: 0,
					paddle1: {
						x: payload.width / 2 - 40,
						y: 10,
						width: 80,
						height: 10,
					},
					paddle2: {
						x: payload.width / 2 - 40,
						y: payload.height - 20,
						width: 80,
						height: 10,
					},
				},
				ball: {
					x: payload.width / 2,
					y: payload.height / 2,
					r: 10,
					dx: 4,
					dy: 4,
					speed: 1,
					c: "#fff",
				},
				status: "waiting",
				type: payload.type,
				mode: payload.mode,
				time: 0,
			});
		}
	}

	CreateBotRoom(client: Socket, payload) {
		const key = createHash("sha256")
			.update(Date.now().toString())
			.digest("hex");
		if (!key) throw new BadRequestException("Please provide a valid room key");
		console.log(`key: ${key}`);
		this.roomMap.set(key, {
			members: 1,
			socket: [client],
			player1: {
				id: client.handshake.query.userId.toString(),
				score: 0,
				paddle1: {
					x: payload.width / 2 - 40,
					y: 10,
					width: 80,
					height: 10,
				},
				paddle2: {
					x: payload.width / 2 - 40,
					y: payload.height - 20,
					width: 80,
					height: 10,
				},
			},
			player2: {
				id: "Bot",
				score: 0,
				paddle1: {
					x: payload.width / 2 - 40,
					y: 10,
					width: 80,
					height: 10,
				},
				paddle2: {
					x: payload.width / 2 - 40,
					y: payload.height - 20,
					width: 80,
					height: 10,
				},
			},
			ball: {
				x: payload.width / 2,
				y: payload.height / 2,
				r: 10,
				dx: 4,
				dy: 4,
				speed: 1,
				c: "#fff",
			},
			status: "waiting",
			type: payload.type,
			mode: payload.mode,
			time: new Date().getTime(),
		});
		client.join(key);
		// this.server
		// 	.to(client.id)
		// 	.emit("BenomeId", this.roomMap.get(key).player2.id);
	}

	CreateFriendRoom(client: Socket, payload) {}

	@SubscribeMessage("joinRoom")
	async handelJoinRoom(client: Socket, payload: any) {
		if (payload.type && payload.mode) {
			if (payload.mode === "Random") {
				this.CreateRandomRoom(client, payload);
			} else if (payload.mode === "Bot") {
				this.CreateBotRoom(client, payload);
			}
			// else if (payload.mode === "Friend") {
			// 	this.CreateFriendRoom(client, payload);
			// }
			// console.log("roomMap => :", this.roomMap);
		}
	}

	async createPrismaGame(room) {
		console.log("createPrismaGame ==> ", room);
		try {
			const benome = await this.UserService.getUser(room.player1.id);
			if (!benome) throw new BadRequestException("User not found");
			await this.prisma.user.update({
				where: { id: benome.id },
				data: { status: "InGame" },
			});
			const player = await this.UserService.getUser(room.player2.id);
			if (!player) throw new BadRequestException("User not found");
			await this.prisma.user.update({
				where: { id: player.id },
				data: { status: "InGame" },
			});
			const newRoom = await this.prisma.game.create({
				data: {
					id: room.key,
					dateCreated: new Date(),
					player1_id: player.id,
					player2_id: room.player2.id,
					player1_pts: 0,
					player2_pts: 0,
					gameStatus: "OnGoing",
				},
			});
		} catch (e) {
			console.log(e);
		}
	}
}
