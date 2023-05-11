import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class TfaDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    IsActive: string;

};
