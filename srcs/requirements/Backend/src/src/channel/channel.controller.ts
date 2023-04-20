import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { ApiTags } from "@nestjs/swagger";
import { ChannelDto } from "./dto";
import { Request } from "express";
import { log } from "console";
import { AuthenticatedGuard } from "src/auth/guards/authenticated.guard";

@ApiTags('Channels')
@Controller('Channels')
export class ChannelController{
    constructor(private ChannelService: ChannelService){}

    @Post('create')
    @UseGuards(AuthenticatedGuard)
    createChannel(@Req() request: Request, @Body() dto: ChannelDto){
        return this.ChannelService.createChannel(request, dto);
    }
    
    @Get(':id')
    @UseGuards(AuthenticatedGuard)
    getChannel(@Param('id') channelId: string){
        return this.ChannelService.getChannelById(channelId);
    }
}