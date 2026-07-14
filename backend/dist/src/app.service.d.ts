import { PrismaService } from './prisma/prisma.service.js';
export declare class AppService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHello(): string;
    getDatabaseStatus(): Promise<{
        status: string;
        database: string;
        registeredUsers: number;
        timestamp: string;
    }>;
}
