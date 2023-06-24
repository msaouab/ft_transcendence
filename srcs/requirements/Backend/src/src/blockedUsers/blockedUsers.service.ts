import {
    ConflictException,
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
        return blocks;

    }


    async checkIfBlocked(id: string, blockedUserId: string): Promise<BlockTab> {
        await this.UserService.getUser(id);
        await this.UserService.getUser(blockedUserId);
        // find any block in which the user is blocking or blocked with the blocked user
        const block = await this.prisma.blockTab.findFirst({
            where: {
                OR: [
                    {
                        user_id: id,
                        blockedUser_id: blockedUserId,
                    },
                    {
                        user_id: blockedUserId,
                        blockedUser_id: id,
                    },
                ],
            },
        });
        return block;
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
        const checkBlock = await this.prisma.blockTab.findMany({
            where: {
                OR:[
                    { 
                        user_id: id,
                        blockedUser_id: BlockedUserDto.blockedUser_id,
                    },
                    {
                        user_id: BlockedUserDto.blockedUser_id,
                        blockedUser_id: id,
                    }
                ]
            },
        
        });
        if (checkBlock.length > 0) {
            throw new ConflictException("you already blocked this user");
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

        // remove the blocked user from the friends list
        const friend = await this.prisma.friendsTab.findUnique({
            where: {
                user_id_friendUser_id: {
                    user_id: id,
                    friendUser_id: BlockedUserDto.blockedUser_id,
                }
            }
        })
        if (friend) {
            const deleteFriend = await this.prisma.friendsTab.delete({
                where: {
                    user_id_friendUser_id: {
                        user_id: id,
                        friendUser_id: BlockedUserDto.blockedUser_id,
                    }
                }
            });
            if (!deleteFriend) {
                throw new Error("Failed to delete friend");
            }
        }

        // remove the blocked user from the pending friends list
        // const pendingFriend = await this.prisma.pendingFriendsTab.findUnique({
        
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
        // remove friend invation if exisit
        const invitation = await this.prisma.friendshipInvites.findUnique({
            where: {
                sender_id_receiver_id: {
                    sender_id: id,
                    receiver_id: blockedUserId,
                }
            }
        })
        if (invitation) {
            const deleteInvitation = await this.prisma.friendshipInvites.delete({
                where: {
                    sender_id_receiver_id: {
                        sender_id: id,
                        receiver_id: blockedUserId,
                    }
                }
            });
            if (!deleteInvitation) {
                throw new Error("Failed to delete invitation");
            }
        }



                    

        // update private chatroom if ex
        const roomName = await this.getRoomId(id, blockedUserId);
        const room = await this.prisma.privateChatRoom.findUnique({
            where: {
                id: roomName,
            },
        });
        // check if there's no record in th blockeTab between the two users
        const blockTab2 = await this.prisma.blockTab.findFirst({
            where: {
                AND: [
                    { user_id: blockedUserId },
                    { blockedUser_id: id },
                ],

            },
        });
        if (!blockTab2) {
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
    }
        return block;
    }

}
