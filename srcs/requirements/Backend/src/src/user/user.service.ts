import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException, Redirect, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Response } from 'express';
import { Passport, Profile } from 'passport';
import { User } from '../auth/user.decorator/user.decorator';
import { ChanRoles, Prisma } from '@prisma/client';
import { log } from 'console';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async getUser(id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async updateUser(id: string, user, data: any) {
        const finduser = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        if (finduser.email != user._json.email) {
            throw new UnauthorizedException('Unauthorized');
        }
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return await this.prisma.user.update({
            where: {
                id: id,
            },
            data: data,
        });
    }

    async addChannel(channelId: string, channelName: string, userId: string, role: ChanRoles){
        try{
            const channel = await this.prisma.channelsJoinTab.create({
                data:{
                    user_id: userId,
                    channel_name: channelName,
                    channel_id: channelId,
                    role: role
                }
            });
            return channel;
        }catch(error){
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
                throw new ForbiddenException("The channel is already joined")
            throw error;
        }
        
    }

    async getJoindChannels(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: id },
            include: { channelsJoined: true }
        })
        if (user === null)
            throw new NotFoundException('No User was found with id provided');
        return user.channelsJoined;
    }
}
