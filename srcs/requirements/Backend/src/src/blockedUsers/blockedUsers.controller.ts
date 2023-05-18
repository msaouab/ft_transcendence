

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

    @Post(":id/blockedusers")
    async postBlockedUsers(@Body() BlockedUserDto: BlockedUserDto, @Param('id') id: string) {
        console.log("postBlockedUsers");
        const blockedUsers = await this.BlockedUsersService.createBlockedUser(BlockedUserDto, id);
        return blockedUsers;
    }

    @Delete(":id/blockedusers")
    async deleteBlockedUsers(@Body() BlockedUserDto: BlockedUserDto, @Param('id') id: string) {
        console.log("deleteBlockedUsers");

        console.log(BlockedUserDto);
        const blockedUsers = await this.BlockedUsersService.deleteBlockedUser(BlockedUserDto, id);
        return blockedUsers;
        // console.log("deleteBlockedUsers");
        // console.log(BlockedUserDto);
    }

}