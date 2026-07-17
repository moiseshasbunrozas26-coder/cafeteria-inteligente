import {
  IsInt,
  Min,
} from 'class-validator';

export class CreateSaleItemDto {
  @IsInt()
  @Min(1)
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}