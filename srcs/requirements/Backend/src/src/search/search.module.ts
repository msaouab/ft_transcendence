import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { UserModule } from 'src/user/user.module';
import { ChannelModule } from 'src/channel/channel.module';

@Module({
  imports: [UserModule, ChannelModule],
  controllers: [SearchController],
  providers: [SearchService]
})
export class SearchModule {}
