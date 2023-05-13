
import {
    Controller,
    Get,
    Param,
    Body,
    UseGuards,
    Delete,
    Put,
    Req
} from "@nestjs/common"

import { Request } from 'express';
import { ApiTags } from "@nestjs/swagger"
// import { ChatService } from "./chat.service"
import { MessageService } from "./message.service";
import { updateMessageDto } from "./message.dto";
@ApiTags('ChatRooms/Message')
@Controller('chatrooms')
export class MessageConroller {
    constructor(
        private readonly MessageService: MessageService
    ) { }
    @Get("/private/:id/message/:msgId")
    async getPrivateChatMessages(@Param('id') id: string, @Param('msgId') msgId: string) {
        return await this.MessageService.getPrivateChatMessage(id, msgId);
    }
    @Delete("/private/:id/message/:msgId")
    async deletePrivateChatMessages(@Param('id') id: string, @Param('msgId') msgId: string, @Req() req: Request) {
        console.log("deletePrivateChatMessages");
        // console.log("req", req);
        return await this.MessageService.deletePrivateChatMessage(id, msgId, req);

    }
    @Put("/private/:id/message/:msgId")
    async updatePrivateChatMessages(@Param('id') id: string, @Param('msgId') msgId: string, @Body() body: updateMessageDto) {
        return await this.MessageService.updatePrivateChatMessage(id, msgId, body);
    }


}

