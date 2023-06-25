import { Request } from "express";
import { PrismaService } from "prisma/prisma.service";
import { ChannelService } from "src/channel/channel.service";
import { UserService } from "src/user/user.service";
import { CanActivate, ExecutionContext, ForbiddenException, Inject } from "@nestjs/common";

export class ownerPermissionGuard implements CanActivate {
    constructor(private prisma: PrismaService,
        @Inject(ChannelService) private readonly channelService: ChannelService,
        @Inject(UserService) private readonly userService: UserService) { }
    canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest()
        return this.isOwner(request);
    }
    async isOwner(request: Request): Promise<boolean> {
        const userId = request.cookies?.id;
        userId === undefined;
        if (userId === undefined)
            throw new ForbiddenException("There is no User ID in cookies");
        await this.userService.getUser(userId);
        const channelId = request.params?.id;
        if (channelId === undefined)
            throw new ForbiddenException("There is no Channel ID in params");
        const channel = await this.channelService.getChannelById(channelId);
        if (channel.owner_id !== userId)
            throw new ForbiddenException("You are not the Owner of this channel")
        return true;
    }
}