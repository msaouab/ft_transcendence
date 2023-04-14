


import { IsNotEmpty, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum InviteStatus {
    ACCEPTED = 'Accepted',
    REJECTED = 'Rejected',
}

export class PutInviteDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    receiver_id: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(InviteStatus)
    status: InviteStatus;
}



