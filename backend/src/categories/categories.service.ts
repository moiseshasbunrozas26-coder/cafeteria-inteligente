import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const name = dto.name.trim();

    const existingCategory =
      await this.prisma.category.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
        },
      });

    if (existingCategory) {
      throw new ConflictException(
        'Ya existe una categoría con este nombre.',
      );
    }

    return this.prisma.category.create({
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!category) {
      throw new NotFoundException(
        `No existe una categoría con ID ${id}.`,
      );
    }

    const name = dto.name?.trim();

    if (name) {
      const duplicateCategory =
        await this.prisma.category.findFirst({
          where: {
            id: {
              not: id,
            },
            name: {
              equals: name,
              mode: 'insensitive',
            },
          },
          select: {
            id: true,
          },
        });

      if (duplicateCategory) {
        throw new ConflictException(
          'Ya existe otra categoría con este nombre.',
        );
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}