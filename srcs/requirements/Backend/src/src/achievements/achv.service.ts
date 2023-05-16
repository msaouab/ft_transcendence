import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException, Redirect, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Response } from 'express';
import { Passport, Profile } from 'passport';
import { User } from '../auth/user.decorator/user.decorator';
import { ChanRoles, Prisma } from '@prisma/client';
import { log } from 'console';
import { readFile,unlink } from 'fs/promises';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

@Injectable()
export class AchvService {
    constructor(private prisma: PrismaService) { }

   
}
    
