
import { Module } from '@nestjs/common';
import { SearchService } from './search.service';

import { SearchGateway } from './search.gateway';


@Module({
    imports: [],
    controllers: [],
    providers: [
        SearchService,
        SearchGateway
    ],
    exports: []
})
export class SearchModule { }

