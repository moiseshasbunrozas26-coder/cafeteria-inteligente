import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

const MOVEMENT_TYPES = [
  'IN',
  'OUT',
  'ADJUSTMENT',
] as const;

type InventoryMovementType =
  (typeof MOVEMENT_TYPES)[number];

export class CreateInventoryMovementDto {
  @IsInt()
  @Min(1)
  ingredientId: number;

  @IsIn(MOVEMENT_TYPES)
  type: InventoryMovementType;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  quantity: number;

  @IsString()
  @MaxLength(250)
  @IsOptional()
  reason?: string;
}