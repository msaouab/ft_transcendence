import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    if (req.isAuthenticated()) {
      return true;
    }
    else
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED)

  }
}
