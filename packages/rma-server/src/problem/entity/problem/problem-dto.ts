import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProblemDto {
  @IsNotEmpty()
  @IsString()
  problem_name: string;
}

export class UpdateProblemDto {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  @IsString()
  problem_name: string;
}
