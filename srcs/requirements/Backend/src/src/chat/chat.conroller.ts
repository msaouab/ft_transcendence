
import {
    Controller,
    Get,
    Param,
    Body,
    UseGuards,
    Query,
    Post,
    Delete,

    Req
} from "@nestjs/common"


import { Request } from 'express';
import { ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger"
import { ChatService } from "./chat.service"
import { GetPrivateChatMessagesDto } from "./dto/getPrivateChatRoom.dto";
import { PostPrivateChatRoomDto } from "./dto/postPrivateChatRoom";
// Guards

@ApiTags('ChatRooms')
@Controller('chatrooms')
export class ChatController {
    constructor(
        private readonly ChatService: ChatService
    ) { }

    // this to get a privat chat room
    @Get("/private/single/:senderId/:receiverId")
    @ApiParam({ name: 'senderId', required: true, description: 'id of the sender' })
    @ApiParam({ name: 'receiverId', required: true, description: 'id of the receiver' })
    async getPrivateChatRooms(@Param('senderId') senderId: string, @Param('receiverId') receiverId: string) {
        const privateChatRooms = await this.ChatService.getPrivateChatRoom(senderId, receiverId);
        return privateChatRooms;
    }

    @Post("/private/")
    async createPrivateChatRoom(@Body() createPrivateChatRoomDto: PostPrivateChatRoomDto) {
        const privateChatRoom = await this.ChatService.createPrivateChatRoom(createPrivateChatRoomDto);
        return privateChatRoom;
    }


    // 

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


    // deleting a private chat room
    @Delete("/private/:id")
    @ApiParam({ name: 'id', required: true, description: 'id of the private chat room' })
    async deletePrivateChatRoom(@Param('id') id: string, @Req() req: Request) {

        const userId = req.cookies.id;
        if (!userId) {
            throw new Error("user not logged in or you fucked up the cookies,if that's the case then login again");
        }
        
        const privateChatRoom = await this.ChatService.deletePrivateChatRoom(id, userId)
        return privateChatRoom;
    }

    @Get("/group/:id")
    async getGroupChat(@Param('id') id: string) {
        console.log("getGroupChat");
        // console.log(id);
        // const groupChat = await this.ChatService.getGroupChatRooms(id);
        // return groupChat;
    }







}

