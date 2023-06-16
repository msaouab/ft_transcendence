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
import { GameGateway } from './game.Gateway';
import { Cookie } from "express-session";
import { stat } from "fs";


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
		// const newInvite = await this.prisma.gameInvites.create({
		// 	data: {
		// 		sender_id: sender.id,
		// 		receiver_id: receiver.id,
		// 		status: "Pending",
		// 		validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
		// 		// mode: mode
		// 	}
		// })

		
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

	async getMyInvites(user)
	{
		const me = await this.prisma.user.findUnique({
			where: {
				email: user._json.email
			}
		})
		
		const invites = await this.prisma.gameInvites.findMany({
			where:
			{
				receiver_id: me.id,
				status: "Pending"
			}

		})
		return invites;
	}
	async getFriendsLiveGames(user)
	{
		const me = await this.prisma.user.findUnique({
			where: {
				email: user._json.email
			}
		})
		const friends = await this.prisma.friendsTab.findMany({
			where: {
				user_id: me.id
			}
		})
		const games = [];
		for (let i = 0; i < friends.length; i++)
		{
			const livegames = await this.prisma.game.findMany({
				where: {
					OR: [
						{
							player1_id: friends[i].user_id,
							gameStatus: "OnGoing"
						},
						{
							player2_id: friends[i].user_id,
							gameStatus: "OnGoing"
						}
					]
				}
			})
			games.push(livegames);

			
		}

		return games;
	}

}
