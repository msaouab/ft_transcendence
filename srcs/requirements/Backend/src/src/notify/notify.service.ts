import { PrismaService } from "prisma/prisma.service";
import { HttpException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()
export class NotificationService {
	constructor(private prisma: PrismaService) {}
	async updateUserStatus(userId: string, userStatus: boolean) {
		// if (!userId || userId === '') {
		//     throw new HttpException('Invalid user id', 400);
		// }
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		if (!user) {
			console.log("user not found");
			throw new HttpException("User not found", 404);
		}
		// beauty
		try {
			const user = await this.prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					realStatus: userStatus,
				},
			});
			return user;
		} catch (e) {
			if (e instanceof PrismaClientKnownRequestError) {
				throw new HttpException(e.message, Number(e.code));
			}
			throw new HttpException(e.message, 500);
		}
	}
}
