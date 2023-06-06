import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { PostGameDto } from "./dto/post.game.dto";
import { use } from "passport";
import { on } from "events";

export enum Rank {
	Novice = "Novice",
	Veteran = "Veteran",
	Rif_Rebellion = "Rif_Rebellion",
	Master = "Master",
	Sahara_Tuareg = "Sahara_Tuareg",
}
type MyUser = {
	id: string;
	pts: number;
};

@Injectable()
export class AchvService {
	constructor(private prisma: PrismaService) {}

	async getAchv(id: string) {
		const achv = await this.prisma.achievementsAssignement.findFirst({
			where: {
				player_id: id,
			},
		});
		if (!achv) {
			throw new NotFoundException("No achievements found for this user");
		}
		return achv;
	}
	checkRank(xp: number) {
		if (xp < 200) return Rank.Novice;
		else if (xp < 400 && xp >= 200) return Rank.Veteran;
		else if (xp < 500 && xp >= 400) return Rank.Rif_Rebellion;
		else if (xp < 700 && xp >= 500) return Rank.Master;
		else if (xp >= 700) return Rank.Sahara_Tuareg;
	}
	async CheckAchv(
		one_id: string,
		two_id: string,
		pts_one: number,
		pts_two: number
	) {
		var isdraw = false;
		//    if (!one_id || !two_id || !pts_one || !pts_two)
		//         throw new NotFoundException("Missing data");
		var winner_id, loser_id, winner_pts, loser_pts;
		if (pts_one > pts_two) {
			winner_id = one_id;
			loser_id = two_id;
			winner_pts = pts_one;
			loser_pts = pts_two;
		} else if (pts_one < pts_two) {
			winner_id = two_id;
			loser_id = one_id;
			winner_pts = pts_two;
			loser_pts = pts_one;
		}
		if (pts_one == pts_two) isdraw = true;

		console.log("winner_id:", winner_id, "loser_id:", loser_id, "winner_pts:", winner_pts, "loser_pts:", loser_pts)

		await this.update_data(winner_id, loser_id, winner_pts, loser_pts, isdraw);
		await this.Here_We_Go(winner_id);
		await this.Here_We_Go(loser_id);
		console.log("winner_id:", winner_id, "loser_id:", loser_id, "winner_pts:", winner_pts, "loser_pts:", loser_pts)
		if (isdraw == false) {
			await this.Ace(winner_id, winner_pts, loser_pts);
			await this.Kasbah_King(winner_id);
			await this.Intouchable(winner_id);
			await this.Kang_the_conqueror(winner_id);
			await this.Are_u_okay(loser_id, loser_pts);
		}
		await this.Atlas_Athlete(winner_id, loser_id, winner_pts, loser_pts);
	}
	async Here_We_Go(user_id: string) {
		const user = await this.prisma.rankingData.findFirst({
			where: {
				user_id: user_id,
			},
		});
		if (!user) {
			throw new NotFoundException("No ranking found for this user");
		}
		var find_achv = await this.prisma.achievementsAssignement.findFirst({
			where: {
				player_id: user_id,
				achievement_id: 1,
			},
		});
		if (user.games == 1 && !find_achv) {
			await this.prisma.achievementsAssignement.create({
				data: {
					player_id: user_id,
					achievement_id: 1,
				},
			});
			await this.prisma.rankingData.update({
				where: {
					user_id: user_id,
				},
				data: {
					xp: user.xp + 5,
				},
			});
		}
	}
	async Atlas_Athlete(
		winner_id: string,
		loser_id: string,
		winner_pts: number,
		loser_pts: number
	) {
		const users: MyUser[] = [
			{ id: winner_id, pts: winner_pts },
			{ id: loser_id, pts: loser_pts },
		];
		for (let i = 0; i < users.length; i++) {
			const winner = await this.prisma.rankingData.findFirst({
				where: {
					user_id: users[i].id,
				},
			});
			if (!winner) {
				throw new NotFoundException("No ranking found for this user");
			}
			var find_achv = await this.prisma.achievementsAssignement.findFirst({
				where: {
					player_id: users[i].id,
					achievement_id: 3,
				},
			});
			if (winner.points >= 50 && !find_achv) {
				await this.prisma.achievementsAssignement.create({
					data: {
						player_id: users[i].id,
						achievement_id: 3,
					},
				});
				await this.prisma.rankingData.update({
					where: {
						user_id: users[i].id,
					},
					data: {
						xp: winner.xp + 5,
					},
				});
			}
		}
	}
	async update_data(
		winner_id: string,
		loser_id: string,
		winner_pts: number,
		loser_pts: number,
		isdraw: boolean
	) {
		const users: MyUser[] = [
			{ id: winner_id, pts: winner_pts },
			{ id: loser_id, pts: loser_pts },
		];

		for (let i = 0; i < users.length; i++) {
			const user = users[i];
			console.log("user:", user);
			const to_update = await this.prisma.rankingData.findFirst({
				where: {
					user_id: user.id,
				},
			});
			if (!to_update) {
				throw new NotFoundException("No ranking found for this user");
			}
			if (isdraw == true) {
				await this.prisma.rankingData.update({
					where: {
						user_id: user.id,
					},
					data: {
						games: to_update.games + 1,
						draws: to_update.draws + 1,
						points: to_update.points + user.pts,
						xp: to_update.xp + 0.2,
						winning_streak: 0,
						losing_streak: 0,
					},
				});
			}
		}
		if (isdraw == false) {
			const winner = await this.prisma.rankingData.findFirst({
				where: {
					user_id: winner_id,
				},
			});
			const loser = await this.prisma.rankingData.findFirst({
				where: {
					user_id: loser_id,
				},
			});
			if (!winner || !loser) {
				throw new NotFoundException("No ranking found for this user");
			}
			await this.prisma.rankingData.update({
				where: {
					user_id: winner_id,
				},
				data: {
					games: winner.games + 1,
					wins: winner.wins + 1,
					points: winner.points + winner_pts,
					xp: winner.xp + 3 + winner_pts * 0.5 - loser_pts * 0.25,
					winning_streak: winner.winning_streak + 1,
					losing_streak: 0,
					rank: this.checkRank(
						winner.xp + 3 + winner_pts * 0.5 - loser_pts * 0.25
					),
				},
			});
			const l = await this.prisma.rankingData.update({
				where: {
					user_id: loser_id,
				},
				data: {
					games: loser.games + 1,
					loses: loser.loses + 1,
					points: loser.points + loser_pts,
					xp: loser.xp - 1 + loser_pts * 0.5 - winner_pts * 0.5,
					winning_streak: 0,
					losing_streak: loser.losing_streak + 1,
					rank: this.checkRank(
						loser.xp - 1 + loser_pts * 0.5 - winner_pts * 0.25
					),
				},
			});

			if (l.xp < 0) {
				await this.prisma.rankingData.update({
					where: {
						user_id: loser_id,
					},
					data: {
						xp: 0,
					},
				});
			}
		}
	}
	async Ace(winner_id: string, winner_pts: number, loser_pts: number) {
		if (!loser_pts) {
			const user = await this.prisma.rankingData.findFirst({
				where: {
					user_id: winner_id,
				},
			});
			if (!user) {
				throw new NotFoundException("No ranking found for this user");
			}
			let find_achv = await this.prisma.achievementsAssignement.findFirst({
				where: {
					player_id: winner_id,
					achievement_id: 2,
				},
			});
			if (!find_achv) {
				const arc = await this.prisma.achievementsAssignement.create({
					data: {
						player_id: winner_id,
						achievement_id: 2,
					},
				});
				console.log('arc:', arc);
				await this.prisma.rankingData.update({
					where: {
						user_id: winner_id,
					},
					data: {
						xp: user.xp + 5,
					},
				});
			}
		}
	}
	async Kang_the_conqueror(winner_id: string) {
		const user = await this.prisma.rankingData.findFirst({
			where: {
				user_id: winner_id,
			},
		});
		if (!user) {
			throw new NotFoundException("No ranking found for this user");
		}
		var find_achv = await this.prisma.achievementsAssignement.findFirst({
			where: {
				player_id: winner_id,
				achievement_id: 6,
			},
		});
		if (user.wins == 20 && !user.loses && !user.draws && !find_achv) {
			await this.prisma.achievementsAssignement.create({
				data: {
					player_id: winner_id,
					achievement_id: 6,
				},
			});
			await this.prisma.rankingData.update({
				where: {
					user_id: winner_id,
				},
				data: {
					xp: user.xp + 5,
				},
			});
		}
	}
	async Kasbah_King(winner_id: string) {
		const user = await this.prisma.rankingData.findFirst({
			where: {
				user_id: winner_id,
			},
		});
		if (!user) {
			throw new NotFoundException("No ranking found for this user");
		}
		var find_achv = await this.prisma.achievementsAssignement.findFirst({
			where: {
				player_id: winner_id,
				achievement_id: 4,
			},
		});
		if (user.winning_streak >= 5 && !find_achv) {
			await this.prisma.achievementsAssignement.create({
				data: {
					player_id: winner_id,
					achievement_id: 4,
				},
			});
			await this.prisma.rankingData.update({
				where: {
					user_id: winner_id,
				},
				data: {
					xp: user.xp + 5,
				},
			});
		}
	}
	async Intouchable(winner_id: string) {
		const user = await this.prisma.rankingData.findFirst({
			where: {
				user_id: winner_id,
			},
		});
		if (!user) {
			throw new NotFoundException("No ranking found for this user");
		}
		var find_achv = await this.prisma.achievementsAssignement.findFirst({
			where: {
				player_id: winner_id,
				achievement_id: 5,
			},
		});
		if (user.wins == 5 && !user.loses && !user.draws && !find_achv) {
			await this.prisma.achievementsAssignement.create({
				data: {
					player_id: winner_id,
					achievement_id: 5,
				},
			});
			await this.prisma.rankingData.update({
				where: {
					user_id: winner_id,
				},
				data: {
					xp: user.xp + 5,
				},
			});
		}
	}
	async Are_u_okay(loser_id: string, loser_pts: number) {
		const user = await this.prisma.rankingData.findFirst({
			where: {
				user_id: loser_id,
			},
		});
		if (!user) {
			throw new NotFoundException("No ranking found for this user");
		}
		var find_achv = await this.prisma.achievementsAssignement.findFirst({
			where: {
				player_id: loser_id,
				achievement_id: 7,
			},
		});
		if (user.losing_streak == 5 && !find_achv) {
			await this.prisma.achievementsAssignement.create({
				data: {
					player_id: loser_id,
					achievement_id: 7,
				},
			});
			await this.prisma.rankingData.update({
				where: {
					user_id: loser_id,
				},
				data: {
					xp: user.xp + 5,
				},
			});
		}
	}

