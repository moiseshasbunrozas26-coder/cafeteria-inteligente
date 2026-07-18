import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTableDto } from './dto/create-table.dto.js';
import { UpdateTableDto } from './dto/update-table.dto.js';

@Injectable()
export class TablesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTableDto: CreateTableDto) {
    const existingTable = await this.prisma.cafeTable.findUnique({
      where: {
        number: createTableDto.number,
      },
    });

    if (existingTable) {
      throw new BadRequestException(
        `Ya existe una mesa con el número ${createTableDto.number}.`,
      );
    }

    return this.prisma.cafeTable.create({
      data: createTableDto,
    });
  }

  findAll() {
    return this.prisma.cafeTable.findMany({
      orderBy: {
        number: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const table = await this.prisma.cafeTable.findUnique({
      where: { id },
      include: {
        sales: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!table) {
      throw new NotFoundException(
        `No existe una mesa con el ID ${id}.`,
      );
    }

    return table;
  }

  async update(id: number, updateTableDto: UpdateTableDto) {
    const currentTable = await this.prisma.cafeTable.findUnique({
      where: { id },
    });

    if (!currentTable) {
      throw new NotFoundException(
        `No existe una mesa con el ID ${id}.`,
      );
    }

    if (
      updateTableDto.number !== undefined &&
      updateTableDto.number !== currentTable.number
    ) {
      const tableWithSameNumber =
        await this.prisma.cafeTable.findUnique({
          where: {
            number: updateTableDto.number,
          },
        });

      if (tableWithSameNumber) {
        throw new BadRequestException(
          `Ya existe una mesa con el número ${updateTableDto.number}.`,
        );
      }
    }

    return this.prisma.cafeTable.update({
      where: { id },
      data: updateTableDto,
    });
  }

  async remove(id: number) {
    const table = await this.prisma.cafeTable.findUnique({
      where: { id },
    });

    if (!table) {
      throw new NotFoundException(
        `No existe una mesa con el ID ${id}.`,
      );
    }

    return this.prisma.cafeTable.update({
      where: { id },
      data: {
        active: false,
        status: 'OUT_OF_SERVICE',
      },
    });
  }
}