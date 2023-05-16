import {IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class PostGameDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    playerOne: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    playerTwo: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    playeOne_pts: number;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    playeTwo_pts: number;

};
