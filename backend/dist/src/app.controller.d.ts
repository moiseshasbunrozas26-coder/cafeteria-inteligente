import { AppService } from './app.service.js';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getDatabaseStatus(): Promise<{
        status: string;
        database: string;
        registeredUsers: number;
        timestamp: string;
    }>;
}
