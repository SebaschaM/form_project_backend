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

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(4, 50)
  nombres?: string;

  @IsOptional()
  @IsString()
  @Length(4, 50)
  apellidos?: string;

  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  edad?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  direccion?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  correo?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{9,11}$/)
  celular?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const [day, month, year] = value.split('/');
      if (!day || !month || !year || isNaN(Date.parse(`${year}-${month}-${day}`))) {
        throw new Error('Invalid date format. Expected DD/MM/YYYY.');
      }
      return new Date(`${year}-${month}-${day}`).toISOString();
    }
    return value;
  })
  @IsDate()
  fecha_nacimiento?: string;

  @IsOptional()
  @IsBoolean()
  estado_habilitado?: boolean;
}
