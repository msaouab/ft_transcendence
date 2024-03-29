

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
@Controller('user')
export class BlockedUsersController {

    constructor(
        private readonly BlockedUsersService: BlockedUsersService
    ) { }

    @Get(":id/blockedusers")
    async getBlockedUsers(@Param('id') id: string) {
        const blockedUsers = await this.BlockedUsersService.getBlockedUsers(id);
        return blockedUsers;
    }


    @Get(":id/blockedusers/:idBlockedUser")
    async checkIfBlocked(@Param('id') id: string, @Param('idBlockedUser') blockedUserId: string) {

        const blockedUsers = await this.BlockedUsersService.checkIfBlocked(id, blockedUserId);
        return blockedUsers;
    }


    @Post(":id/blockedusers")
    async postBlockedUsers(@Body() BlockedUserDto: BlockedUserDto, @Param('id') id: string) {
        const blockedUsers = await this.BlockedUsersService.createBlockedUser(BlockedUserDto, id);
        return blockedUsers;
    }


    @Delete(":id/blockedusers/:idBlockedUser")
    async deleteBlockedUsers(@Param('id') id: string, @Param('idBlockedUser') blockedUserId: string) {
        const blockedUsers = await this.BlockedUsersService.deleteBlockedUser(id, blockedUserId);
        return blockedUsers
    }

}