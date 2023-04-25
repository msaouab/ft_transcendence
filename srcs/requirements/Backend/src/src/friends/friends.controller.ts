

import {
    Controller,
    Get,
    Delete,
    Param,
    Body
} from "@nestjs/common"

import { FriendsService } from "./friends.service"

import { DeleteFriendshipDto } from "./dto/delete-friendship.dto";
import { ApiTags } from "@nestjs/swagger"

@ApiTags('User')
@Controller('User')
export class FriendsController {

    constructor(
        private readonly FriendsService: FriendsService
    ) { }

    @Get(":id/friends")
    async getFriends(@Param('id') id: string) {
        const friends = await this.FriendsService.getFriends(id);
        return friends;
    }

    @Delete(":id/friends")
    async deleteFriends(@Body() DeleteFriendshipDto: DeleteFriendshipDto, @Param('id') id: string) {
        const friends = await this.FriendsService.deleteFriendship(DeleteFriendshipDto, id);
        return friends;
    }

}