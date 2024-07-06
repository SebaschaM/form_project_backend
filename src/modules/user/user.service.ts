import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // Intenta crear un nuevo usuario con los datos proporcionados en createUserDto
      const newUser = await this.prisma.cliente.create({
         data: {
          nombres: createUserDto.nombres,
          apellidos: createUserDto.apellidos,
          edad: createUserDto.edad,
          direccion: createUserDto.direccion,
          correo: createUserDto.correo,
          celular: createUserDto.celular,
          fecha_nacimiento: createUserDto.fecha_nacimiento ?? new Date(), // Opcional, asigna la fecha actual si no está proporcionada
          estado_habilitado: createUserDto.estado_habilitado,
        },
      });
      return newUser;
    } catch (error) {
      // Manejo de errores, por ejemplo, violaciones de restricciones únicas
      if (error.code === 'P2002') {
        throw new HttpException(
          'El correo o celular ya está en uso',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error; // Lanza otros errores no manejados explícitamente
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
