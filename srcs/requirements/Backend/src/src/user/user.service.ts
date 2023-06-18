import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException, Redirect, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Response } from 'express';
import { Passport, Profile } from 'passport';
import { User } from '../auth/user.decorator/user.decorator';
import { ChanRoles, Prisma } from '@prisma/client';
import { log } from 'console';
import { PutUserDto } from './dto/put-user.dto';
import { readFile,unlink } from 'fs/promises';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { TfaDto } from './dto/Tfa.dto';


import { PrivateMessage } from '@prisma/client';
import { lstat } from 'fs';
import { HOSTNAME } from 'src/main';
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
            console.log("user : ", id);
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
                avatar: `http://${HOSTNAME}:3000/` + file.filename,
            },
            select:{
                avatar: true
            }
        });
        return updatePath;
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

    async getQrCode(id: string, ftuser, res) {

        const user = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (user.email != ftuser._json.email) {
            throw new UnauthorizedException('Unauthorized');
        }
        //hash secret later
        const Cryptr = require('cryptr');
        const cryptr = new Cryptr(process.env.SECRET)
        const secret = cryptr.decrypt(user.otp_base32);
         const otpauth = authenticator.keyuri(
                user.email,
                'PONG',
                secret,
            );
            // const qrCodeUrl = await toDataURL(otpauth);
            var qrcode = require("qrcode-svg");
            const qrCodeSvg = new qrcode({
                content: otpauth,
                padding: 0,
                width: 256,
                height: 256,
                color: '#000000',
                background: '#ffffff',
                ecl: 'M',
              }).svg();
              res.send(qrCodeSvg);
    }

    async verify2fa(id, sixDigits: string, ft_user,res)
    {       
        const userToken = sixDigits;
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
        const Cryptr = require('cryptr');
        const cryptr = new Cryptr(process.env.SECRET)
        const secret = cryptr.decrypt(user.otp_base32);
        const delta = authenticator.checkDelta(userToken, secret);
        if(delta > 0 || delta == null) {
            throw new BadRequestException('Wrong code');
        }
        else 
        {
            if (user.tfa == true)
            {
                if (user.otp_verified == false)
                {
                    await this.prisma.user.update
                    ({
                    where: {
                        id: id,
                    },
                    data: {
                        otp_verified: true,
                    },
                    });
                    res.send('OK').status(200);
                }
                else 
                {
                    await this.prisma.user.update
                    ({
                    where: {
                        id: id,
                    },
                    data: {
                        tfa: !user.tfa,
                        otp_verified: false,
                    },
                    });
                }
                
            }
            else 
            {
                await this.prisma.user.update({
                    where: {
                        id: id,
                    },
                    data: {
                        tfa: !user.tfa,
                        otp_verified: true,
                    },
                });
                res.send('Success').status(200);
            }
        }
    }

    async setStatus(id,status, ftuser) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (user.email != ftuser._json.email) {
            throw new UnauthorizedException('Unauthorized');
        }
        if (status != 'Online' && status != 'Offline' && status != 'Idle' && status != 'Donotdisturb'
            && status != 'InGame') {
            throw new BadRequestException('Wrong status');
        }
        return await this.prisma.user.update({
            where: {
                id: id,
            },
            data: {
                status: status,
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

    async updateStatus(user,id ,status) {
        const me = await this.prisma.user.findFirst({
            
            where: {
                id: id,
            },
        });
        if (!me) {
            throw new NotFoundException('User not found');
        }
        if (user._json.email != me.email) {
            throw new UnauthorizedException('Unauthorized');
        }
        if (status != 'Online' && status != 'Offline' && status != 'Idle' && status != 'DoNotDisturb')
        {
            throw new BadRequestException('Wrong status');
        }
        return await this.prisma.user.update({
            where: {
                id: id,
            },
            data: {
                status: status,
            },
        });
    }



    /// getUnsenNotifications
    async getUnseenNotifications(id: string) {
        // const user = await this.prisma.user.findUnique({
        //     where: {
        //         id: id,
        //     }
        // });
        // if (!user) {
        //     throw new NotFoundException('User not found');
        // }
        const notifications = await this.prisma.notification.findMany({
            where: {
                user_id: id,      
            }
        });
        // don't change later, this should not be an error
        // if (!notifications) {
        //     throw new NotFoundException('Notifications not found');
        // }
        return notifications;
    }

}
    