import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
// import { Status } from '@prisma/client';

enum Status {
    PENDING = 'Pending',
    ACCEPTED = 'Accepted',
    REJECTED = 'Rejected',
}

export class inviteGameDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    login: string;
};

export class StatusInviteDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    status: Status
}
