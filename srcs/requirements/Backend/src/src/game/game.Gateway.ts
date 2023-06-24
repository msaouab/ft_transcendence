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
import { GameService } from "./game.service";
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
import { clients as onlineClientsMap } from "src/notify/notify.gateway";
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
		// private gameService: GameService,
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
		height: number;
		width: number;
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
			const userId =
				client.id === value.socket[0].id ? value.player1.id : value.player2.id;
			if (
				value.mode !== "Bot" &&
				// (value.player1.id === client.handshake.query.userId ||
				// value.player2.id === client.handshake.query.userId)
				(client.id === value.socket[0].id || client.id === value.socket[1].id)
			) {
				const opponentId =
					value.player1.id === userId ? value.player2.id : value.player1.id;

				if (userId) {
					const player = await this.UserService.getUser(userId);
					if (player) {
						await this.prisma.user.update({
							where: { id: player.id },
							data: { status: "Online" },
						});
					}
				}
				if (opponentId) {
					const opponent = await this.UserService.getUser(opponentId);
					if (opponent) {
						await this.prisma.user.update({
							where: { id: opponent.id },
							data: { status: "Online" },
						});
					}
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
					this.achvService.CheckAchv(
						value.player1.id,
						value.player2.id,
						value.player1.score,
						value.player2.score
					);
				}
				if (value.mode === "Friend") {
					const inviteGame = await this.prisma.gameInvites.findUnique({
						where: {
							sender_id_receiver_id: {
								sender_id: value.player1.id || value.player2.id,
								receiver_id: value.player2.id || value.player1.id,
							},
						},
					});
					if (inviteGame) {
						await this.prisma.gameInvites.delete({
							where: {
								sender_id_receiver_id: {
									sender_id: value.player1.id || value.player2.id,
									receiver_id: value.player2.id || value.player1.id,
								},
							},
						});
					}
				}
				value.status = "Finished";
				client.leave(key);
				this.roomMap.delete(key);
			} else if (value.mode === "Bot") {
				value.status = "Finished";
				client.leave(key);
				this.roomMap.delete(key);
				// const playerId = playerId;
				// const player = await this.UserService.getUser(client.handshake.query.userId?.toString());
				// if (player) {
				// 	await this.prisma.user.update({
				// 		where: { id: player.id },
				// 		data: { status: "Online" },
				// 	});
				// }
				// const existingGame = await this.prisma.game.findUnique({
				// 	where: { id: key },
				// });
				// if (existingGame) {
				// 	const updateGame = await this.prisma.game.update({
				// 		where: { id: key },
				// 		data: {
				// 			gameStatus: "Finished",
				// 			player1_pts: value.player1.score,
				// 			player2_pts: value.player2.score,
				// 		},
				// 	});
				// }
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
			return (lastTime - room.time) / 1000 >= 600;
		}
		return false;
	}

	async handleBall(client: Socket, roomId: string) {
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
			if (newX - room.ball.r <= 0 || newX + room.ball.r >= room.width) {
				room.ball.dx = -room.ball.dx;
			}
			if (newY - room.ball.r <= 0 || newY + room.ball.r >= room.height) {
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
				room.ball.x = room.width / 2;
				room.ball.y = room.height / 2;
				room.player1.score++;
			}
			if (newY + room.ball.r >= room.height) {
				room.ball.x = room.width / 2;
				room.ball.y = room.height / 2;
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
			client2Ball.x = room.width - client2Ball.x;
			client2Ball.y = room.height - client2Ball.y;
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

	async getRoom(playerId: string): Promise<string | undefined> {
		let roomId: string | undefined;
		this.roomMap.forEach((value, key) => {
			if (value.player1.id === playerId || value.player2.id === playerId)
				roomId = key;
		});
		return roomId;
	}

	PlayvsBot(client: any, roomId: any) {
		const room = this.roomMap.get(roomId);
		room.time = new Date().getTime();
		this.server.to(client.id).emit("StartTime", room.time);
		let status = false;
		const intervalId = setInterval(() => {
			if (room.socket.length !== 1) {
				clearInterval(intervalId);
				return;
			}
			let OldY = room.height / 2;
			if (room.ball.y <= OldY) {
				if (
					room.ball.x >= room.player1.paddle1.x &&
					room.player1.paddle1.x <= room.width - 80
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
			if (newX - room.ball.r <= 0 || newX + room.ball.r >= room.width)
				room.ball.dx = -room.ball.dx;
			// if (newY - room.ball.r <= 0 || newY + room.ball.r >= room.height)
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
				room.ball.x = room.width / 2;
				room.ball.y = room.height / 2;
				room.ball.dx = room.ball.dx;
				room.ball.dy = room.ball.dy;
				room.player1.score++;
			}
			if (newY + room.ball.r >= room.height) {
				room.ball.x = room.width / 2;
				room.ball.y = room.height / 2;
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
		// if (client.handshake.query.userId === undefined) return;
		// const playerId = client.handshake.query.userId?.toString();
		const roomId = await this.getRoom(data.userId);
		if (!roomId || this.roomMap.get(roomId).player1.id === "") return;
		const room = this.roomMap.get(roomId || data.userId);
		if (
			data.x >= 0 &&
			data.x <= room.width &&
			data.y <= room.height &&
			data.y >= room.height / 2
		) {
			if (client.id === room.socket[0].id) {
				if (room.player1.paddle2.x >= data.x) {
					room.player1.paddle2.x -= 12;
					this.server
						.to(room.socket[0].id)
						.emit("responseMouse", room.player1.paddle2);
				} else if (
					room.player1.paddle2.x <= data.x - 50 &&
					room.player1.paddle2.x <= room.width - room.player1.paddle2.width
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
		const roomId = await this.getRoom(
			data.userId || client.handshake.query.userId
		);
		if (
			!roomId ||
			this.roomMap.get(roomId).player1.id === "" ||
			this.roomMap.get(roomId).player2.id === "" ||
			this.roomMap.get(roomId).player2.id === "Bot"
		) {
			return;
		}
		const room = this.roomMap.get(roomId);
		const { x, y } = data;
		const { player1, player2, socket } = room;

		if (x >= 0 && x <= room.width && y <= room.height && y >= room.height / 2) {
			if (client.id === socket[0].id) {
				if (player1.paddle2.x >= x) {
					player1.paddle2.x -= 12;
					player2.paddle1.x += 12;
					this.server.to(socket[0].id).emit("responseMouse", player1.paddle2);
					this.server.to(socket[1].id).emit("responsePlayer2", player2.paddle1);
				} else if (
					player1.paddle2.x <= x - 50 &&
					player1.paddle2.x <= room.width - player1.paddle2.width
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
					player2.paddle2.x <= room.width - player2.paddle2.width
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
		// if (client.handshake.query.userId === undefined) return;
		// const playerId = client.handshake.query.userId?.toString();
		let availableRoom = false;
		const width = 700;
		const height = (width * 16) / 9;
		if (roomMap.size > 0) {
			roomMap.forEach((value, key) => {
				if (
					value.members === 1 &&
					value.type === payload.type &&
					value.mode === payload.mode &&
					value.player1.id !== payload.userId
				) {
					value.members++;
					value.player2 = {
						id: payload.userId,
						score: 0,
						paddle1: {
							x: width / 2 - 40,
							y: 10,
							width: 80,
							height: 10,
						},
						paddle2: {
							x: width / 2 - 40,
							y: height - 20,
							width: 80,
							height: 10,
						},
					};
					value.ball = {
						x: width / 2,
						y: height / 2,
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
					this.server
						.to(value.socket[0].id)
						.emit("BenomeId", value.player2.id, key);
					this.server
						.to(value.socket[1].id)
						.emit("BenomeId", value.player1.id, key);
					this.createPrismaGame(key, value);
					this.handleBall(client, key);
					availableRoom = true;
				}
			});
		}
		return availableRoom;
	}

	CreateRandomRoom(client: Socket, payload) {
		// if (client.handshake.query.userId === undefined) return;
		// const playerId = client.handshake.query.userId?.toString();
		const availableRoom = this.AvailableRoom(client, payload, this.roomMap);
		if (!availableRoom) {
			const width = 700;
			const height = (width * 16) / 9;
			const key = createHash("sha256")
				.update(Date.now().toString())
				.digest("hex");
			this.roomMap.set(key, {
				members: 1,
				socket: [client],
				player1: {
					id: payload.userId,
					score: 0,
					paddle1: {
						x: width / 2 - 40,
						y: 10,
						width: 80,
						height: 10,
					},
					paddle2: {
						x: width / 2 - 40,
						y: height - 20,
						width: 80,
						height: 10,
					},
				},
				player2: {
					id: "",
					score: 0,
					paddle1: {
						x: width / 2 - 40,
						y: 10,
						width: 80,
						height: 10,
					},
					paddle2: {
						x: width / 2 - 40,
						y: height - 20,
						width: 80,
						height: 10,
					},
				},
				status: "waiting",
				type: payload.type,
				mode: payload.mode,
				time: 0,
				height: height,
				width: width,
			});
		}
	}

	CreateBotRoom(client: Socket, payload) {
		const userId = payload.userId;
		const width = 700;
		const height = (width * 16) / 9;
		const key = createHash("sha256")
			.update(Date.now().toString())
			.digest("hex");
		if (!key) throw new BadRequestException("Please provide a valid room key");
		this.roomMap.set(key, {
			members: 1,
			socket: [client],
			player1: {
				id: userId,
				score: 0,
				paddle1: {
					x: width / 2 - 40,
					y: 10,
					width: 80,
					height: 10,
				},
				paddle2: {
					x: width / 2 - 40,
					y: height - 40,
					width: 80,
					height: 10,
				},
			},
			player2: {
				id: "Bot",
				score: 0,
				paddle1: {
					x: width / 2 - 40,
					y: 10,
					width: 80,
					height: 10,
				},
				paddle2: {
					x: width / 2 - 40,
					y: height - 20,
					width: 80,
					height: 10,
				},
			},
			ball: {
				x: width / 2,
				y: height / 2,
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
			height: height,
			width: width,
		});
		client.join(key);
		this.server
			.to(client.id)
			.emit("BenomeId", this.roomMap.get(key).player2.id, key);
		if (this.roomMap.get(key).player1.id) {
			this.PlayvsBot(client, key);
		}
	}

	async CreateInviteGame(playerId: string, payload, key: string) {
		try {
			const FindUser = await this.UserService.getUser(playerId);
			if (!FindUser) throw new BadRequestException("User not found", playerId);
			if (FindUser.status !== "Online") {
				throw new BadRequestException("User is not online");
			}
			const FindFriend = await this.UserService.getUser(payload.friend);
			if (!FindFriend) throw new BadRequestException("User not found", payload);
			if (FindFriend.status !== "Online" || FindUser.status !== "Online")
				throw new BadRequestException("User is not online");
			const createInvite = await this.prisma.gameInvites.create({
				data: {
					sender_id: FindUser.id,
					receiver_id: FindFriend.id,
					status: "Pending",
					validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
					roomId: key,
					type: payload.type,
					mode: payload.mode,
				},
			});
		} catch (err) {
			console.log(err);
		}
	}

	async updateInviteGame(key: string) {
		try {
			const updateInvite = await this.prisma.gameInvites.update({
				where: {
					sender_id_receiver_id: {
						sender_id: this.roomMap.get(key).player1.id,
						receiver_id: this.roomMap.get(key).player2.id,
					},
				},
				// where: { roomId: key},
				data: { status: "Accepted" },
			});
		} catch (err) {
			console.log(err);
		}
	}

	async AcceptInviteGame(client, playerId: string, payload) {
		let availableRoom = false;
		const width = 700;
		const height = (width * 16) / 9;
		if (this.roomMap.size > 0) {
			this.roomMap.forEach((value, key) => {
				if (
					value.type === payload.type &&
					value.mode === payload.mode &&
					value.player2.id === playerId
				) {
					value.members++;
					value.player2 = {
						id: playerId,
						score: 0,
						paddle1: {
							x: width / 2 - 40,
							y: 10,
							width: 80,
							height: 10,
						},
						paddle2: {
							x: width / 2 - 40,
							y: height - 20,
							width: 80,
							height: 10,
						},
					};
					value.ball = {
						x: width / 2,
						y: height / 2,
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
					this.server
						.to(value.socket[0].id)
						.emit("BenomeId", value.player2.id, key);
					this.server
						.to(value.socket[1].id)
						.emit("BenomeId", value.player1.id, key);
					this.updateInviteGame(key);
					this.createPrismaGame(key, value);
					this.handleBall(client, key);
					availableRoom = true;
				}
			});
		}
		return availableRoom;
	}

	async CreateFriendRoom(client: Socket, payload) {
		const FindBenome = await this.UserService.getUser(payload.friend);
		if (!FindBenome) throw new BadRequestException("User not found");
		if (FindBenome.status === "InGame")
			throw new ForbiddenException("User is already in game");
		if (FindBenome.status === "Offline")
			throw new ForbiddenException("User is offline");
		const AvailableRoom = this.AcceptInviteGame(
			client,
			payload.userId,
			payload
		);
		if ((await AvailableRoom) === false) {
			const width = 700;
			const height = (width * 16) / 9;
			const key = createHash("sha256")
				.update(Date.now().toString())
				.digest("hex");
			if (!key)
				throw new BadRequestException("Please provide a valid room key");
			const friendMap = this.roomMap.set(key, {
				members: 1,
				socket: [client],
				player1: {
					id: payload.userId,
					score: 0,
					paddle1: {
						x: width / 2 - 40,
						y: 10,
						width: 80,
						height: 10,
					},
					paddle2: {
						x: width / 2 - 40,
						y: height - 20,
						width: 80,
						height: 10,
					},
				},
				player2: {
					id: payload.friend,
					score: 0,
					paddle1: {
						x: width / 2 - 40,
						y: 10,
						width: 80,
						height: 10,
					},
					paddle2: {
						x: width / 2 - 40,
						y: height - 20,
						width: 80,
						height: 10,
					},
				},
				ball: {
					x: width / 2,
					y: height / 2,
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
				width: width,
				height: height,
			});
			if (onlineClientsMap.has(payload.friend)) {
				const friendSocket = onlineClientsMap.get(payload.friend);
				friendSocket.emit("gameNotif", { num: 1 });
				this.CreateInviteGame(payload.userId, payload, key);
			}
		}
	}

	@SubscribeMessage("joinRoom")
	async handelJoinRoom(client: Socket, payload: any) {
		const userId = payload.playerId;
		if (!payload.mode) payload.mode = "Random";
		if (!payload.type) payload.type = "Time";
		if (payload.type && payload.mode) {
			if (payload.mode === "Random") {
				this.CreateRandomRoom(client, payload);
			} else if (payload.mode === "Bot") {
				this.CreateBotRoom(client, payload);
			} else if (payload.mode === "Friend") {
				this.CreateFriendRoom(client, payload);
			}
		}
	}

	async createPrismaGame(key, room) {
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
					id: key,
					dateCreated: new Date(),
					player1_id: room.player1.id,
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
	@SubscribeMessage("requesteResize")
	async handleResize(client: Socket, data: any) {
		const roomId = await this.getRoom(
			data.userId || client.handshake.query.userId
		);
		if (!roomId) return;
		const room = this.roomMap.get(roomId);
		// room.width = data.width;
		// room.height = data.height;
		const calculatedHeight = (data.width / 16) * 9;
		room.player1.paddle1.x = data.width / 2 - 40;
		room.player1.paddle2.y = data.height - 20;
		room.player1.paddle2.x = data.width / 2 - 40;
		room.player2.paddle1.x = data.width / 2 - 40;
		room.player2.paddle2.x = data.width / 2 - 40;
		room.player2.paddle2.y = data.height - 20;
		this.server.to(room.socket[0].id).emit("responsePlayer2", room.player1.paddle1);
		this.server.to(room.socket[0].id).emit("responseMouse", room.player1.paddle2);
		if (room.socket.length === 2) {
			this.server.to(room.socket[1].id).emit("responsePlayer2", room.player2.paddle1);
			this.server.to(room.socket[1].id).emit("responseMouse", room.player2.paddle2);
		}
	}
}
