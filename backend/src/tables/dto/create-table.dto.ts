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

export class CreateTableDto {
  @IsInt()
  @Min(1)
  number: number;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsIn(TABLE_STATUSES)
  @IsOptional()
  status?: TableStatus;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}