import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';

const TABLE_STATUSES = [
  'AVAILABLE',
  'OCCUPIED',
  'RESERVED',
  'OUT_OF_SERVICE',
] as const;

type TableStatus = (typeof TABLE_STATUSES)[number];

export class UpdateTableDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  number?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @IsIn(TABLE_STATUSES)
  @IsOptional()
  status?: TableStatus;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}