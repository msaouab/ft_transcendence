import { ForbiddenException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { BannedMemberDto, ChannelDto, MemberDto, JoinMemberDto, MessagesDto } from "./dto";
import { Request } from "express";
import { PrismaService } from "prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { UserService } from "src/user/user.service";
import { log } from "console";


@Injectable({})
export class ChannelService {
    constructor(private prisma: PrismaService,
        private readonly UserService: UserService) { }

    async createChannel(request: Request, dto: ChannelDto) {
        const userId = request.cookies?.id;
        if (userId === undefined)
            throw new ForbiddenException("There is no ID in cookies");
        await this.UserService.getUser(userId)
        try {
            const channel = await this.prisma.channel.create({
                data: {
                    name: dto.name,
                    chann_type: dto.status,
                    password: dto.password,
                    owner_id: userId,
                    limit_members: -1,
                    description: dto.description,
                    avatar: dto.avatar
                }
            })
            this.UserService.addChannel(channel.id, channel.name, userId, "Owner");
            return channel;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                throw new HttpException("Channel already exists", HttpStatus.CONFLICT);
            }
            throw error;
        }
    }

    async getChannelById(id: string) {
        const channel = await this.prisma.channel.findUnique({
            where: {
                id: id
            }
        })
        if (channel === null)
            throw new HttpException("Channel not found", HttpStatus.NOT_FOUND)
        return channel;
    }

    async deleteAllMembers(channelId: string) {
        try {
            await this.prisma.membersTab.deleteMany({
                where: {
                    channel_id: channelId
                }
            })
        } catch (error) {
            throw new HttpException("Error while deleting members", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteAllAdministators(channelId: string) {
        try {
            await this.prisma.adminMembers.deleteMany({
                where: {
                    channel_id: channelId
                }
            })
        } catch (error) {
            throw new HttpException("Error while deleting administrators", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteChannel(id: string) {
        await this.getChannelById(id);
        await this.deleteAllMembers(id);
        await this.deleteAllAdministators(id);
        try {
            await this.prisma.channelsJoinTab.deleteMany({
                where: {
                    channel_id: id,
                }
            })
            await this.prisma.channel.delete({
                where: {
                    id: id
                }
            })
        } catch (error) {
            throw new HttpException("Error while deleting channels", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async addMember(channelId: string, dto: JoinMemberDto, addChannel: boolean = true) {
        await this.UserService.getUser(dto.userId);
        const channel = await this.getChannelById(channelId);
        try {
            if (channel.chann_type === "Secret" && channel.password !== dto.password)
                throw new ForbiddenException("Wrong password");
            const memberTab = await this.prisma.membersTab.create({
                data: {
                    member_id: dto.userId,
                    channel_id: channelId,
                }
            })
            if (addChannel === true)
                await this.UserService.addChannel(channel.id, channel.name, dto.userId, "Member");
            return memberTab;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                throw new ForbiddenException("This user is already a Member");
            }
            throw error;
        }
    }
    async getMembers(channelId: string): Promise<string[]> {
        await this.getChannelById(channelId);
        const memberTab = await this.prisma.membersTab.findMany({
            where: { channel_id: channelId },
            select: { member_id: true }
        })
        if (memberTab !== null)
            return memberTab.map((el) => el.member_id)
        else
            return []
    }

    async deleteMember(channelId: string, dto: MemberDto, deleteChannel: boolean = true) {
        await this.UserService.getUser(dto.userId);
        await this.getChannelById(channelId);
        try {
            const deleteMember = await this.prisma.membersTab.delete({
                where: {
                    channel_id_member_id: {
                        member_id: dto.userId,
                        channel_id: channelId
                    }
                }
            })
            if (deleteChannel === true)
                await this.UserService.deleteChannel(channelId, dto.userId);
            return deleteMember;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
                throw new ForbiddenException("This user is not a member of this channel");
            throw error;
        }
    }

    async addAdministrator(channelId: string, dto: MemberDto) {
        await this.deleteMember(channelId, dto, false);
        try {
            const adminTab = await this.prisma.adminMembers.create({
                data: {
                    channel_id: channelId,
                    admin_id: dto.userId
                }
            })
            try {
                await this.prisma.channelsJoinTab.update({
                    where: {
                        user_id_channel_id: {
                            user_id: dto.userId,
                            channel_id: channelId
                        }
                    },
                    data: {
                        role: "Admin"
                    }
                })
            } catch (error) {
                throw new ForbiddenException("Update role from Member to Admin failed");
            }
            return adminTab;
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
                throw new ForbiddenException("This user is already an Administrator");
            throw error;
        }
    }
    async getAdministrators(channelId: string) {
        await this.getChannelById(channelId);
        const adminTab = await this.prisma.adminMembers.findMany({
            where: { channel_id: channelId },
            select: { admin_id: true }
        })
        if (adminTab !== null)
            return adminTab.map((el) => el.admin_id)
        else
            return []
    }

    async deleteAdministrator(channelId: string, dto: MemberDto) {
        await this.UserService.getUser(dto.userId);
        const channel = await this.getChannelById(channelId);
        try {
            const deleteAdmin = await this.prisma.adminMembers.delete({
                where: {
                    channel_id_admin_id: {
                        admin_id: dto.userId,
                        channel_id: channelId
                    }
                }
            })
            try {
                await this.prisma.channelsJoinTab.update({
                    where: {
                        user_id_channel_id: {
                            user_id: dto.userId,
                            channel_id: channelId
                        }
                    },
                    data: {
                        role: "Member"
                    }
                })
            } catch (error) {
                throw new ForbiddenException("Update role from Admin to Member failed");
            }
            this.addMember(channelId, { userId: dto.userId, password: channel.password }, false);
            return deleteAdmin;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
                throw new ForbiddenException("This user is not an Administrator of this channel");
            throw error;
        }
    }

    async banMember(channelId: string, dto: BannedMemberDto) {
        await this.UserService.getUser(dto.userId);
        await this.getChannelById(channelId);
        try {
            const banMember = await this.prisma.bannedMembers.create({
                data: {
                    channel_id: channelId,
                    banned_id: dto.userId,
                    status: dto.status,
                    status_end_time: dto.end_time
                }
            })
            await this.deleteMember(channelId, dto);
            return banMember;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
                throw new ForbiddenException("This user is already banned");
            throw error;
        }
    }

    async getBannedMembers(channelId: string) {
        try {
            await this.getChannelById(channelId);
            const bannedTab = await this.prisma.bannedMembers.findMany({
                where: { channel_id: channelId },
                select: {
                    banned_id: true,
                    status: true,
                    status_end_time: true
                },
            })
            const bannedMembers = await Promise.all(bannedTab.map(async (el) => {
                const user = await this.prisma.user.findUnique({
                    where: { id: el.banned_id },
                    select: {
                        id: true,
                        login: true,
                        avatar: true,
                        status: true,
                    }
                })
                return {
                    ...user,
                    group_id: channelId,
                    role: "Banned",
                    banStatus: el.status,
                    status_end_time: el.status_end_time
                }
            }))
            return bannedMembers;
        } catch (error) {
            console.log(error);
        }
    }

    async unbanMember(channelId: string, dto: MemberDto) {
        await this.UserService.getUser(dto.userId);
        const channel = await this.getChannelById(channelId);
        try {
            const unbanMember = await this.prisma.bannedMembers.delete({
                where: {
                    channel_id_banned_id: {
                        banned_id: dto.userId,
                        channel_id: channelId
                    }
                }
            })
            await this.addMember(channelId, { userId: dto.userId, password: channel.password }, true);
            return unbanMember;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
                throw new ForbiddenException("This user is not banned");
            throw error;
        }
    }

    async updateBannedMember(channelId: string, dto: BannedMemberDto) {
        await this.UserService.getUser(dto.userId);
        await this.getChannelById(channelId);
        try {
            const updateBannedMember = await this.prisma.bannedMembers.update({
                where: {
                    channel_id_banned_id: {
                        banned_id: dto.userId,
                        channel_id: channelId
                    }
                },
                data: {
                    status: dto.status,
                    status_end_time: dto.end_time
                }
            })
            return updateBannedMember;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
                throw new ForbiddenException("This user is not banned");
            throw error;
        }
    }

    async muteMember(channelId: string, dto: BannedMemberDto) {
        await this.UserService.getUser(dto.userId);
        await this.getChannelById(channelId);
        try {
            const muteMember = await this.prisma.mutedMembers.create({
                data: {
                    channel_id: channelId,
                    muted_id: dto.userId,
                    status: dto.status,
                    status_end_time: dto.end_time
                }
            })
            return muteMember;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
                throw new ForbiddenException("This user is already muted");
            throw error;
        }
    }

    async getMutedMembers(channelId: string) {
        try {
            await this.getChannelById(channelId);
            const mutedTab = await this.prisma.mutedMembers.findMany({
                where: { channel_id: channelId },
                select: {
                    muted_id: true,
                    status: true,
                    status_end_time: true
                },
            })
            const mutedMembers = await Promise.all(mutedTab.map(async (el) => {
                const user = await this.prisma.user.findUnique({
                    where: { id: el.muted_id },
                    select: {
                        id: true,
                        login: true,
                        avatar: true,
                        status: true,
                    }
                })
                return {
                    ...user,
                    group_id: channelId,
                    role: "Muted",
                    muteStatus: el.status,
                    status_end_time: el.status_end_time
                }
            }))
            return mutedMembers;
        } catch (error) {
            console.log(error);
        }
    }

    async unmuteMember(channelId: string, dto: MemberDto) {
        await this.UserService.getUser(dto.userId);
        await this.getChannelById(channelId);
        try {
            const unmuteMember = await this.prisma.mutedMembers.delete({
                where: {
                    channel_id_muted_id: {
                        muted_id: dto.userId,
                        channel_id: channelId
                    }
                }
            })
            return unmuteMember;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
                throw new ForbiddenException("This user is not muted");
            throw error;
        }
    }

    async updateMutedMember(channelId: string, dto: BannedMemberDto) {
        await this.UserService.getUser(dto.userId);
        await this.getChannelById(channelId);
        try {
            const updateMutedMember = await this.prisma.mutedMembers.update({
                where: {
                    channel_id_muted_id: {
                        muted_id: dto.userId,
                        channel_id: channelId
                    }
                },
                data: {
                    status: dto.status,
                    status_end_time: dto.end_time
                }
            })
            return updateMutedMember;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
                throw new ForbiddenException("This user is not muted");
            throw error;
        }
    }

    async search(search: string, userId: string) {
        // search for channels with name containing search that are Public or Secret or Private and user is member
        const channels = await this.prisma.channel.findMany({
            where: {
                name: {
                    contains: search
                },
                OR: [
                    { chann_type: "Public" },
                    { chann_type: "Secret" },
                    {
                        AND: [
                            { chann_type: "Private" },
                            {
                                OR: [
                                    { members: { some: { member_id: userId } } },
                                    { owner_id: userId },
                                    { adminstrators: { some: { admin_id: userId } } },
                                    { mutedMembers: { some: { muted_id: userId } } },
                                ]
                            }
                        ]
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                chann_type: true,
                owner_id: true,
                dateCreated: true,
            }
        });
        return channels;
    }

    async getMessages(channelId: string, dto: MessagesDto) {
        await this.getChannelById(channelId);
        const { limit, offset } = dto;
        const take: number = limit ? Number(limit) : 10;
        const skip: number = offset ? Number(offset) : 0;

        const messages: {
            id: string,
            group_id: string,
            sender_id: string,
            sender_name: string,
            sender_avatar: string,
            content: string,
            dateCreated: string,
            role: string,
        }[] = [];
        try {
            const res = await this.prisma.message.findMany({
                where: {
                    receiver_id: channelId
                },
                orderBy: {
                    dateCreated: 'desc'
                },
                take: take,
                skip: skip,
            });
            const allMessages = await this.prisma.message.count({
                where: {
                    receiver_id: channelId
                }
            });
            for (const message of res) {
                let joindChannel = null;
                if (message.sender_id !== channelId) {
                    joindChannel = await this.prisma.channelsJoinTab.findFirst({
                        where: {
                            channel_id: channelId,
                            user_id: message.sender_id
                        },
                        include: {
                            user: {
                                select: {
                                    login: true,
                                    avatar: true,
                                }
                            }
                        }
                    });
                }
                messages.push({
                    id: message.id,
                    group_id: message.receiver_id,
                    sender_id: message.sender_id,
                    sender_name: joindChannel ? joindChannel.user.login : "Server",
                    sender_avatar: joindChannel ? joindChannel.user.avatar : "Server",
                    content: message.content,
                    dateCreated: message.dateCreated.toISOString(),
                    role: joindChannel ? joindChannel.role : "Server",
                })
            }
            return {
                messages: messages,
                count: allMessages
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getAllSubscribers(channelId: string) {
        try {
            const subscribersRes = await this.prisma.channelsJoinTab.findMany({
                where: {
                    channel_id: channelId,
                    OR: [
                        { role: "Member" },
                        { role: "Admin" },
                        { role: "Owner" },
                    ]
                },
                select: {
                    user: {
                        select: {
                            id: true,
                            login: true,
                            avatar: true,
                            status: true,
                        }
                    },
                    role: true,
                }
            });
            const subscribers = [];
            for (const el of subscribersRes) {
                subscribers.push({
                    id: el.user.id,
                    login: el.user.login,
                    avatar: el.user.avatar,
                    status: el.user.status,
                    role: el.role,
                    group_id: channelId,
                });
            }
            return subscribers;
        } catch (error) {
            console.log(error);
        }
    }

    async channelInfo(channelId: string) {
        try {
            const channel = await this.getChannelById(channelId);
            const subscribers = await this.getAllSubscribers(channelId);
            const bannedMembers = await this.getBannedMembers(channelId);
            const mutedMembers = await this.getMutedMembers(channelId);
            return {
                channel: channel,
                subscribers: subscribers,
                bannedMembers: bannedMembers,
                mutedMembers: mutedMembers,
            }
        } catch (error) {
            console.log(error);
        }
    }
}