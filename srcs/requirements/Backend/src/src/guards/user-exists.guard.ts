
import {
    Injectable, CanActivate, ExecutionContext
} from '@nestjs/common';
import { Observable } from 'rxjs';


import { UserService } from 'src/user/user.service';

@Injectable()
export class UserExistsGuard implements CanActivate {
    constructor(private readonly userService: UserService) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const { id } = request.params;
        const exits = this.userService.getUser(id).then((user) => {
            if (user) {
                return true;
            }
            return false;
        }
        );
        return exits;
    }
}



