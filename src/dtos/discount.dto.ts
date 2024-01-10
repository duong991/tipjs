import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsDate,
  IsBoolean,
  IsNumber,
  IsArray,
  IsEnum,
} from 'class-validator';

export class CreateDiscountDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(9)
  @MinLength(3)
  public code: string;

  @IsNotEmpty()
  public start_date: string;

  @IsNotEmpty()
  public end_date: string;

  @IsBoolean()
  @IsNotEmpty()
  public is_active: Boolean;

  @IsNumber()
  @IsNotEmpty()
  public min_order_value: Number;

  @IsArray()
  public product_ids: Array<string>;

  @IsString()
  @IsEnum(['specific', 'all'])
  public applies_to: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['fixed', 'percentage'])
  public type: string;

  @IsNumber()
  @IsNotEmpty()
  public value: Number;

  @IsNumber()
  @IsNotEmpty()
  public max_uses: Number;

  @IsNumber()
  @IsNotEmpty()
  public uses_count: Number;

  @IsNumber()
  @IsNotEmpty()
  public max_uses_per_user: Number;
}

export class GetProductsByDiscountCodeDto {
  @IsString()
  @IsNotEmpty()
  public code: string;

  @IsString()
  @IsNotEmpty()
  public shopId: string;
}
