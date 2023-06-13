import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor( 
    private readonly prismaService: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const userId = req.cookies?.id;
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });
      if (req.isAuthenticated()) {
        if (user.tfa && user.otp_verified == false) {
            return false;
        }
        return true;
      }
    else
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED)

  }
}

