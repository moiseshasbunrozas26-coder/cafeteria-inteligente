import {
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

const RESERVATION_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
] as const;

type ReservationStatus =
  (typeof RESERVATION_STATUSES)[number];

export class CreateReservationDto {
  @IsString()
  @MaxLength(100)
  customerName: string;

  @IsString()
  @MaxLength(30)
  customerPhone: string;

  @IsEmail()
  @MaxLength(150)
  @IsOptional()
  customerEmail?: string;

  @IsInt()
  @Min(1)
  people: number;

  @IsDateString()
  reservationAt: string;

  @IsInt()
  @Min(30)
  @Max(240)
  @IsOptional()
  durationMinutes?: number;

  @IsIn(RESERVATION_STATUSES)
  @IsOptional()
  status?: ReservationStatus;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  notes?: string;

  @IsInt()
  @Min(1)
  tableId: number;
}
