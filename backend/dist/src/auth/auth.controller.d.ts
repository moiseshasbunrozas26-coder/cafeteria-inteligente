import type { Request } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
type AuthenticatedRequest = Request & {
    user: {
        sub: number;
        email: string;
        role: 'ADMIN' | 'STAFF';
    };
};
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
    getProfile(request: AuthenticatedRequest): {
        message: string;
        user: {
            sub: number;
            email: string;
            role: "ADMIN" | "STAFF";
        };
    };
    getAdminTest(request: AuthenticatedRequest): {
        message: string;
        user: {
            sub: number;
            email: string;
            role: "ADMIN" | "STAFF";
        };
    };
}
export {};
