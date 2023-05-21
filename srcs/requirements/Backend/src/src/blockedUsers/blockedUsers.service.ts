import {
    Injectable,
} from '@nestjs/common';

import { PrismaService } from "prisma/prisma.service";
import { BlockTab, PrivateChatRoom } from '@prisma/client';

import { UserService } from "src/user/user.service";
import { BlockedUserDto } from "./dto/block-user.dto";
import { createHash } from 'crypto';
@Injectable()
export class BlockedUsersService {

    constructor(private prisma: PrismaService,
        private readonly UserService: UserService
    ) { }

    async getBlockedUsers(id: string): Promise<BlockTab[]> {
        await this.UserService.getUser(id);
        const blocks = await this.prisma.blockTab.findMany({
            where: {
                user_id: id,

            },
        });
        console.log('blocks :>> ', blocks);
        return blocks;

    }

    async getRoomId(senderId: string, receiverId: string): Promise<string> {
        const roomName = [senderId, receiverId].sort().join('-');
        const secretKey = process.env.SECRET_KEY;
        // hash the room name using md5
        const hash = createHash('md5');
        const hashedRoomName = hash.update(roomName + secretKey).digest('hex');
        return hashedRoomName;
    }
    async createBlockedUser(BlockedUserDto: BlockedUserDto, id: string): Promise<BlockTab> {
        await this.UserService.getUser(id);
        await this.UserService.getUser(BlockedUserDto.blockedUser_id);
        if (id === BlockedUserDto.blockedUser_id) { 
            throw new Error("you want to block yourself? try a rope");
        }
         const block  =  await this.prisma.blockTab.create({
            data: {
                user_id: id,
                blockedUser_id: BlockedUserDto.blockedUser_id,
            },
        });

        if (!block) {
            throw new Error("Failed to block user");
        }
        // update private chatroom if ex    
        const roomName = await this.getRoomId(id, BlockedUserDto.blockedUser_id);
        const room = await this.prisma.privateChatRoom.findUnique({
            where: {
                id: roomName,
            },
        });
        if (room) {
            const updateRoom = await this.prisma.privateChatRoom.update({
                where: {
                    id: roomName,
                },
                data: {
                    blocked: true,
                },
            });
            if (!updateRoom) {
                throw new Error("Failed to update private chatroom");
            }
        }
        return block;
        
    }


    async deleteBlockedUser(id: string, blockedUserId: string): Promise<BlockTab> {
        console.log("The blocker is : ", id);
        console.log("The blocked is : ", blockedUserId);
        if (!id || !blockedUserId) {
            throw new Error("Missing id or blockedUserId");
        }
        if (id === blockedUserId) {
            throw new Error("you want to unblock yourself? try a rope");
        }
        await this.UserService.getUser(id);
        await this.UserService.getUser(blockedUserId);
        // if the user is not the blocker 
        // const key = id + blockedUserId + '1'
        const blockTab = await this.prisma.blockTab.findFirst({
            where: {
                AND: [
                    { user_id: id },
                    { blockedUser_id: blockedUserId },
                ],
            },
        });

        if (!blockTab) {
            throw new Error("You are not blocking this user");
        }

        const block =  await this.prisma.blockTab.delete({
            where: {
                uuid: blockTab.uuid,
            },
        });
        
        if (!block) {
            throw new Error("Failed to unblock user");
        }
        // update private chatroom if ex
        const roomName = await this.getRoomId(id, blockedUserId);
        const room = await this.prisma.privateChatRoom.findUnique({
            where: {
                id: roomName,
            },
        });
        if (room) {
            const updateRoom = await this.prisma.privateChatRoom.update({
                where: {
                    id: roomName,
                },
                data: {
                    blocked: false,
                },
            });
            if (!updateRoom) {
                throw new Error("Failed to update private chatroom");
            }
        }
        return block;
    }

}
