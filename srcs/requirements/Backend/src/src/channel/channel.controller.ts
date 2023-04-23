import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { ApiTags } from "@nestjs/swagger";
import { ChannelDto, MemberDto } from "./dto";
import { Request } from "express";
import { log } from "console";
import { AuthenticatedGuard } from "src/auth/guards/authenticated.guard";
import { ownerPermissionGuard } from "./guards/ownerPermission.guard";

@ApiTags('Channels')
@Controller('Channels')
export class ChannelController{
    constructor(private ChannelService: ChannelService){}

    @Post('create')
    // @UseGuards(AuthenticatedGuard)
    createChannel(@Req() request: Request, @Body() dto: ChannelDto){
        return this.ChannelService.createChannel(request, dto);
    }
    
    @Get(':id')
    @UseGuards(AuthenticatedGuard)
    getChannel(@Param('id') channelId: string){
        return this.ChannelService.getChannelById(channelId);
    }

    @Delete(':id')
    @UseGuards(ownerPermissionGuard)
    deleteChannel(@Param('id') channelId: string){
        return this.ChannelService.deleteChannel(channelId);
    }
    
    @Post(':id/members')
    // @UseGuards(AuthenticatedGuard)
    addMember(@Param('id') channelId: string, @Body() dto: MemberDto){
        return this.ChannelService.addMember(channelId, dto)
    }
    
    @Get(':id/members')
    // @UseGuards(AuthenticatedGuard)
    getMembers(@Param('id') channelId: string){
        return this.ChannelService.getMembers(channelId);
    }

    @Delete(':id/members')
    // @UseGuards(AuthenticatedGuard)
    deleteMember(@Param('id') channelId: string, @Body() dto: MemberDto){
        return this.ChannelService.deleteMember(channelId, dto);
    }

    @Post(':id/administrators')
    @UseGuards(ownerPermissionGuard)

    addAdministrator(@Param('id') channelId: string, @Body() dto: MemberDto) {
        return this.ChannelService.addAdministrator(channelId, dto);
    }

    @Get(':id/administrators')
    getAdministrators(@Param('id') channelId: string) {
        return this.ChannelService.getAdministrators(channelId);
    }
    @Delete(':id/administrators')
    @UseGuards(ownerPermissionGuard)
    deleteAdministrator(@Param('id') channelId: string, @Body() dto: MemberDto) {
        return this.ChannelService.deleteAdministrator(channelId, dto);
    }
}