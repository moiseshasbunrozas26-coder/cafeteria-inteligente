import {
  IsNumber,
  Min,
} from 'class-validator';

export class UpdateRecipeIngredientDto {
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001)
  quantity: number;
}