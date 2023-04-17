import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
// Modules
import { AuthModule, } from './auth/auth.module';
import { InvitesModule } from './invites/invites.module';
import { UserModule } from './user/user.module';
//Contollers
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
//services
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      validationSchema: configValidationSchema,
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    InvitesModule],

    controllers: [AppController, UserController],
    providers: [AuthService, UserService],

})
export class AppModule { }


