import { ForbiddenException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ChannelDto, MemberDto } from "./dto";
import { Request } from "express";
import { PrismaService } from "prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { UserService } from "src/user/user.service";
import { log } from "console";


@Injectable({})
export class ChannelService {
    constructor(private prisma: PrismaService,
        private readonly UserService: UserService){}

    async createChannel(request: Request, dto: ChannelDto){
        const userId = request.cookies?.id;
        if (userId === undefined)
            throw new ForbiddenException("There is no ID in cookies");
        await this.UserService.getUser(userId)
        try{
            const channel = await this.prisma.channel.create({
                data:{
                    name: dto.name,
                    chann_type: "Public",
                    owner_id: userId,
                    limit_members: -1
                }
            })
            this.UserService.addChannel(channel.id, channel.name, userId, "Owner");
            return channel;
        }catch(error){
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"){
                throw new ForbiddenException("There is already a channel with the name provided");
            }
            throw error;
        }
    }

    async getChannelById(id: string) {
        const channel = await this.prisma.channel.findUnique({
            where:{
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

    async addMember(channelId: string, dto: MemberDto, addChannel: boolean = true) {
        await this.UserService.getUser(dto.userId);
        const channel = await this.getChannelById(channelId);
        try {
            const memberTab = await this.prisma.membersTab.create({
                data:{
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
    async getMembers(channelId: string): Promise<string[]>{
        await this.getChannelById(channelId);
        const memberTab =  await this.prisma.membersTab.findMany({
            where:{ channel_id: channelId },
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
        try{
            const deleteMember = await this.prisma.membersTab.delete({
                where:{
                    channel_id_member_id:{
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
        await this.getChannelById(channelId);
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
            this.addMember(channelId, dto, false);
            return deleteAdmin;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
                throw new ForbiddenException("This user is not an Administrator of this channel");
            throw error;
        }
    }
}