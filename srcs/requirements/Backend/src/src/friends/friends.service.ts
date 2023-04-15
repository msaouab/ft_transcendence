
import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { FriendsTab } from "@prisma/client";

import { FriendshipExistsException } from 'src/exceptions/FriendshipExist.exception';

// imported services
import { UserService } from "src/user/user.service";


@Injectable()
export class FriendsService {
    constructor(private prisma: PrismaService,
        private readonly UserService: UserService
    ) { }
    async getFriends(id: string): Promise<FriendsTab[]> {

        await this.UserService.getUser(id);
        return await this.prisma.friendsTab.findMany({
            where: {
                OR: [
                    {
                        user_id: id,
                    },

                    {
                        friendUser_id: id,
                    },
                ],
            },
        }
        );
    }
    async createFriendship(user_id: string, friendUser_id: string): Promise<FriendsTab> {
        /* errs:
        *   if friendship already exist
        *   if user_id or friendUser_id not exist
        */
        await this.UserService.getUser(user_id);
        await this.UserService.getUser(friendUser_id);
        const freindship = await this.prisma.friendsTab.findUnique({
            where: {
                user_id_friendUser_id: {
                    user_id: user_id,
                    friendUser_id: friendUser_id,
                },
            },
        });

        if (freindship) {
            throw new FriendshipExistsException();
        }

        // create friendship
        return await this.prisma.friendsTab.create({
            data: {
                user_id: user_id,
                friendUser_id: friendUser_id,
            },
        });
    }
}
