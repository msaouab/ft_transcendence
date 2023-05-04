
import {
    Controller,
    Get,
    Param,
    Body,
    UseGuards,
    Query
} from "@nestjs/common"

import { ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger"
import { ChatService } from "./chat.service"
import { GetPrivateChatMessagesDto } from "./dto/getPrivateChatRoom.dto";

// Guards

@ApiTags('ChatRooms')
@Controller('chatrooms/')
export class ChatController {
    constructor(
        private readonly ChatService: ChatService
    ) { }
    @Get("/private/:id/messages")
    @ApiQuery({ name: 'limit', required: false, description: 'limit the number of messages returned (default 100)' })

    @ApiQuery({ name: 'seen', required: false, description: 'return only seen messages (default false)' })
    @ApiQuery({ name: 'userId', required: false, description: 'return only messages from this user' })
    @ApiParam({ name: 'id', required: true, description: 'id of the private chat room' })
    async getPrivateChatMessages(@Param('id') id: string, @Query('limit') limit: string, @Query('offset') offset: string, @Query('seen') seen: string, @Query('userId') userId: string) {
        // console.log("limit: ", limit, "offset: ", offset);
        const privateChatMessages = await this.ChatService.getPrivateChatMessages(id, { limit, offset, seen, userId });
        return privateChatMessages;
    }

    @Get("/group/:id")
    async getGroupChat(@Param('id') id: string) {
        console.log("getGroupChat");
        // console.log(id);
        // const groupChat = await this.ChatService.getGroupChatRooms(id);
        // return groupChat;
    }







}

