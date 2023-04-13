import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AppController } from './app.controller';

// Modules
import { AuthModule, } from './auth/auth.module';
import { InvitesModule } from './invites/invites.module';
import { UserModule } from './user/user.module';


@Module({
  controllers: [AppController],
  imports: [PrismaModule,
    UserModule,
    AuthModule,
    InvitesModule],

})
export class AppModule { }


