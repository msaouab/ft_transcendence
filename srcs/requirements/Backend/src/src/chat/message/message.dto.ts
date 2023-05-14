
import {
    IsString,
    IsNotEmpty,
    IsDate,
    IsBoolean
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class createMessageDto {
    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    dateCreated: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    seen: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    chatRoom_id: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    sender_id: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    receiver_id: string;

}

export class updateMessageDto {
    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    dateCreated: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    content: string;


    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    seen: boolean;
}
