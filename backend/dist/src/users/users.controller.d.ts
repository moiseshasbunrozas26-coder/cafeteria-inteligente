import { UsersService } from './users.service.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        name: string;
        email: string;
        id: number;
        role: import("../generated/prisma/enums.js").Role;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
