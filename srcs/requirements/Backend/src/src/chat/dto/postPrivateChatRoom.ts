
import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class PostPrivateChatRoomDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    senderId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    receiverId: string;

};
