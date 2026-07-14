import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto): Promise<{
        name: string;
        email: string;
        id: number;
        role: import("../generated/prisma/enums.js").Role;
        active: boolean;
        createdAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        name: string;
        email: string;
        id: number;
        passwordHash: string;
        role: import("../generated/prisma/enums.js").Role;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
