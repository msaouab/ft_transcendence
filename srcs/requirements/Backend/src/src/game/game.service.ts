import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException, Redirect, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Response, Request } from 'express';
import { Passport, Profile } from 'passport';
import { User } from '../auth/user.decorator/user.decorator';
import { StatusInviteDto, inviteGameDto } from './dto/invite.game.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GameService {
	constructor (private prisma: PrismaService, 
		private UserService: UserService,
		) {}
	async StartGame(type: string, opponent: string, user, inviteGameDto: inviteGameDto) {
		try {
		const { login } = inviteGameDto;
			const	FindUser = await this.prisma.user.findUnique({
				where: {
					email: user._json.email
				}
			});
			if (FindUser.status == 'InGame') {
				throw new BadRequestException('You are already in game');
			}
			
			if (opponent === "friend") {
				const FindFriend = await this.prisma.user.findUnique({
					where: {
						login: login
					}
				});
				if (!FindFriend) {
					throw new NotFoundException('User not found');
				}
				if (FindFriend.status == 'InGame') {
					throw new BadRequestException('Your friend is already in game');
				}
				if (FindFriend.email == user._json.email) {
					throw new BadRequestException('You can\'t play with yourself');
				}
				if (FindFriend.status == 'DoNotDisturb') {
					throw new BadRequestException('Your friend is in DoNotDisturb mode');
				}
				// if (FindFriend.blockedUsers.includes(FindUser.id) || FindUser.blockedUsers.includes(FindFriend.id)) {
				// 	throw new BadRequestException('User Not Found');
				// }
				const ExistInvit = await this.prisma.gameInvites.findFirst({
					where: {
						sender_id: FindUser.id,
						receiver_id: FindFriend.id
					}
				})
				if (ExistInvit) {
					throw new BadRequestException('You already sent an invitation to this user');
				}
				const newInvitation = await this.prisma.gameInvites.create({
					data: {
						sender: {
							connect: {
							id: FindUser.id,
						},
					},
					receiver_id: FindFriend.id,
					status: 'Pending',
					validUntil: new Date(Date.now() + 60000 * 5),
					},
				});
				return newInvitation;
			}
		}
		catch (err) {
			throw new BadRequestException(err.message);
		}
	}
	async StatusInvite(id: string, user: Profile, StatusInviteDto: StatusInviteDto, request: Request) {
		try {
			const { status } = StatusInviteDto;
			const FindUser = await this.UserService.getUser(id);
			const userId = request.cookies?.id;
			if (userId === undefined)
			throw new ForbiddenException("There is no ID in cookies");
			const AcceptInvite = await this.prisma.gameInvites.findFirst({
				where: {
					sender_id: FindUser.id,
					receiver_id: userId,
				}
			});
			if (status !== 'Accepted' && status !== 'Rejected') {
				throw new BadRequestException('Bad Input status');
			}
			if (!AcceptInvite) {
				throw new BadRequestException('Invitation not found');
			}
			if (AcceptInvite.status == 'Accepted') {
				throw new BadRequestException('Invitation already accepted');
			}
			if (AcceptInvite.status == 'Rejected') {
				throw new BadRequestException('Invitation already rejected');
			}
			//	expired invitation
			if (AcceptInvite.validUntil < new Date()) {
				throw new BadRequestException('Invitation expired');
			}
			const UpdateStatus = await this.prisma.gameInvites.update({
				where: {
					sender_id_receiver_id: {
						sender_id: FindUser.id,
						receiver_id: userId,
					}
				},
				data: {
					status: status,
				}
			})
			if (status == 'Accepted')
				this.CreateGamingRoom(FindUser.id, userId);
		}
		catch (err) {
			throw new BadRequestException(err.message);
		}
	}
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
						}
					]
				}
			});
			if (FindGame) {
				throw new BadRequestException('Game already exist');
			}
			const newGame = await this.prisma.game.create({
				data: {
					player1_id: FindUser.id,
					player2_id: FindFriend.id,
					gameStatus: 'OnGoing',
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
					status: 'InGame',
				}
			});
			const UpdateFriend = await this.prisma.user.update({
				where: {
					id: FindFriend.id,
				},
				data: {
					status: 'InGame',
				}
			});
			return newGame;
		}
		catch (err) {
			throw new BadRequestException(err.message);
		}
	}
}
