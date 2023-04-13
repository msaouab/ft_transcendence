import { Controller, Get, Version } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";


@ApiTags('Home')
@Controller({
    version: process.env.API_VERSION,
})
export class AppController {
    @Get()
    getHello(): string {
        return 'Hello World!';
    }
}
