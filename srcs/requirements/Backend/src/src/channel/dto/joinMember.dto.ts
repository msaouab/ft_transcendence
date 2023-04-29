import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class JoinMemberDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    userId: string
    
    @ApiProperty()
    @IsOptional()
    password: string
}