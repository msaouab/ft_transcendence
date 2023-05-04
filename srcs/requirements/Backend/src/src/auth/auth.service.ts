import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException, Redirect } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Response } from 'express';
import passport, { Passport } from 'passport';
import { writeFileSync } from 'fs';
import * as rawbody from 'raw-body';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    async signup(user, res) {
        const find_user = await this.prisma.user.findUnique({
            where: {
                login: user.username,
            },
        })
        if (find_user) {
            return find_user;
        }
        const createUser = await this.prisma.user.create({
            data: {
                login: user.username,
                email: user._json.email,
                firstName: user.name.givenName,
                lastName: user.name.familyName,
                password: 'create',
                avatar: './public/default.png',
                status: 'Offline',
            },
        })

        return this.login(user, res);
    }

    async logout(user, res) {
        const find_user = await this.prisma.user.findUnique({
            where: {
                login: user.username,
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

    async login(user, res) {
        const find_user = await this.prisma.user.findUnique({
            where: {
                login: user.username,
            },
        })
        if (find_user) {
            const updateUser = await this.prisma.user.update({
                where: {
                    id: find_user.id,
                },
                data: {
                    status: 'Online',
                    password: 'update',
                },
            })
            res.cookie('id', find_user.id, {

                /* 
                please don't uncomment this, httpOnly is a security feature
                that prevents client-side JavaScript from accessing cookies.
                we need to access id from client side, it's not sensitive data
                so we don't need to protect it.
                */
                // httpOnly: true,
                // secure: false,
            })

            return updateUser;
        }

        else {
            return this.signup(user, res);
        }
    }

    async delete(user, res) {
        const find_user = await this.prisma.user.findUnique({
            where: {
                login: user.username,
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

    // async return_user(user) {
    //     const find_user = await this.prisma.user.findUnique({
    //         where: {
    //             login: user.username,
    //         },
    //     })
    //     return find_user;
    // }

    // async twoFactor(user) : Promise<string> {
    //     var secret = speakeasy.generateSecret({
    //         length: 20,
    //         name: 'PONG',
    //     });
    //     qrcode.toDataURL(secret.otpauth_url, function (err, data_url) {
    //         writeFileSync('views/qrcode.ejs', "<img src=\"" + data_url + "\">");
    //     });
    //     return secret.base32;
    // }

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
