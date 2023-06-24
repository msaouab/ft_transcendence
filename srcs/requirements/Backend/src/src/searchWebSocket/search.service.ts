
import { PrismaService } from "prisma/prisma.service";
import { Socket } from "socket.io";
import { User, Channel } from "@prisma/client";
import { Injectable } from "@nestjs/common";


@Injectable()
export class SearchService {
    constructor(private prisma: PrismaService) { }

    async searchWebSocket(search: string, limit: number, user_id: string) {

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
        // console.log("Joined Channels are: ", joindChannels);

        const bannedChannels = await this.prisma.bannedMembers.findMany({
            where: {
                banned_id: user_id,
            },
        });

        console.log("Banned Channels are: ", bannedChannels);


        const updatedChannels = [];
        for (const channel of channels) {
            const users = await this.prisma.channelsJoinTab.findMany({
                where: {
                    channel_id: channel.id,
                },
            });

            console.log("Channel Users are: ", users);
            // if the channel is in bannedChannels
            if (bannedChannels.find((bannedChannel) => bannedChannel.channel_id === channel.id)) {
                console.log("Channel is in bannedChannels");
                continue;
            }
            const updatedChannel = { ...channel, users: users };
            updatedChannels.push(updatedChannel);
        }

        // console.log("Channels are: ", channels);
        const result = {
            users: users,
            channels: updatedChannels,
        };

        return result;
    }
}


