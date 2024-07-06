import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class CreateUserValidationPipe implements PipeTransform<CreateUserDto> {
  async transform(
    value: CreateUserDto,
    { metatype }: ArgumentMetadata,
  ): Promise<CreateUserDto> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
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
}
