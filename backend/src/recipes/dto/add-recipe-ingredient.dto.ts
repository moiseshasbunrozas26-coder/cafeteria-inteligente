import {
  IsInt,
  IsNumber,
  Min,
} from 'class-validator';

export class AddRecipeIngredientDto {
  @IsInt()
  @Min(1)
  ingredientId: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001)
  quantity: number;
}