import {
  IsBoolean,
  IsIn,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsIn(['ADMIN', 'STAFF'], {
    message: 'El rol debe ser ADMIN o STAFF.',
  })
  role?: 'ADMIN' | 'STAFF';

  @IsOptional()
  @IsBoolean({
    message: 'El estado active debe ser true o false.',
  })
  active?: boolean;
}