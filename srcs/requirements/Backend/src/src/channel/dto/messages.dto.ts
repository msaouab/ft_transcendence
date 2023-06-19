import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class MessagesDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    limit: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    offset: string
}