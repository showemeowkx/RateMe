import {
  IsHexColor,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  slug: string;

  @IsNotEmpty()
  @IsHexColor()
  color: string;
}
