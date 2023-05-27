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
		status: "waiting" | "OnGoing" | "Finished";
		type: "Time" | "Round";
		mode: "random" | "friend" | "bot";
		time: number;
	};

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
		if (
			data.x >= 0 &&
			data.x <= data.width &&
			data.y <= data.height &&
			data.y >= data.height / 2
		) {
			if (client.id === room.socket[0].id) {
				if (room.player1.paddle2.x >= data.x) {
					room.player1.paddle2.x -= 12;
					room.player2.paddle1.x += 12;
					this.server
						.to(room.socket[0].id)
						.emit("responseMouse", room.player1.paddle2);
					const opponentSocketId = this.server
						.to(room.socket[1].id)
						.emit("responsePlayer2", room.player2.paddle1);
				} else if (
					room.player1.paddle2.x <= data.x - 50 &&
					room.player1.paddle2.x <= data.width - room.player1.paddle2.width
				) {
					room.player1.paddle2.x += 12;
					room.player2.paddle1.x -= 12;
					this.server
						.to(room.socket[0].id)
						.emit("responseMouse", room.player1.paddle2);
					this.server
						.to(room.socket[1].id)
						.emit("responsePlayer2", room.player2.paddle1);
				}
			}
			if (client.id === room.socket[1].id) {
				if (room.player2.paddle2.x >= data.x) {
					room.player2.paddle2.x -= 12;
					room.player1.paddle1.x += 12;
					this.server
						.to(room.socket[1].id)
						.emit("responseMouse", room.player2.paddle2);
					this.server
						.to(room.socket[0].id)
						.emit("responsePlayer2", room.player1.paddle1);
				} else if (
					room.player2.paddle2.x <= data.x - 50 &&
					room.player2.paddle2.x <= data.width - room.player2.paddle2.width
				) {
					room.player2.paddle2.x += 12;
					room.player1.paddle1.x -= 12;
					this.server
						.to(room.socket[1].id)
						.emit("responseMouse", room.player2.paddle2);
					this.server
						.to(room.socket[0].id)
						.emit("responsePlayer2", room.player1.paddle1);
				}
			}
		}
	}

	RoundScore(roomId: string) {
		const room = this.roomMap.get(roomId);
		if (room.type === "Round")
			if (room.player1.score === 5 || room.player2.score === 5) return true;
		if (room.type === "Time") {
			let lastTime = new Date().getTime();
			return (lastTime - room.time) / 1000 >= 60 ? true : false;
			// if (timeStatus) return true;
		}
		return false;
	}

	// @SubscribeMessage("requesteBall")
	async handleBall(
		client: Socket,
		roomId: string,
		width: number,
		height: number
	) {
		const room = this.roomMap.get(roomId);
		room.time = new Date().getTime();
		this.server.to(room.socket[0].id).emit("StartTime", room.time);
		this.server.to(room.socket[1].id).emit("StartTime", room.time);
		this.ball = {
			x: width / 2,
			y: height / 2,
			r: 10,
			dx: 4,
			dy: 4,
			speed: 1,
			c: "#fff",
		};
		let status = false;
		const intervalId = setInterval(() => {
			if (room.socket.length !== 2) {
				clearInterval(intervalId);
				return;
			}
			const newX = this.ball.x + this.ball.dx;
			const newY = this.ball.y + this.ball.dy;
			// wall collision
			if (newX - this.ball.r <= 0 || newX + this.ball.r >= width)
				this.ball.dx = -this.ball.dx;
			if (newY - this.ball.r <= 0 || newY + this.ball.r >= height)
				this.ball.dy = -this.ball.dy;

			// paddle collision
			if (
				newY + this.ball.r >= room.player1.paddle2.y &&
				newX >= room.player1.paddle2.x &&
				newX <= room.player1.paddle2.x + room.player1.paddle2.width
			)
				// player1 collision
				this.ball.dy = -Math.abs(this.ball.dy);
			if (
				newY - this.ball.r <= room.player1.paddle1.y &&
				newX >= room.player1.paddle1.x &&
				newX <= room.player1.paddle1.x + room.player1.paddle1.width
			)
				// player2 collision
				this.ball.dy = Math.abs(this.ball.dy);
			// score
			if (newY - this.ball.r <= 0) {
				this.ball.x = width / 2;
				this.ball.y = height / 2;
				this.ball.dx = this.ball.dx;
				this.ball.dy = this.ball.dy;
				room.player1.score++;
			}
			if (newY + this.ball.r >= height) {
				this.ball.x = width / 2;
				this.ball.y = height / 2;
				this.ball.dx = this.ball.dx;
				this.ball.dy = this.ball.dy;
				room.player2.score++;
			}
			this.ball.x += this.ball.dx;
			this.ball.y += this.ball.dy;

			const client1Ball = { ...this.ball }; // Create a copy of the ball object
			const client2Ball = { ...this.ball }; // Create a copy of the ball object
			// Send ball position to client 1
			const player1 = room.player1.score;
			const player2 = room.player2.score;
			const score = { player1, player2 };
			this.server
				.to(room.socket[0].id)
				.emit("responseBall", client1Ball, score);
			// // Reverse ball position for client 2
				client2Ball.x = width - client2Ball.x;
				client2Ball.y = height - client2Ball.y;
				this.server
					.to(room.socket[1].id)
					.emit("responseBall", client2Ball, score);
			status = this.RoundScore(roomId);
			if (room.socket[0].id === undefined ||
					room.socket[1].id === undefined ||
					status
			) {
				room.status = "Finished";
				let winner =
					room.player1.score > room.player2.score ? "Player 1" : "Player 2";
				this.server.to(room.socket[0].id).emit("responseWinner", winner);
				this.server.to(room.socket[1].id).emit("responseWinner", winner);
				clearInterval(intervalId);
				this.handleDisconnect(client);
			}
		}, 1000 / 60);
	}

	@SubscribeMessage("requesteBot")
	async handlePlayer(client: Socket, data: any) {
		const userId = client.handshake.query.userId.toString();
		const roomId = await this.getRoom(userId);
		if (!roomId || this.roomMap.get(roomId).player1.id === "") return;
		const room = this.roomMap.get(roomId);
		if (
			data.x >= 0 &&
			data.x <= data.width &&
			data.y <= data.height &&
			data.y >= data.height / 2
		) {
			if (client.id === room.socket[0].id) {
				if (room.player1.paddle2.x >= data.x) {
					room.player1.paddle2.x -= 12;
					this.server
						.to(room.socket[0].id)
						.emit("responseMouse", room.player1.paddle2);
				} else if (
					room.player1.paddle2.x <= data.x - 50 &&
					room.player1.paddle2.x <= data.width - room.player1.paddle2.width
				) {
					room.player1.paddle2.x += 12;
					this.server
						.to(room.socket[0].id)
						.emit("responseMouse", room.player1.paddle2);
				}
			}
			// // let OldX = data[1].x;
			// if (data[1].x >= room.player1.paddle1.x) {
			// 	room.player1.paddle1.x += 12;
			// }
			// if (data[1].x <= room.player1.paddle1.x) {
			// 	room.player1.paddle1.x -= 12;
			// }
			// console.log("Ball:", room.player1.paddle1.x, "Bot:", data[1].x);
			// this.server.emit("responsePlayer2", room.player1.paddle1);
		}
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
					} else if (value.player2.id === "" && payload.mode === "Random") {
						value.player2 = {
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
						};
						value.status = "OnGoing";
						value.members++;
						value.socket.push(client);
						value.type = payload.type;
						value.mode = payload.mode;
					}
					client.join(key);
					this.server.emit("joinedRoom", key, this.IPlayer);
					this.CreateRoom(key, value);
					this.handleBall(client, key, payload.width, payload.height);
					AvailableRoom = false;
				}
			});
		}
		return AvailableRoom;
	}

	RandomRoom(client: any, key: any, payload: any) {
		this.roomObj = {
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
			status: "waiting",
			type: payload.type,
			mode: payload.mode,
			time: 0,
		};
		this.roomMap.set(key, this.roomObj);
		client.join(key);
		this.server.emit("joinedRoom", key);
	}

	PlayvsBot(client: any, roomId: any, width: any, height: any) {
		const room = this.roomMap.get(roomId);
		room.time = new Date().getTime();
		this.server.emit("StartTime", room.time);
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
		let status = false;
		const intervalId = setInterval(() => {
			if (room.socket.length !== 1) {
				clearInterval(intervalId);
				return;
			}
			let OldY = height / 2;
			if (this.ball.y <= OldY) {
				if (this.ball.x >= room.player1.paddle1.x) {
					room.player1.paddle1.x += 12;
				}
				if (this.ball.x <= room.player1.paddle1.x) {
					room.player1.paddle1.x -= 12;
				}
				OldY = this.ball.y;
				// console.log("Ball:", room.player1.paddle1.x, "Bot:", this.ball.x);
				this.server.emit("responsePlayer2", room.player1.paddle1);
			}
			const newX = this.ball.x + this.ball.dx;
			const newY = this.ball.y + this.ball.dy;
			// wall collision
			if (newX - this.ball.r <= 0 || newX + this.ball.r >= width)
				this.ball.dx = -this.ball.dx;
			if (newY - this.ball.r <= 0 || newY + this.ball.r >= height)
				this.ball.dy = -this.ball.dy;

			// paddle collision
			if (
				newY + this.ball.r >= room.player1.paddle2.y &&
				newX >= room.player1.paddle2.x &&
				newX <= room.player1.paddle2.x + room.player1.paddle2.width
			)
				// player1 collision
				this.ball.dy = -Math.abs(this.ball.dy);
			if (
				newY - this.ball.r <= room.player1.paddle1.y &&
				newX >= room.player1.paddle1.x &&
				newX <= room.player1.paddle1.x + room.player1.paddle1.width
			)
				// player2 collision
				this.ball.dy = Math.abs(this.ball.dy);
			// score
			if (newY - this.ball.r <= 0) {
				this.ball.x = width / 2;
				this.ball.y = height / 2;
				this.ball.dx = this.ball.dx;
				this.ball.dy = this.ball.dy;
				room.player1.score++;
			}
			if (newY + this.ball.r >= height) {
				this.ball.x = width / 2;
				this.ball.y = height / 2;
				this.ball.dx = this.ball.dx;
				this.ball.dy = this.ball.dy;
				room.player2.score++;
			}
			this.ball.x += this.ball.dx;
			this.ball.y += this.ball.dy;

			const client1Ball = { ...this.ball }; // Create a copy of the ball object
			const client2Ball = { ...this.ball }; // Create a copy of the ball object
			// Send ball position to client 1
			const player1 = room.player1.score;
			const player2 = room.player2.score;
			const score = { player1, player2 };
			this.server.emit("responseBall", client1Ball, score);
			status = this.RoundScore(roomId);
			if (room.socket[0].id === undefined || status) {
				room.status = "Finished";
				let winner =
					room.player1.score > room.player2.score ? "Player 1" : "Player 2";
				this.server.emit("responseWinner", winner);
				clearInterval(intervalId);
				this.handleDisconnect(client);
				return ;
			}
		}, 1000 / 60);
	}

	BotRoom(client: any, key: any, payload: any) {
		this.roomObj = {
			members: 2,
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
			status: "OnGoing",
			type: payload.type,
			mode: payload.mode,
			time: 0,
		};
		this.roomMap.set(key, this.roomObj);
		client.join(key);
		this.server.emit("joinedRoom", key);
		this.CreateRoom(key, this.roomObj);
		this.PlayvsBot(client, key, payload.width, payload.height);
	}

	FriendRoom(client: any, key: any, payload: any) {}

	@SubscribeMessage("joinRoom")
	async handleJoinRoom(client: Socket, payload: any) {
		if (payload.type && payload.mode) {
			const key = createHash("sha256")
				.update(Date.now().toString())
				.digest("hex");
			if (payload.mode === "Random") {
				let avialableRoom: boolean = this.AvailableRoom(
					client,
					this.roomMap,
					payload
				);
				console.log("avialableRoom:", avialableRoom);
				if (avialableRoom) this.RandomRoom(client, key, payload);
			} else if (payload.mode === "Bot") {
				this.BotRoom(client, key, payload);
			} else if (payload.mode === "Friend") {
				this.FriendRoom(client, key, payload);
			}
		}
		this.roomMap.forEach((value, key) => {
			if (value.status === "Finished") {
				this.roomMap.delete(key);
			}
		});
		console.log("roomMap => :", this.roomMap);
	}

	async CreateRoom(key: string, value: any) {
		try {
			if (value.player2.id !== "Bot") {
				const Benome = await this.UserService.getUser(value.player2.id);
				if (!Benome) throw new BadRequestException("User not found");
				await this.prisma.user.update({
					where: { id: Benome.id },
					data: { status: "InGame" },
				});
			}
			const player = await this.UserService.getUser(value.player1.id);
			if (!player) throw new BadRequestException("User not found");
			console.log("player:", value.player1.id);
			await this.prisma.user.update({
				where: { id: player.id },
				data: { status: "InGame" },
			});
			const newRoom = await this.prisma.game.create({
				data: {
					id: key,
					dateCreated: new Date(),
					player1_id: player.id,
					player2_id: value.player2.id,
					player1_pts: 0,
					player2_pts: 0,
					gameStatus: "OnGoing",
				},
			});
			console.log(newRoom);
			return key;
		} catch (e) {
			throw new BadRequestException(e.message);
		}
	}

	@SubscribeMessage("Move")
	async handleMove(client, data: any) {
		// console.log(client.id, data);
	}
}
