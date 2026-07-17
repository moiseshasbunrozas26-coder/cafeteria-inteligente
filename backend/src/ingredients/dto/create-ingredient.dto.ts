import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

const INGREDIENT_UNITS = [
  'GRAM',
  'KILOGRAM',
  'MILLILITER',
  'LITER',
  'UNIT',
] as const;

type IngredientUnit = (typeof INGREDIENT_UNITS)[number];

export class CreateIngredientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(INGREDIENT_UNITS)
  unit: IngredientUnit;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @IsOptional()
  currentStock?: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @IsOptional()
  minimumStock?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  costPerUnit?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}