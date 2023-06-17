
import { PrismaService } from "prisma/prisma.service";
import { Socket } from "socket.io";
import { User, Channel } from "@prisma/client";
import { Injectable } from "@nestjs/common";


@Injectable()
export class SearchService {
    constructor(private prisma: PrismaService) { }

    async searchWebSocket(search: string, limit: number) {

        if (search == '') {
            return [];
        }
        if (limit == 0) {
            limit = 4;
        }
        // console.log("Im in search service and the search is: ", search);
        if (search == '') {
            return [];
        }
        const users = await this.prisma.user.findMany({
            where: {
                OR: [
                    {
                        login: {

                            startsWith: search,

                        },
                    },
                    {
                        firstName: {
                            startsWith: search,
                        },
                    },
                    {
                        lastName: {
                            startsWith: search,
                        },
                    },
                ],


            },
            take: limit,

        });

        // console.log("Users are: ", users);


        const channels = await this.prisma.channel.findMany({
            where: {
                name: {
                    startsWith: search,
                },
                chann_type: {
                    // is not private
                    not: 'Private',
                },

            },
            take: limit,
        });

        // console.log("Channels are: ", channels);
        const result = {
            users: users,
            channels: channels,
        };

        return result;
    }
}