	async testAchievements(body: PostGameDto) {
		const { playerOne, playerTwo, playeOne_pts, playeTwo_pts } = body;
		const checkUser = await this.prisma.user.findFirst({
			where: { id: playerOne },
		});
		const checkUsert = await this.prisma.user.findFirst({
			where: { id: playerTwo },
		});
		console.log(checkUser, checkUsert);
		if (!checkUser || !checkUsert)
			throw new NotFoundException("User not found");
		return await this.CheckAchv(
			playerOne,
			playerTwo,
			playeOne_pts,
			playeTwo_pts
		);
	}

	async getUserAchievements(id) {
		const user = await this.prisma.user.findFirst({
			where: {
				id: id,
			},
		});
		if (!user) {
			throw new NotFoundException("No user found");
		}
		const achievementsIds = await this.prisma.achievementsAssignement.findMany({
			where: {
				player_id: id,
			},
		});

		if (!achievementsIds) {
			throw new NotFoundException("No achievements found");
		}
		const achivementInfos = [];
		for (let achivement of achievementsIds) {
			const achivementInfo = await this.prisma.achievements.findFirst({
				where: {
					achievement_id: achivement.achievement_id,
				},
			});
			achivementInfos.push(achivementInfo);
		}
		return achivementInfos;
	}
}
