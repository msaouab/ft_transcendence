import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	NotAcceptableException,
	NotFoundException,
	Redirect,
	UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { Response, Request } from "express";
import { Passport, Profile } from "passport";
import { User } from "../auth/user.decorator/user.decorator";
import { StatusInviteDto, inviteGameDto } from "./dto/invite.game.dto";
import { UserService } from "src/user/user.service";
import { log } from "console";
import { GameGateway } from './Gateway/game.Gateway';
import { Cookie } from "express-session";


interface Player {
	id: string;
	client: any;
}

@Injectable()
export class GameService {
	constructor(
		private prisma: PrismaService,
		private UserService: UserService,
		private gameGateway: GameGateway
	) { }

	// async GetMode(userId, mode: string) {
	// 	try {
	// 		// console.log("test", user);
	// 		if (mode == "random") {
	// 			const updatedUser = await this.prisma.user.update({
	// 				where: { id: userId },
	// 				data: { status: 'InGame', randomMatchmode: 'Random' },
	// 			});
	// 			console.log(updatedUser.id, updatedUser.randomMatchmode);
	// 		}
	// 		else if (mode == "friend") {}
	// 		else { throw new BadRequestException("Mode not found") }
	// 		return 'User added to queue';
	// 	}
	// 	catch (e) {
	// 		throw new BadRequestException(e.message);
	// 	}
	// }

	// async GetType(userId, type: string) {
	// 	try {
	// 		if (type === "time") {
	// 			const updatedUser = await this.prisma.user.update({
	// 				where: { id: userId },
	// 				data: { status: 'InGame', randomMatchmode: 'RandomForTime' },
	// 			});
	// 			this.gameGateway.CreateRoom(userId, "RandomForTime", updatedUser.randomMatchmode);
	// 		}
	// 		else if (type === "round") {
	// 			const updatedUser = await this.prisma.user.update({
	// 				where: { id: userId },
	// 				data: { status: 'InGame', randomMatchmode: 'RandomForRound' },
	// 			});
	// 			this.gameGateway.CreateRoom(userId, "RandomForRound", updatedUser.randomMatchmode);
	// 		}
	// 		else { throw new BadRequestException("Type not found") }
	// 		return 'User added the ' + type;
	// 	}
	// 	catch (e) {
	// 		throw new BadRequestException(e.message);
	// 	}
	// }

	// async CreateRoom(userId, type: string, mode: string) {
	// 	try {
	// 		const Benome = await this.UserService.getUserByType(type);
	// 		if (!Benome) { throw new BadRequestException("User not found") }
	// 		const player = await this.UserService.getUser(userId);
	// 		await this.prisma.user.update({
	// 			where: { id: player.id },
	// 			data: { status: 'InGame' },
	// 		});
	// 		await this.prisma.user.update({
	// 			where: { id: Benome.id },
	// 			data: { status: 'InGame' },
	// 		});
	// 		// console.log("player", player, "Benome", Benome);
	// 		const newRoom = await this.prisma.game.create({
	// 			data: {
	// 				// id: player.id + Benome.id,
	// 				dateCreated: new Date(),
	// 				player1_id: player.id,
	// 				player2_id: Benome.id,
	// 				player1_pts: 0,
	// 				player2_pts: 0,
	// 				gameStatus: "OnGoing",
	// 			}
	// 		});
	// 		// console.log("Benome", Benome, "player", player);
	// 		this.gameGateway.handleAddRoom(newRoom, Benome, player)
	// 		// this.gameGateway.handleNewRoom(newRoom);
	// 		return newRoom;
	// 	}
	// 	catch (e) { throw new BadRequestException(e.message) }
	// }


	async CreateGamingRoom(id: string, userId: string) {
		try {
			const FindUser = await this.UserService.getUser(id);
			const FindFriend = await this.UserService.getUser(userId);
			const FindGame = await this.prisma.game.findFirst({
				where: {
					OR: [
						{
							player1_id: FindUser.id,
							player2_id: FindFriend.id,
						},
						{
							player1_id: FindFriend.id,
							player2_id: FindUser.id,
						},
					],
				},
			});
			if (FindGame) {
				throw new BadRequestException("Game already exist");
			}
			const newGame = await this.prisma.game.create({
				data: {
					player1_id: FindUser.id,
					player2_id: FindFriend.id,
					gameStatus: "OnGoing",
					dateCreated: new Date(),
					player1_pts: 0,
					player2_pts: 0,
				},
			});
			const UpdateUser = await this.prisma.user.update({
				where: {
					id: FindUser.id,
				},
				data: {
					status: "InGame",
				},
			});
			const UpdateFriend = await this.prisma.user.update({
				where: {
					id: FindFriend.id,
				},
				data: {
					status: "InGame",
				},
			});
			return newGame;
		} catch (err) {
			throw new BadRequestException(err.message);
		}
	}
	
