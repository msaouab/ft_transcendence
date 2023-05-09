import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException, Redirect, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Response } from 'express';
import { Passport, Profile } from 'passport';
import { User } from '../auth/user.decorator/user.decorator';
import { ChanRoles, Prisma } from '@prisma/client';
import { log } from 'console';
import { PutUserDto } from './dto/put-user.dto';
import { PrivateMessage } from '@prisma/client';
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

    async updateUser(id: string, user, PutUserDto) {
        const { login, firstName, lastName } = PutUserDto;
        const finduser = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        if (finduser.email != user._json.email) {
            throw new UnauthorizedException('Unauthorized');
        }
        if (!finduser) {
            throw new NotFoundException('User not found');
        }
        const alreadyExist = await this.prisma.user.findUnique({
            where: {
                login: login,
            },
        });
        if (alreadyExist && alreadyExist.id != id) {
            throw new BadRequestException('Login already exist');
        }

        if (login == '' || firstName == '' || lastName == '') {
            throw new BadRequestException('Empty fields');
        }

        return await this.prisma.user.update({
            where: {
                id: id,
            },
            data: {
                login: login,
                firstName: firstName,
                lastName: lastName,
            },
        });
    }


    async addChannel(channelId: string, channelName: string, userId: string, role: ChanRoles) {
        try {
            const channel = await this.prisma.channelsJoinTab.create({
                data: {
                    user_id: userId,
                    channel_name: channelName,
                    channel_id: channelId,
                    role: role
                }
            });
            return channel;
        } catch (error) {
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

    async deleteChannel(channelId: string, userId: string) {
        try {
            // change later
            // const channel = await this.prisma.channelsJoinTab.delete({
            //     where:{
            //         user_id_channel_id:{
            //             user_id: userId,
            //             channel_id: channelId
            //         }
            //     }
            // })
            // return channel;
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
                throw new ForbiddenException("The channel is not joined")
            throw error;
        }
    }

    async search(query: string) {
        // search for users with `query` in their login
        const users = await this.prisma.user.findMany({
            where: {
                login: {
                    contains: query,
                },
            },
        });
        return users;
    }
}
