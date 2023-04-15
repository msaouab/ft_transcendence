


import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class GetUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    id: string;
};
