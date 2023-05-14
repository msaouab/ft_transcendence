import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException, Redirect } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Response } from 'express';
import passport, { Passport } from 'passport';
import { writeFileSync } from 'fs';
import * as rawbody from 'raw-body';
import { TfaDto } from 'src/user/dto/Tfa.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    async signup(user, res) {
        try {
            const find_user = await this.prisma.user.findUnique({
                where: {
                    login: user.username,
                },
            })
            if (find_user) {
                return this.login(user,res);
            }
            const createUser = await this.prisma.user.create({
                data: {
                    login: user.username,
                    email:  user._json.email,
                    firstName:  user.name.givenName,
                    lastName:  user.name.familyName,
                    avatar: './public/default.png',
                    status: 'Online',
                },
            })
            const createUserRankingData = await this.prisma.rankingData.create({
                data: {
                    user_id: createUser.id,
                },
            })
            }
        catch (e) {
            console.log(e);
        }
        return this.login(user,res);
    }

    async logout(user,res) {
        if (!user)
            throw new NotFoundException('User not found');
        try {
        const find_user = await this.prisma.user.findUnique({
            where: {
                email: user._json.email,
            },
        })
        if (find_user) {
            const updateUser = await this.prisma.user.update({
                where: {
                    id: find_user.id,
                },
                data: {
                    status: 'Offline',
                },
            })
            res.clearCookie('id');
            return updateUser;
        }
        }
        catch (e) {
            console.log(e);
        }
        
    }

    async login(user, res) {
        try {
            const find_user = await this.prisma.user.findUnique({
                where: {
                    email: user._json.email,
                },
            })
            if (find_user) {
                const updateUser = await this.prisma.user.update({
                    where: {
                        id: find_user.id,
                    },
                    data: {
                        status: 'Online',
                    },
                })
                res.cookie('id', find_user.id, {
                    httpOnly: true,
                    secure: false,
                })
            
                return updateUser;
            }

            else {
                return this.signup(user,res);
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    async delete(user,res) {
        try  {
            const find_user = await this.prisma.user.findUnique({
                where: {
                    email: user._json.email,
                },
            })
            if (find_user) {
                const deleteUser = await this.prisma.user.delete({
                    where: {
                        id: find_user.id,
                    },
                })
               res.clearCookie('id');
                // return deleteUser;
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    // async return_user(user) {
    //     const find_user = await this.prisma.user.findUnique({
    //         where: {
    //             login: user.username,
    //         },
    //     })
    //     return find_user;
    // }
    
    async twoFactor(user) {
        
    }

    async set2fa(id, TfaDto: TfaDto, user)
    {
        const status = TfaDto.IsActive;
        const find_user = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        })
        if (!find_user)
            throw new NotFoundException('User not found');
        if (find_user.email != user._json.email) {
            throw new ForbiddenException('Not allowed');
        }
        if (find_user) {
            const updateUser = await this.prisma.user.update({
                where: {
                    id: find_user.id,
                },
                data: {
                    tfa: status === 'true' ? 'true' : 'false',
                },
            })
            return updateUser;
        }
    }
    
    // async twoFactorverify(body, user,req) {
    //     var st = await this.twoFactor(user);
    //     var verify = speakeasy.totp.verify({
    //         secret : st,
    //         encoding: 'base32',
    //         token: req.body.number,
    //     });
    //     console.log(verify);
    //     // res.render('restaurants',{  });}
}
