import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from '../utils/cte';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) { }

    async signup(dto: AuthDto) {
        const { email, password } = dto;
        // this.prisma.user
        const foundUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (foundUser) {
            throw new BadRequestException('email  already exist');
        }

        const hashedPWd = await this.hashPassword(password);
        // await this.prisma.user.create({
        //     data: {
        //         email,
        //         password: hashedPWd,
        //     },
        // });
        return { message: "signup good" };
    }

    async signin(dto: AuthDto, res: Response) {
        const { email, password } = dto;
        const foundUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!foundUser) {
            throw new NotFoundException('Wrong credentials');
        }

        const isMatch = await this.comparePassword({
            password,
            hashed: foundUser.password,
        });

        if (!isMatch) {
            throw new NotAcceptableException('Wrong credentials');
        }

        const token = await this.signToken({
            id: foundUser.id,
            email: foundUser.email,
        });

        if (!token) {
            throw new ForbiddenException();
        }

        res.cookie('token', token);
        return res.send({message:'logged in successfully'});
    }

    async signout(req: Request, res: Response) {
        res.clearCookie('token')
        return res.send({message: 'Logged out successfully'});
    }

    async hashPassword(password: string): Promise<string> {
        const hashedPW = await bcrypt.hash(password, 10);
        return hashedPW;
    }

    async comparePassword(args: { password: string, hashed: string }): Promise<boolean> {
        return await bcrypt.compare(args.password, args.hashed);
    }

    async signToken(asrgs: { id: string, email: string }) {
        const payload = asrgs;
        return this.jwt.signAsync(payload, { secret: jwtSecret })
    }
}
