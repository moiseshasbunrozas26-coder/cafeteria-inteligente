import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { UpdateReservationDto } from './dto/update-reservation.dto.js';

const ACTIVE_STATUSES = [
  'PENDING',
  'CONFIRMED',
] as const;

type ReservationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private async validateTable(
    tableId: number,
    people: number,
  ) {
    const table =
      await this.prisma.cafeTable.findUnique({
        where: {
          id: tableId,
        },
      });

    if (!table) {
      throw new NotFoundException(
        `No existe una mesa con el ID ${tableId}.`,
      );
    }

    if (
      !table.active ||
      table.status === 'OUT_OF_SERVICE'
    ) {
      throw new BadRequestException(
        `La mesa ${table.number} está fuera de servicio.`,
      );
    }

    if (people > table.capacity) {
      throw new BadRequestException(
        `La mesa ${table.number} admite ${table.capacity} personas, ` +
          `pero la reserva solicita ${people}.`,
      );
    }

    return table;
  }

  private validateFutureDate(
    reservationAt: Date,
    status: ReservationStatus,
  ) {
    if (
      ACTIVE_STATUSES.includes(
        status as (typeof ACTIVE_STATUSES)[number],
      ) &&
      reservationAt.getTime() <= Date.now()
    ) {
      throw new BadRequestException(
        'La fecha y hora de la reserva deben estar en el futuro.',
      );
    }
  }

  private async validateAvailability(
    tableId: number,
    reservationAt: Date,
    durationMinutes: number,
    excludeReservationId?: number,
  ) {
    const maximumDurationMilliseconds =
      240 * 60 * 1000;

    const requestedStart =
      reservationAt.getTime();

    const requestedEnd =
      requestedStart +
      durationMinutes * 60 * 1000;

    const possibleConflicts =
      await this.prisma.reservation.findMany({
        where: {
          tableId,
          status: {
            in: [...ACTIVE_STATUSES],
          },
          reservationAt: {
            gte: new Date(
              requestedStart -
                maximumDurationMilliseconds,
            ),
            lt: new Date(requestedEnd),
          },
          ...(excludeReservationId
            ? {
                id: {
                  not: excludeReservationId,
                },
              }
            : {}),
        },
        include: {
          table: true,
        },
      });

    const conflict =
      possibleConflicts.find(
        (reservation) => {
          const existingStart =
            reservation.reservationAt.getTime();

          const existingEnd =
            existingStart +
            reservation.durationMinutes *
              60 *
              1000;

          return (
            requestedStart < existingEnd &&
            requestedEnd > existingStart
          );
        },
      );

    if (conflict) {
      throw new BadRequestException(
        `La mesa ${conflict.table.number} ya tiene una reserva ` +
          `que se superpone con ese horario.`,
      );
    }
  }

  async create(
    dto: CreateReservationDto,
  ) {
    const reservationAt =
      new Date(dto.reservationAt);

    const durationMinutes =
      dto.durationMinutes ?? 90;

    const status: ReservationStatus =
      dto.status ?? 'PENDING';

    this.validateFutureDate(
      reservationAt,
      status,
    );

    await this.validateTable(
      dto.tableId,
      dto.people,
    );

    if (
      ACTIVE_STATUSES.includes(
        status as (typeof ACTIVE_STATUSES)[number],
      )
    ) {
      await this.validateAvailability(
        dto.tableId,
        reservationAt,
        durationMinutes,
      );
    }

    return this.prisma.reservation.create({
      data: {
        customerName: dto.customerName.trim(),
        customerPhone:
          dto.customerPhone.trim(),
        customerEmail:
          dto.customerEmail?.trim() || null,
        people: dto.people,
        reservationAt,
        durationMinutes,
        status,
        notes: dto.notes?.trim() || null,
        tableId: dto.tableId,
      },
      include: {
        table: true,
      },
    });
  }

  findAll() {
    return this.prisma.reservation.findMany({
      include: {
        table: true,
      },
      orderBy: [
        {
          reservationAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],
    });
  }

  async findOne(id: number) {
    const reservation =
      await this.prisma.reservation.findUnique({
        where: {
          id,
        },
        include: {
          table: true,
        },
      });

    if (!reservation) {
      throw new NotFoundException(
        `No existe una reserva con el ID ${id}.`,
      );
    }

    return reservation;
  }

  async update(
    id: number,
    dto: UpdateReservationDto,
  ) {
    const current =
      await this.prisma.reservation.findUnique({
        where: {
          id,
        },
      });

    if (!current) {
      throw new NotFoundException(
        `No existe una reserva con el ID ${id}.`,
      );
    }

    const tableId =
      dto.tableId ?? current.tableId;

    const people =
      dto.people ?? current.people;

    const reservationAt =
      dto.reservationAt
        ? new Date(dto.reservationAt)
        : current.reservationAt;

    const durationMinutes =
      dto.durationMinutes ??
      current.durationMinutes;

    const status =
      (dto.status ??
        current.status) as ReservationStatus;

    this.validateFutureDate(
      reservationAt,
      status,
    );

    await this.validateTable(
      tableId,
      people,
    );

    if (
      ACTIVE_STATUSES.includes(
        status as (typeof ACTIVE_STATUSES)[number],
      )
    ) {
      await this.validateAvailability(
        tableId,
        reservationAt,
        durationMinutes,
        id,
      );
    }

    return this.prisma.reservation.update({
      where: {
        id,
      },
      data: {
        ...(dto.customerName !== undefined
          ? {
              customerName:
                dto.customerName.trim(),
            }
          : {}),
        ...(dto.customerPhone !== undefined
          ? {
              customerPhone:
                dto.customerPhone.trim(),
            }
          : {}),
        ...(dto.customerEmail !== undefined
          ? {
              customerEmail:
                dto.customerEmail.trim() ||
                null,
            }
          : {}),
        ...(dto.people !== undefined
          ? {
              people,
            }
          : {}),
        ...(dto.reservationAt !== undefined
          ? {
              reservationAt,
            }
          : {}),
        ...(dto.durationMinutes !== undefined
          ? {
              durationMinutes,
            }
          : {}),
        ...(dto.status !== undefined
          ? {
              status,
            }
          : {}),
        ...(dto.notes !== undefined
          ? {
              notes:
                dto.notes.trim() || null,
            }
          : {}),
        ...(dto.tableId !== undefined
          ? {
              tableId,
            }
          : {}),
      },
      include: {
        table: true,
      },
    });
  }

  async cancel(id: number) {
    const reservation =
      await this.prisma.reservation.findUnique({
        where: {
          id,
        },
      });

    if (!reservation) {
      throw new NotFoundException(
        `No existe una reserva con el ID ${id}.`,
      );
    }

    if (
      reservation.status === 'CANCELLED'
    ) {
      throw new BadRequestException(
        'La reserva ya se encuentra cancelada.',
      );
    }

    return this.prisma.reservation.update({
      where: {
        id,
      },
      data: {
        status: 'CANCELLED',
      },
      include: {
        table: true,
      },
    });
  }
}
