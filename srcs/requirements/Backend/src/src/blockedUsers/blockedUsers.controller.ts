

import {
    Controller,
    Get,
    Delete,
    Param,
    Post,
    Body
} from "@nestjs/common"

import { ApiTags } from "@nestjs/swagger"
import { BlockedUsersService } from "./blockedUsers.service"
import { BlockedUserDto } from "./dto/block-user.dto";
@ApiTags('User')
@Controller('User')
export class BlockedUsersController {

    constructor(
        private readonly BlockedUsersService: BlockedUsersService
    ) { }

    @Get(":id/blockedUsers")
    async getBlockedUsers(@Param('id') id: string) {
        const blockedUsers = await this.BlockedUsersService.getBlockedUsers(id);
        return blockedUsers;
    }

    @Post(":id/blockedUsers")
    async postBlockedUsers(@Body() BlockedUserDto: BlockedUserDto, @Param('id') id: string) {
        const blockedUsers = await this.BlockedUsersService.createBlockedUser(BlockedUserDto, id);
        return blockedUsers;
    }

    @Delete(":id/blockedUsers")
    async deleteBlockedUsers(@Body() BlockedUserDto: BlockedUserDto, @Param('id') id: string) {
        const blockedUsers = await this.BlockedUsersService.deleteBlockedUser(BlockedUserDto, id);
        return blockedUsers;
    }

}