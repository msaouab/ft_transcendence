import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException, Redirect, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Response } from 'express';
import { Passport, Profile } from 'passport';
import { User } from '../auth/user.decorator/user.decorator';
import { PutUserDto } from './dto/put-user.dto';
import { readFile,unlink } from 'fs/promises';

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
    async getUserByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
    async updateUser(id: string, user, PutUserDto ){
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
    async getRankData(id: string) {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: id,
                },
            });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            const rankData = await this.prisma.rankingData.findUnique({
                where: {
                    user_id: id,
                },
            });
            if (!rankData) {
                throw new NotFoundException('Ranking Data not found');
            }
            return rankData;

        }
    
    async uploadImage(id: string,ft_user, file) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (user.email != ft_user._json.email) {
           throw new UnauthorizedException('Unauthorized');
        }
        if (!file) {
            throw new BadRequestException('No file');
        };
        if (file.mimetype != 'image/png' && file.mimetype != 'image/jpeg') {
            throw new BadRequestException('Wrong file type');
        }

        // if (user.avatar != "default.png")
        //     unlink(user.avatar);
        const updatePath = await this.prisma.user.update({
            where: {
                id: id,
            },
            data: {
                avatar: file.destination + '/' + file.filename,
            },
        });

    }

    async getImage(id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const imageData = await readFile(user.avatar);
        return {
            buffer: imageData,
            contentType: 'image/jpeg',
          };
    }
}
    
