import { ForbiddenException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ChannelDto } from "./dto";
import { Request } from "express";
import { PrismaService } from "prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { UserService } from "src/user/user.service";
import { log } from "console";


@Injectable({})
export class ChannelService {
    constructor(private prisma: PrismaService, 
        private readonly UserService: UserService){}

    async createChannel(request: Request, dto: ChannelDto){
        const userId = request.cookies?.id;
        if (userId === undefined)
            throw new ForbiddenException("There is no ID in cookies");
        await this.UserService.getUser(userId)
        try{
            const channel = await this.prisma.channel.create({
                data:{
                    name: dto.name,
                    chann_type: "Public",
                    owner_id: userId,
                    limit_members: -1
                }
            })
            return channel;
        }catch(error){
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"){
                throw new ForbiddenException("There is already a channel with the name provided");
            }
            throw error;
        }
    }

    async getChannelById(id: string) {
        const channel = await this.prisma.channel.findUnique({
            where:{
                id: id
            }
        })
        if (channel === null)
            throw new HttpException("Channel not found", HttpStatus.NOT_FOUND)
        return channel;
    }
}