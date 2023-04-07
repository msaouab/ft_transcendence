import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(): Promise<{
        createUser: import(".prisma/client").User;
    }>;
}
