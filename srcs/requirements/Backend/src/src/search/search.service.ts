import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ChannelService } from 'src/channel/channel.service';
import { UserService } from 'src/user/user.service';
import { SearchDto } from './dto';
import { Request } from 'express';

@Injectable()
export class SearchService {
    constructor(private readonly prismaService: PrismaService,
        private readonly userService: UserService,
        private readonly channelService: ChannelService) { }

    async search(request: Request, dto: SearchDto) {
        /*
        ** 1. Check if user is logged in
        ** 2. Check if entity is valid
        ** 3. Search for for users and channels with the keyword and return the result
        ** 4. If entity is "Users", return only the users
        ** 5. If entity is "Channels", return only the channels that Public or Secret or Private and the request user is a owner
                or member or admin or muted
        ** 6. If entity is "All", return both users and channels
        */
        const { entity, keyword } = dto;
        const userId = request.cookies?.id;
        if (userId === undefined)
            throw new ForbiddenException("There is no ID in cookies");
        await this.userService.getUser(userId);
        try {
            if (entity === "Users") {
                const users = await this.userService.search(keyword);
                return { "Users": users };
            }
            else if (entity === "Channels") {
                const channels = await this.channelService.search(keyword, userId);
                return { "Channels": channels };
            }
            const users = await this.userService.search(keyword);
            const channels = await this.channelService.search(keyword, userId);
            return { "Users": users, "Channels": channels };
        } catch (error) {
            throw error;
        }
    }
}
