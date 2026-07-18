import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateUserDto) {
    const email =
      dto.email.trim().toLowerCase();

    const existingUser =
      await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      throw new ConflictException(
        'Ya existe un usuario con este correo.',
      );
    }

    const passwordHash =
      await hash(dto.password, 12);

    return this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email,
        passwordHash,
        role: dto.role ?? 'STAFF',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email:
          email.trim().toLowerCase(),
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    if (!user) {
      throw new NotFoundException(
        `No existe un usuario con ID ${id}.`,
      );
    }

    return user;
  }

  async update(
    id: number,
    dto: UpdateUserDto,
    actingUserId: number,
  ) {
    const existingUser =
      await this.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          role: true,
          active: true,
        },
      });

    if (!existingUser) {
      throw new NotFoundException(
        `No existe un usuario con ID ${id}.`,
      );
    }

    const removingOwnAdminAccess =
      id === actingUserId &&
      (
        dto.active === false ||
        dto.role === 'STAFF'
      );

    if (removingOwnAdminAccess) {
      throw new BadRequestException(
        'No puedes desactivar tu propia cuenta ni cambiar tu rol de administrador.',
      );
    }

    const targetWillRemainActiveAdmin =
      (dto.role ?? existingUser.role) ===
        'ADMIN' &&
      (dto.active ??
        existingUser.active) === true;

    const targetIsActiveAdmin =
      existingUser.role === 'ADMIN' &&
      existingUser.active;

    if (
      targetIsActiveAdmin &&
      !targetWillRemainActiveAdmin
    ) {
      const activeAdminCount =
        await this.prisma.user.count({
          where: {
            role: 'ADMIN',
            active: true,
          },
        });

      if (activeAdminCount <= 1) {
        throw new BadRequestException(
          'No puedes desactivar ni cambiar el rol del último administrador activo.',
        );
      }
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...(dto.role !== undefined
          ? {
              role: dto.role,
            }
          : {}),
        ...(dto.active !== undefined
          ? {
              active: dto.active,
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findForAuth(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        role: true,
        active: true,
      },
    });
  }
}
