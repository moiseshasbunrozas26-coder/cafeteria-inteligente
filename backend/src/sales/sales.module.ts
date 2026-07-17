import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { UsersModule } from '../users/users.module.js';
import { SalesController } from './sales.controller.js';
import { SalesService } from './sales.service.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}