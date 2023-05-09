import { Controller, Get, Query, Req } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Search')
@Controller('Search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get()
    async search(@Req() request: Request, @Query() dto: SearchDto) {
        return await this.searchService.search(request, dto);
    }
}
