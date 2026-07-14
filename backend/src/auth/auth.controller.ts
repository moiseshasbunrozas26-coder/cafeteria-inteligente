import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { AuthService } from './auth.service.js';
import { Roles } from './decorators/roles.decorator.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthGuard } from './guards/auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';

type AuthenticatedRequest = Request & {
  user: {
    sub: number;
    email: string;
    role: 'ADMIN' | 'STAFF';
  };
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Req() request: AuthenticatedRequest) {
    return {
      message: 'Acceso autorizado',
      user: request.user,
    };
  }

  @Get('admin-test')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  getAdminTest(@Req() request: AuthenticatedRequest) {
    return {
      message: 'Acceso de administrador autorizado',
      user: request.user,
    };
  }
}