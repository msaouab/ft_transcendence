import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, MinDate, ValidateIf} from "class-validator";

enum BannedMemeberStatusTime {
    Permanent= "Permanent",
    Temporary= "Temporary"
}

export class BannedMemberDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    userId: string
    
    @ApiProperty()
    @IsEnum(BannedMemeberStatusTime)
    status: BannedMemeberStatusTime
    
    @ApiProperty()
    @ValidateIf((o) => o.status === BannedMemeberStatusTime.Temporary)
    @Transform(({ value }) => value && new Date(value))
    @IsDate()
    @MinDate(new Date())
    @IsOptional()
    end_time: Date;
}