	async createInvite(user, inviteGameDto : inviteGameDto)
	{
		const {invited, mode, send} = inviteGameDto;
		const sender = await this.prisma.user.findUnique({
			where: {
				id: send
			}
		})
		if (!sender)
			throw new BadRequestException("User not found", send);
		if (sender.email != user._json.email)
			throw new UnauthorizedException("You are not authorized to do this action");
		if (send == invited)
			throw new ConflictException("You cant invite yourself");
		const receiver = await this.prisma.user.findUnique({
			where: {
				id: invited
			}
		})
		if (!receiver)
			throw new BadRequestException("User not found", invited);
			const checkban = await this.prisma.blockTab.findFirst({
				where: {
					AND: [
						{
							user_id: sender.id
						},
						{
							blockedUser_id: receiver.id
						}
					]
				}
			})
		if (receiver.status !== "Online" || sender.status !== "Online" || checkban)
			throw new BadRequestException("User cant be invited");
		const checkExist = await this.prisma.gameInvites.findFirst({
			where: {
				AND: [
					{
						sender_id: sender.id
					},
					{
						receiver_id: receiver.id
					},
					{
						status: "Pending"
					}
				]
			}
		})
		if (checkExist)
			throw new BadRequestException("Invite already sent");
		const newInvite = await this.prisma.gameInvites.create({
			data: {
				sender_id: sender.id,
				receiver_id: receiver.id,
				status: "Pending",
				validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
				// mode: mode
			}
		})

		
	}

	async updateInvite(user, statusInviteDto:StatusInviteDto, id: string) 
	{
		const {status, recvId} = statusInviteDto;
		const sender = await this.prisma.user.findUnique({
			where: {
				id: user.id
			}
		})
		if (!sender)
			throw new BadRequestException("User not found", user.id);
		const receiver = await this.prisma.user.findUnique({
			where: {
				id: recvId
			}
		})
		if (!receiver)
			throw new BadRequestException("User not found", recvId);
		const checkExist = await this.prisma.gameInvites.findUnique({
			where: {
				sender_id_receiver_id: {
					sender_id: sender.id,
					receiver_id: receiver.id
				}
			}
		})
		if (receiver.email != user._json.email)
			throw new UnauthorizedException("You are not authorized to do this action");
		if (!checkExist)
			throw new BadRequestException("Invite not found");
		await this.prisma.gameInvites.update({
			where: {
				sender_id_receiver_id: {
					sender_id: sender.id,
					receiver_id: receiver.id
				}
			},
			data: {
				status: status
			}
		})
			



	}
}
// static arr: Player[] = [];

// async leaveTheRoom(client) {
//   const index = GameService.arr.findIndex(
//     (player) => player.client === client
//   );
//   GameService.arr.splice(index, 1);
//   console.log("leaving the room");
// }

// async handleJoinMatchMaking(client, id: string) {
//   // id, client,
//   // adding the id to the arr of of the matchmaking,
//   // each time we get a new id, we check if the arr is > 1
//   // we add two random sockets to a room
//   const getRoomid = (player1Id, player2Id) => {
//     const room = [player1Id, player2Id].sort().join("-");
//     return room;
//   };
//   // const { id } = data;

//   GameService.arr.push({ id, client });
//   if (GameService.arr.length > 1) {
//     const player1 =
//       GameService.arr[Math.floor(Math.random() * GameService.arr.length)];
//     let player2 =
//       GameService.arr[Math.floor(Math.random() * GameService.arr.length)];
//     while (player1 === player2) {
//       player2 =
//         GameService.arr[Math.floor(Math.random() * GameService.arr.length)];
//     }

//     console.log("Im creating a room");
//     const room = getRoomid(player1.id, player2.id);
//     player1.client.join(room);
//     this.leaveTheRoom(player1.client);
//     player2.client.join(room);
//     this.leaveTheRoom(player2.client);
//     player1.client.emit("matchFound", { room });
//     player2.client.emit("matchFound", { room });
//     return room;
//   }
// }
