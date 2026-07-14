import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: CreateUserDto): Promise<{
        accessToken: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
            active: boolean;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
            active: boolean;
        };
    }>;
}
