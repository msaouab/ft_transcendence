import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [PrismaModule, AuthModule],

})
export class AppModule { }


