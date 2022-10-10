import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTermsAndConditionsDto {
  @IsNotEmpty()
  @IsString()
  terms_and_conditions: string;
}

export class UpdateTermsAndConditionsDto {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  @IsString()
  terms_and_conditions: string;
}
