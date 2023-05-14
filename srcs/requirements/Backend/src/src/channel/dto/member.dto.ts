import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class MemberDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    userId: string
}