import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(5)
  duration: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}