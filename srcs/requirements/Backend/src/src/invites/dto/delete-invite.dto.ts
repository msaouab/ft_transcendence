import {
    IsNotEmpty,
    IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class DeleteInviteDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    receiver_id: string;
}

