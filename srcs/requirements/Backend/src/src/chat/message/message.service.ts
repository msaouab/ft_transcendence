
import {
    Body, HttpException, Req,
} from "@nestjs/common"
import { PrismaService } from 'prisma/prisma.service';
import {
    Prisma,
    PrivateMessage
} from "@prisma/client"

import { createMessageDto, updateMessageDto } from "./message.dto";
import { Request } from 'express';
export class MessageService {
    constructor(
        private readonly prismService: PrismaService
    ) { }

    async getPrivateChatMessage(id: string, msgId: string): Promise<PrivateMessage[]> {
        try {
            const privateChatMessages = await this.prismService.privateMessage.findMany({
                where: {
                    id: id
                }
            });
            return privateChatMessages;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new HttpException("Private Chat Message not found", 404);
                }
            }
        }
    }
    async createPrivateChatMessage(body: createMessageDto): Promise<PrivateMessage> {
        try {
            const privateChatMessages = await this.prismService.privateMessage.create({
                data: {
                    ...body
                }
            });
            return privateChatMessages;
        } catch (error) {
            throw new HttpException(error, 500);
        }
    }
    async deletePrivateChatMessage(id: string, msgId: string, @Req() request: Request): Promise<PrivateMessage> {
        /*
        error handling 
             * if the user is not the owner of the message, then he can't delete i
        */
        const userId = request.cookies.id;
        if (!(userId === msgId)) {
            throw new HttpException("You are not the owner of the message", 403);
        }
        try {
            const privateChatMessage = await this.prismService.privateMessage.delete({
                where: {
                    id: msgId
                }
            });
            return privateChatMessage;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new HttpException("Private Chat Message not found", 404);

                }
            }

        }
    }

    async updatePrivateChatMessage(id: string, msgId: string, body: updateMessageDto): Promise<PrivateMessage> {
        try {
            const privateChatMessages = await this.prismService.privateMessage.update({
                where: {
                    id: id
                },
                data: {
                    ...body
                }
            });
            return privateChatMessages;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new HttpException("Private Chat Message not found", 404);

                }
            }
        }
    }
}

