import { IsNotEmpty } from 'class-validator';

export class CustomerDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  company: string;
}
