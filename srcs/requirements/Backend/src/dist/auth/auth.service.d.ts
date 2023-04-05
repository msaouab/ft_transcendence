import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    signup(dto: AuthDto): Promise<{
        message: string;
    }>;
    signin(dto: AuthDto, res: Response): Promise<Response<any, Record<string, any>>>;
    signout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    hashPassword(password: string): Promise<string>;
    comparePassword(args: {
        password: string;
        hashed: string;
    }): Promise<boolean>;
    signToken(asrgs: {
        id: string;
        email: string;
    }): Promise<string>;
}
