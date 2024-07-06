import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { CreateUserDto } from '../../dto/create-user.dto';

@Injectable()
export class CreateUserValidationPipe implements PipeTransform<CreateUserDto> {
  async transform(
    value: CreateUserDto,
    { metatype }: ArgumentMetadata,
  ): Promise<CreateUserDto> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    if (value.fecha_nacimiento) {
      this.validateAge(value.fecha_nacimiento);
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException(this.formatErrors(errors));
    }
    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: ValidationError[]) {
    return errors.reduce((acc, err) => {
      const constraints = Object.values(err.constraints).join(', ');
      acc.push({ field: err.property, errors: constraints });
      return acc;
    }, []);
  }

  private validateAge(fecha_nacimiento: string): void {
    const today = new Date();
    const birthDate = new Date(fecha_nacimiento);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    // Check if the user is at least 18 years old
    if (
      age < 18 ||
      (age === 18 && monthDifference < 0) ||
      (age === 18 && monthDifference === 0 && dayDifference < 0)
    ) {
      throw new BadRequestException('Debes ser mayor de 18 años para registrarte');
    }
  }
}
