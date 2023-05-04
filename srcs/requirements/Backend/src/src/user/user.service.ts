import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException, Redirect, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Response } from 'express';
import { Passport, Profile } from 'passport';
import { User } from '../auth/user.decorator/user.decorator';
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


}
