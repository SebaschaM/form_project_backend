import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(4, 50)
  nombres: string;

  @IsString()
  @Length(4, 50)
  apellidos: string;

  @IsInt()
  @Min(18)
  @Max(100)
  edad: number;

  @IsString()
  @MaxLength(500)
  direccion: string;

  @IsEmail()
  @MaxLength(100)
  correo: string;

  @IsString()
  @Matches(/^[0-9]{9,11}$/)
  celular: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  fecha_nacimiento?: Date;

  @IsBoolean()
  estado_habilitado: boolean;
}
