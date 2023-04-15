
import {
    Controller,
    Get,
    Post,
    Param
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';


// services
import {
    UserService,
} from './user.service';


@ApiTags('User')
@Controller('User')
export class UserController {
    constructor(private readonly UserService: UserService) { }
    @Get(':id')
    getUserById(@Param('id') id: string) {
        return this.UserService.getUserById(id);
    }
}
