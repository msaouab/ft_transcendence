import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    async signup() {
        // this.prisma.user
        const createUser = await this.prisma.user.create({
            data: {
                login: 'EPrisma',
                email: 'elsa@prisma.io',
                firstName: 'Elsa', 
                lastName: 'Prisma', 
                password: 'sasa',     
                avatar: './avatar/default.png',  
                status:'Online',
            },
            })
        return { createUser };
    }

}
