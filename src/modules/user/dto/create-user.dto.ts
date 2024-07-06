import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
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

  @IsOptional()
  @IsInt()
  @Min(18)
  edad?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  direccion?: string;

  @IsEmail()
  @MaxLength(100)
  correo: string;

  @IsString()
  @Matches(/^[0-9]{9,11}$/)
  celular: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const [day, month, year] = value.split('/');
      if (!day || !month || !year) {
        throw new Error('Invalid date format. Expected DD/MM/YYYY.');
      }
      return new Date(`${year}-${month}-${day}`).toISOString();
    }
    return value;
  })
  fecha_nacimiento?: string;

  @IsBoolean()
  @Transform(() => true)
  estado_habilitado: boolean;
}
