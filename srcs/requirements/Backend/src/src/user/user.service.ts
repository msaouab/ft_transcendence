

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { User } from '@prisma/client';

// exceptions

import { UserNotFoundException } from 'src/exceptions/UserNotFound.exception';


@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }
    async getUserById(id: string): Promise<User> {
        // if the user doesn't exist, throw a 404 exception
        const user = await this.prisma.user.findFirst({
            where: {
                id,
            },
        });
        if (!user) {
            throw new UserNotFoundException();
        }
        
        return user;
    }
}




