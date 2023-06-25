

import {
    Controller,
    Get,
    Delete,
    Param,
    Body,
    UseGuards
} from "@nestjs/common"

import { FriendsService } from "./friends.service"

import { DeleteFriendshipDto } from "./dto/delete-friendship.dto";
import { ApiTags } from "@nestjs/swagger"
import { AuthenticatedGuard } from "src/auth/guards/authenticated.guard";

@ApiTags('User')
@Controller('user')

export class FriendsController {

    constructor(
        private readonly FriendsService: FriendsService
    ) { }

    @Get(":id/friends")
    @UseGuards(AuthenticatedGuard)
    async getFriends(@Param('id') id: string) {
        const friends = await this.FriendsService.getFriends(id);
        return friends;
    }


    @Get(":id/friends/info")
    @UseGuards(AuthenticatedGuard)
    async getFriendsInfo(@Param('id') id: string) {
        const friends = await this.FriendsService.getFriendsInfo(id);
        return friends;
    }

    @Get(":id/is-friend/:friend_id")
    @UseGuards(AuthenticatedGuard)
    async isFriend(@Param('id') id: string, @Param('friend_id') friend_id: string) {
        return   await this.FriendsService.isFriend(id, friend_id);
    }

    
    @Delete(":id/friends")
    @UseGuards(AuthenticatedGuard)
    async deleteFriends(@Body() DeleteFriendshipDto: DeleteFriendshipDto, @Param('id') id: string) {
        const friends = await this.FriendsService.deleteFriendship(DeleteFriendshipDto, id);
        return friends;
    }

}