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
import { clients as  onlineClientsMap } from 'src/notify/notify.gateway'
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
		private UserService: UserService,
		private readonly achvService: AchvService
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

	afterInit(server: any) {
		console.log(`WebSocket server initialized ${server}`);
	}
	handleConnection(client: Socket) {
		console.log(`Client connected: ${client.id}`);
	}
	async handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
		this.roomMap.forEach(async (value, key) => {
			if ( value.mode !== "Bot" &&
				(value.player1.id === client.handshake.query.userId.toString() ||
				value.player2.id === client.handshake.query.userId.toString())
			) {
				const userId = client.handshake.query.userId.toString();
				const opponentId =
					value.player1.id === userId ? value.player2.id : value.player1.id;

				const [player, opponent] = await Promise.all([
					this.UserService.getUser(userId),
					this.UserService.getUser(opponentId),
				]);
				if (player && opponent) {
					await this.prisma.user.updateMany({
						where: { id: { in: [player.id, opponent.id] } },
						data: { status: "Online" },
					});
				}
				const existingGame = await this.prisma.game.findUnique({
					where: { id: key },
				});
				if (existingGame) {
					const updateGame = await this.prisma.game.update({
						where: { id: key },
						data: {
							gameStatus: "Finished",
							player1_pts: value.player1.score,
							player2_pts: value.player2.score,
						},
					});
					console.log(updateGame);
					console.log(updateGame.player1_id, updateGame.player2_id)
					this.achvService.CheckAchv(value.player1.id, value.player2.id, value.player1.score, value.player2.score);
				}
				value.status = "Finished";
				client.leave(key);
				this.roomMap.delete(key);
			}
			if (value.status === "Finished") {
				client.leave(key);
				this.roomMap.delete(key);
			}
		});
	}

	RoundScore(roomId: string): boolean {
		const room = this.roomMap.get(roomId);
		if (!room) return;
		const { type, player1, player2 } = room;

		if (type === "Round") {
			if (player1.score === 5 || player2.score === 5) {
				return true;
			}
		} else if (type === "Time") {
			const lastTime = new Date().getTime();
			return (lastTime - room.time) / 1000 >= 60;
		}
		return false;
	}

	async handleBall(
		client: Socket,
		roomId: string,
		width: number,
		height: number
	) {
		const room = this.roomMap.get(roomId);
		room.time = new Date().getTime();
		// const { socket, ball, player1, player2 } = room;
		this.server.to(room.socket[0].id).emit("StartTime", room.time);
		this.server.to(room.socket[1].id).emit("StartTime", room.time);
		const intervalId = setInterval(() => {
			if (room.socket.length !== 2) {
				clearInterval(intervalId);
				return;
			}
			const newX = room.ball.x + room.ball.dx;
			const newY = room.ball.y + room.ball.dy;
			// wall collision
			if (newX - room.ball.r <= 0 || newX + room.ball.r >= width) {
				room.ball.dx = -room.ball.dx;
			}
			if (newY - room.ball.r <= 0 || newY + room.ball.r >= height) {
				room.ball.dy = -room.ball.dy;
			}
			// paddle collision
			if (
				newY + room.ball.r >= room.player1.paddle2.y &&
				newX >= room.player1.paddle2.x &&
				newX <= room.player1.paddle2.x + room.player1.paddle2.width
			) {
				room.ball.dy = -Math.abs(room.ball.dy);
			}
			if (
				newY - room.ball.r <= room.player1.paddle1.y &&
				newX >= room.player1.paddle1.x &&
				newX <= room.player1.paddle1.x + room.player1.paddle1.width
			) {
				room.ball.dy = Math.abs(room.ball.dy);
			}
			// score
			if (newY - room.ball.r <= 0) {
				room.ball.x = width / 2;
				room.ball.y = height / 2;
				room.player1.score++;
			}
			if (newY + room.ball.r >= height) {
				room.ball.x = width / 2;
				room.ball.y = height / 2;
				room.player2.score++;
			}
			room.ball.x += room.ball.dx;
			room.ball.y += room.ball.dy;
			const client1Ball = { ...room.ball }; // Create a copy of the ball object
			const client2Ball = { ...room.ball }; // Create a copy of the ball object
			// Send ball position to client 1
			const player1 = room.player1.score;
			const player2 = room.player2.score;
			const score = { player1, player2 };
			const revScore = {
				player1: room.player2.score,
				player2: room.player1.score,
			};
			this.server.to(room.socket[0].id).emit("responseBall", client1Ball);
			// Reverse ball position for client 2
			client2Ball.x = width - client2Ball.x;
			client2Ball.y = height - client2Ball.y;
			this.server.to(room.socket[1].id).emit("responseBall", client2Ball);
			this.server.to(room.socket[0].id).emit("responseScore", score);
			this.server.to(room.socket[1].id).emit("responseScore", revScore);
			if (
				!room.socket[0].id ||
				!room.socket[1].id ||
				this.RoundScore(roomId) !== false
			) {
				room.status = "Finished";
				const winner =
					room.player1.score > room.player2.score ? "Player 1" : "Player 2";
				this.server.to(room.socket[0].id).emit("responseWinner", winner);
				this.server.to(room.socket[1].id).emit("responseWinner", winner);
				clearInterval(intervalId);
				// this.handleDisconnect(client);
			}
		}, 1000 / 60);
	}

	async getRoom(userId: string): Promise<string | undefined> {
		let roomId: string | undefined;
		this.roomMap.forEach((value, key) => {
			if (value.player1.id === userId || value.player2.id === userId)
				roomId = key;
		});
		return roomId;
	}

	PlayvsBot(client: any, roomId: any, width: any, height: any) {
		const room = this.roomMap.get(roomId);
		room.time = new Date().getTime();
		this.server.to(client.id).emit("StartTime", room.time);
		let status = false;
		const intervalId = setInterval(() => {
			if (room.socket.length !== 1) {
				clearInterval(intervalId);
				return;
			}
			let OldY = height / 2;
			if (room.ball.y <= OldY) {
				if (
					room.ball.x >= room.player1.paddle1.x &&
					room.player1.paddle1.x <= width - 80
				) {
					room.player1.paddle1.x += 12;
				}
				if (room.ball.x <= room.player1.paddle1.x) {
					room.player1.paddle1.x -= 12;
				}
				OldY = room.ball.y;
				this.server
					.to(room.socket[0].id)
					.emit("responsePlayer2", room.player1.paddle1);
			}
			const newX = room.ball.x + room.ball.dx;
			const newY = room.ball.y + room.ball.dy;
			// wall collision
			if (newX - room.ball.r <= 0 || newX + room.ball.r >= width)
				room.ball.dx = -room.ball.dx;
			// if (newY - room.ball.r <= 0 || newY + room.ball.r >= height)
			// room.ball.dy = -room.ball.dy;
			// paddle collision
			if (
				newY + room.ball.r >= room.player1.paddle2.y &&
				newX >= room.player1.paddle2.x &&
				newX <= room.player1.paddle2.x + room.player1.paddle2.width
			)
				// player1 collision
				room.ball.dy = -Math.abs(room.ball.dy);
			if (
				newY - room.ball.r <= room.player1.paddle1.y &&
				newX >= room.player1.paddle1.x &&
				newX <= room.player1.paddle1.x + room.player1.paddle1.width
			)
				// player2 collision
				room.ball.dy = Math.abs(room.ball.dy);
			// score
			if (newY - room.ball.r <= 0) {
				room.ball.x = width / 2;
				room.ball.y = height / 2;
				room.ball.dx = room.ball.dx;
				room.ball.dy = room.ball.dy;
				room.player1.score++;
			}
			if (newY + room.ball.r >= height) {
				room.ball.x = width / 2;
				room.ball.y = height / 2;
				room.ball.dx = -room.ball.dx;
				room.ball.dy = -room.ball.dy;
				room.player2.score++;
			}
			room.ball.x += room.ball.dx;
			room.ball.y += room.ball.dy;

			const client1Ball = { ...room.ball }; // Create a copy of the ball object
			// Send ball position to client 1
			const player1 = room.player1.score;
			const player2 = room.player2.score;
			const score = { player1, player2 };
			this.server.to(room.socket[0].id).emit("responseBall", client1Ball);
			// this.server.emit("responseScore", score);
			this.server.to(room.socket[0].id).emit("responseScore", score);
			status = this.RoundScore(roomId);
			if (client.id === undefined || status !== false) {
				room.status = "Finished";
				let winner =
					room.player1.score > room.player2.score ? "Player 1" : "Molinette_42";
				// this.server.emit("responseWinner", winner);
				clearInterval(intervalId);
				// this.handleDisconnect(client);
				return;
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
		}
	}

	@SubscribeMessage("requesteMouse")
	async handleKey(client: Socket, data: any) {
		const userId = client.handshake.query.userId.toString();
		const roomId = await this.getRoom(userId);
		if (
			!roomId ||
			this.roomMap.get(roomId).player1.id === "" ||
			this.roomMap.get(roomId).player2.id === ""
		) {
			return;
		}
		const room = this.roomMap.get(roomId);
		const { x, width, y, height } = data;
		const { player1, player2, socket } = room;

		if (x >= 0 && x <= width && y <= height && y >= height / 2) {
			if (client.id === socket[0].id) {
				if (player1.paddle2.x >= x) {
					player1.paddle2.x -= 12;
					player2.paddle1.x += 12;
					this.server.to(socket[0].id).emit("responseMouse", player1.paddle2);
					this.server.to(socket[1].id).emit("responsePlayer2", player2.paddle1);
				} else if (
					player1.paddle2.x <= x - 50 &&
					player1.paddle2.x <= width - player1.paddle2.width
				) {
					player1.paddle2.x += 12;
					player2.paddle1.x -= 12;
					this.server.to(socket[0].id).emit("responseMouse", player1.paddle2);
					this.server.to(socket[1].id).emit("responsePlayer2", player2.paddle1);
				}
			} else if (client.id === socket[1].id) {
				if (player2.paddle2.x >= x) {
					player2.paddle2.x -= 12;
					player1.paddle1.x += 12;
					this.server.to(socket[1].id).emit("responseMouse", player2.paddle2);
					this.server.to(socket[0].id).emit("responsePlayer2", player1.paddle1);
				} else if (
					player2.paddle2.x <= x - 50 &&
					player2.paddle2.x <= width - player2.paddle2.width
				) {
					player2.paddle2.x += 12;
					player1.paddle1.x -= 12;
					this.server.to(socket[1].id).emit("responseMouse", player2.paddle2);
					this.server.to(socket[0].id).emit("responsePlayer2", player1.paddle1);
				}
			}
		}
	}

	AvailableRoom(client: Socket, payload, roomMap: any): boolean {
		let availableRoom = false;
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
					value.ball = {
						x: payload.width / 2,
						y: payload.height / 2,
						r: 10,
						dx: 4,
						dy: 4,
						speed: 1,
						c: "#fff",
					};
					value.status = "OnGoing";
					value.socket.push(client);
					value.time = new Date().getTime();
					client.join(key);
					this.server.to(value.socket[0].id).emit("BenomeId", value.player2.id);
					this.server.to(value.socket[1].id).emit("BenomeId", value.player1.id);
					this.createPrismaGame(key, value);
					this.handleBall(client, key, payload.width, payload.height);
					availableRoom = true;
				}
			});
		}
		return availableRoom;
	}

	CreateRandomRoom(client: Socket, payload) {
		const availableRoom = this.AvailableRoom(client, payload, this.roomMap);
		if (!availableRoom) {
			const key = createHash("sha256")
				.update(Date.now().toString())
				.digest("hex");
			console.log(key);
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
		this.roomMap.set(key, {
			members: 1,
			socket: [client],
			player1: {
				id: client.handshake.query.userId,
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
			status: "OnGoing",
			type: payload.type,
			mode: payload.mode,
			time: new Date().getTime(),
		});
		client.join(key);
		this.server
			.to(client.id)
			.emit("BenomeId", this.roomMap.get(key).player2.id, key);
		if (this.roomMap.get(key).player1.id) {
			this.PlayvsBot(client, key, payload.width, payload.height);
		}
	}

	async CreateFriendRoom(client: Socket, payload) {
		console.log("CreateFriendRoom", payload);
		const FindBenome = await this.UserService.getUser(payload.friend);
		console.log("FindBenome", FindBenome);
		if (!FindBenome) throw new BadRequestException("User not found");
		if (FindBenome.status === "InGame")
			throw new ForbiddenException("User is already in game");
		const key = createHash("sha256")
			.update(Date.now().toString())
			.digest("hex");
		if (!key) throw new BadRequestException("Please provide a valid room key");
		const friendMap = this.roomMap.set(key, {
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
				id: payload.friend,
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
		if (onlineClientsMap.has(payload.friend)) {
			const friendSocket = onlineClientsMap.get(payload.friend);
			friendSocket.emit("GameNotif", 1);
		}
		// console.log(onlineClientsMap);

	}

	@SubscribeMessage("joinRoom")
	async handelJoinRoom(client: Socket, payload: any) {
		if (payload.type && payload.mode) {
			if (payload.mode === "Random") {
				this.CreateRandomRoom(client, payload);
			} else if (payload.mode === "Bot") {
				this.CreateBotRoom(client, payload);
			} else if (payload.mode === "Friend") {
				this.CreateFriendRoom(client, payload);
			}
		}
		// this.roomMap.forEach(async (value, key) => {
		// 	if (value.status === "Finished") {
		// 		const updateGame = await this.prisma.game.update({
		// 			where: {
		// 				id: key,
		// 			},
		// 			data: {
		// 				gameStatus: "Finished",
		// 				player1_pts: value.player1.score,
		// 				player2_pts: value.player2.score,
		// 			}
		// 		})
		// 		this.achvService.CheckAchv(updateGame.player1_id, updateGame.player2_id, updateGame.player1_pts, updateGame.player2_pts);
		// 		this.roomMap.delete(key);
		// 	}
		// });
	}

	async createPrismaGame(key, room) {
		try {
			console.log("createPrismaGame", room.player1.id, room.player2.id)
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
					id: key,
					dateCreated: new Date(),
					player1_id: room.player1.id,
					player2_id: room.player2.id,
					player1_pts: 0,
					player2_pts: 0,
					gameStatus: "OnGoing",
				},
			});
			console.log("Game created", newRoom);
		} catch (e) {
			console.log(e);
		}
	}
}
