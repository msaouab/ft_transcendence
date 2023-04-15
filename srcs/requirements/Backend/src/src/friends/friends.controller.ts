

import {
    Controller,
    Get,
    Param
} from "@nestjs/common"

import { FriendsService } from "./friends.service"


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

}