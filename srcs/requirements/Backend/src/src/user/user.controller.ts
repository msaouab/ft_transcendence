
import {
    Controller,
    Get,
    Post,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('User')
export class UserController {
    @Get(':id')
    getUser() {
        return 'getUser';
    }
}
