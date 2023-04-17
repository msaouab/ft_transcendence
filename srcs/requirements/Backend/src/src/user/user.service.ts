import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException, Redirect, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Response } from 'express';
import { Passport, Profile } from 'passport';
import { User } from '../auth/user.decorator/user.decorator';


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
}
