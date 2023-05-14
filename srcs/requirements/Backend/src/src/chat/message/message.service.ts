
import {
    Body, HttpException,
    Injectable,
} from "@nestjs/common"
import { PrismaService } from 'prisma/prisma.service';
import {
    Prisma,
    PrivateMessage
} from "@prisma/client"
// import { } from "@prisma/client";

import { createMessageDto, updateMessageDto } from "./message.dto";
import { Request } from 'express';

@Injectable()
export class MessageService {
    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async getPrivateChatMessage(id: string, msgId: string): Promise<PrivateMessage[]> {

        try {
            const privateChatMessages = await this.prismaService.privateMessage.findMany({
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
            console.log("Body: ", body);
            const privateChatMessages = await this.prismaService.privateMessage.create({
                data: {
                    ...body
                }
            });
            if (privateChatMessages == null) {
                throw new HttpException("Private Chat Message not created", 500);

            }

            console.log("Private Chat Message created: ", privateChatMessages);
            return privateChatMessages;
        } catch (error) {
            console.log("Error: ", error);
            throw new HttpException("Private Chat Message not created", 500);
        }
    }


    async updatePrivateChatMessage(id: string, msgId: string, body: updateMessageDto): Promise<PrivateMessage> {
        try {
            const privateChatMessages = await this.prismaService.privateMessage.update({
                where: {
                    id: msgId
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


    async deletePrivateChatMessage(id: string, msgId: string, request: Request): Promise<PrivateMessage> {
        /*
        error handling 
             * if the user is not the owner of the message, then he can't delete i
        */
        const userId = request.cookies.id;
        if (!userId) {
            console.log("userId: ", userId);
            throw new HttpException("You are not logged in", 401);
        }
        const privateChatMessage = await this.prismaService.privateMessage.findUnique({
            where: {
                id: msgId
            }
        });

        // }
        console.log("privateChatMessage: ", privateChatMessage);
        if (privateChatMessage == null) {
            throw new HttpException("Private Chat Message not found", 404);
        }
        if (privateChatMessage.sender_id != userId) {
            throw new HttpException("You are not the owner of the message", 403);
        }
        return await this.prismaService.privateMessage.delete({
            where: {
                id: msgId
            }
        });
    }
}

