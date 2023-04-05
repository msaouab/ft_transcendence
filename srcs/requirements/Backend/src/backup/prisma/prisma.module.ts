import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()//to not import everywhere
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}


