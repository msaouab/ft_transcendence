import { Request } from "express";
import { PrismaService } from "prisma/prisma.service";
import { ChannelService } from "src/channel/channel.service";
import { UserService } from "src/user/user.service";
import { CanActivate, ExecutionContext, ForbiddenException, Inject } from "@nestjs/common";

export class administratorPermissionGuard implements CanActivate {
    constructor(private prisma: PrismaService, 
        @Inject(ChannelService) private readonly channelService: ChannelService,
        @Inject(UserService) private readonly userService: UserService) { }
    canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest()
        return this.isAdministrator(request);
    }
    
    async isAdministrator(request: Request): Promise<boolean> {
        const userId = request.cookies?.id;
        userId === undefined;
        if (userId === undefined)
            throw new ForbiddenException("There is no User ID in cookies");
        await this.userService.getUser(userId);
        const channelId = request.params?.id;
        if (channelId === undefined)
            throw new ForbiddenException("There is no Channel ID in params");
        await this.channelService.getChannelById(channelId);
        const channelJoind = await this.prisma.channelsJoinTab.findFirst({
            where:{
                user_id: userId,
                channel_id: channelId
            }
        });
        if (channelJoind === null)
            throw new ForbiddenException("You are not in this channel");
        if (channelJoind.role !== 'Admin' && channelJoind.role !== 'Owner')
            throw new ForbiddenException("You are not an Administrator of this channel");
        return true;
    }
}