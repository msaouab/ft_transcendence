

import {
    HttpException,
    HttpStatus,
} from '@nestjs/common';


export class FriendshipExistsException extends HttpException {
    constructor() {
        super('Friendship already exist', HttpStatus.NOT_FOUND);
    }
}
