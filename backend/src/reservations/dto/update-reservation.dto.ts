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

export class UpdateReservationDto {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  customerName?: string;

  @IsString()
  @MaxLength(30)
  @IsOptional()
  customerPhone?: string;

  @IsEmail()
  @MaxLength(150)
  @IsOptional()
  customerEmail?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  people?: number;

  @IsDateString()
  @IsOptional()
  reservationAt?: string;

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
  @IsOptional()
  tableId?: number;
}
