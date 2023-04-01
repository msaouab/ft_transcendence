/// <reference types="express" />
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(dto: AuthDto): Promise<{
        message: string;
    }>;
    signin(dto: AuthDto, res: any): Promise<import("express").Response<any, Record<string, any>>>;
    signout(res: any, req: any): Promise<import("express").Response<any, Record<string, any>>>;
}
