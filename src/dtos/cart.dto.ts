import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateNewCartDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  product: Object;
}
