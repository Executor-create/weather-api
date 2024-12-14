import {
  IsNumber,
  IsNotEmpty,
  Min,
  Max,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateWeatherDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(-90)
  @Max(90)
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(-180)
  @Max(180)
  lon: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  part: string;
}
