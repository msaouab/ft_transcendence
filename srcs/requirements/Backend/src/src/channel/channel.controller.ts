import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { ApiTags } from "@nestjs/swagger";
import { BannedMemberDto, ChannelDto, MemberDto, JoinMemberDto, MessagesDto } from "./dto";
import { Request } from "express";
import { log } from "console";
import { AuthenticatedGuard } from "src/auth/guards/authenticated.guard";
import { ownerPermissionGuard } from "./guards/ownerPermission.guard";
import { administratorPermissionGuard } from "./guards/administratorPermission.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';

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
    addMember(@Param('id') channelId: string, @Body() dto: JoinMemberDto){
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

    @Post(':id/banned')
    @UseGuards(administratorPermissionGuard)
    banMember(@Param('id') channelId: string, @Body() dto: BannedMemberDto) {
        return this.ChannelService.banMember(channelId, dto);
    }
    @Get(':id/banned')
    getBannedMembers(@Param('id') channelId: string) {
        return this.ChannelService.getBannedMembers(channelId);
    }

    @Put(':id/banned')
    @UseGuards(administratorPermissionGuard)
    updateBannedMember(@Param('id') channelId: string, @Body() dto: BannedMemberDto) {
        return this.ChannelService.updateBannedMember(channelId, dto);
    }

    @Delete(':id/banned')
    @UseGuards(administratorPermissionGuard)
    unbanMember(@Param('id') channelId: string, @Body() dto: MemberDto) {
        return this.ChannelService.unbanMember(channelId, dto);
    }

    @Post(':id/muted')
    @UseGuards(administratorPermissionGuard)
    muteMember(@Req() req: Request, @Param('id') channelId: string, @Body() dto: BannedMemberDto) {
        return this.ChannelService.muteMember(channelId, dto);
    }

    @Get(':id/muted')
    getMutedMembers(@Param('id') channelId: string) {
        return this.ChannelService.getMutedMembers(channelId);
    }

    @Put(':id/muted')
    @UseGuards(administratorPermissionGuard)
    updateMutedMember(@Param('id') channelId: string, @Body() dto: BannedMemberDto) {
        return this.ChannelService.updateMutedMember(channelId, dto);
    }

    @Delete(':id/muted')
    @UseGuards(administratorPermissionGuard)
    unmuteMember(@Param('id') channelId: string, @Body() dto: MemberDto) {
        return this.ChannelService.unmuteMember(channelId, dto);
    }

    @Post('uploadAvatar')
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: "/app/public",
                filename: (req, file, callback) => {
                    callback(null, file.originalname);
                },
            }),
        }),
    )
    uploadAvatar(@UploadedFile() file: Express.Multer.File) {
        return file.filename;
    }

    @Get(':id/messages')
    // @UseGuards(AuthenticatedGuard)
    getMessages(@Param('id') channelId: string, @Query() dto: MessagesDto) {
        return this.ChannelService.getMessages(channelId, dto);
    }
}