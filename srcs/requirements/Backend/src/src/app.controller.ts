import { Controller, Get, Version } from "@nestjs/common";

@Controller({
    version: process.env.API_VERSION,
})
export class AppController {
    @Get()
    getHello(): string {
        return 'Hello World!';
    }
}
