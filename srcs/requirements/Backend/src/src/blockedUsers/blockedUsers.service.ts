import {
    Injectable,
} from '@nestjs/common';

import { PrismaService } from "prisma/prisma.service";
import { BlockTab } from '@prisma/client';

import { UserService } from "src/user/user.service";
import { BlockedUserDto } from "./dto/block-user.dto";

@Injectable()
export class BlockedUsersService {

    constructor(private prisma: PrismaService,
        private readonly UserService: UserService
    ) { }

    async getBlockedUsers(id: string): Promise<BlockTab[]> {
        await this.UserService.getUser(id);
        return await this.prisma.blockTab.findMany({
            where: {
                user_id: id,
            },
        });
    }

    async createBlockedUser(BlockedUserDto: BlockedUserDto, id: string): Promise<BlockTab> {
        await this.UserService.getUser(id);
        await this.UserService.getUser(BlockedUserDto.blockedUser_id);
        return await this.prisma.blockTab.create({
            data: {
                user_id: id,
                blockedUser_id: BlockedUserDto.blockedUser_id,
            },
        });
    }

    async deleteBlockedUser(BlockedUserDto: BlockedUserDto, id: string): Promise<BlockTab> {
        await this.UserService.getUser(id);
        await this.UserService.getUser(BlockedUserDto.blockedUser_id);
        return await this.prisma.blockTab.delete({
            where: {
                user_id_blockedUser_id: {
                    user_id: id,
                    blockedUser_id: BlockedUserDto.blockedUser_id,
                },
            },
        });
    }
}
