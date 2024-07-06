import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  ResponseUserDto,
  ResponseUsersDto,
  ResponseWrapperDto,
} from './dto/reponse-user-dto';
import { BaseResponseUserDto } from './dto/base-response-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<BaseResponseUserDto> {
    try {
      await this.prisma.cliente.create({
        data: {
          ...createUserDto,
        },
      });

      return {
        statusCode: 201,
        message: 'Usuario creado exitosamente',
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Correo o celular ya están en uso');
      }
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<ResponseUsersDto> {
    try {
      const users = await this.prisma.cliente.findMany();

      const responseUsers: ResponseUserDto[] = users.map((user) => ({
        cliente_id: user.cliente_id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        edad: user.edad,
        direccion: user.direccion,
        correo: user.correo,
        celular: user.celular,
        fecha_nacimiento: user.fecha_nacimiento?.toISOString() || null,
        estado_habilitado: user.estado_habilitado,
        fecha_creacion: user.fecha_creacion.toISOString(),
        fecha_modificacion: user.fecha_modificacion.toISOString(),
      }));

      return {
        statusCode: 200,
        message: 'Usurios recuperados exitosamente',
        data: responseUsers,
      };
    } catch (error) {
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<ResponseWrapperDto> {
    try {
      const user = await this.prisma.cliente.findUnique({
        where: { cliente_id: id },
      });

      if (!user) {
        throw new NotFoundException(`Usuario no encontrado`);
      }

      return new ResponseWrapperDto(
        HttpStatus.OK,
        'User retrieved successfully',
        user,
      );
    } catch (error) {
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateState(id: number): Promise<BaseResponseUserDto> {
    try {
      const user = await this.prisma.cliente.findUnique({
        where: { cliente_id: id },
      });

      if (!user) {
        throw new NotFoundException(`Usuario no encontrado`);
      }

      const updatedUser = await this.prisma.cliente.update({
        where: { cliente_id: id },
        data: {
          estado_habilitado: !user.estado_habilitado,
        },
      });

      return new BaseResponseUserDto(
        HttpStatus.OK,
        `Estado del usuario cambiado a ${updatedUser.estado_habilitado ? 'habilitado' : 'deshabilitado'}`,
      );
    } catch (error) {
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<BaseResponseUserDto> {
    try {
      const user = await this.prisma.cliente.findUnique({
        where: { cliente_id: id },
      });

      if (!user) {
        throw new NotFoundException(`Usuario no encontrado`);
      }

      const updateData = { ...updateUserDto };
      const hasUpdates = Object.keys(updateData).length > 0;

      if (!hasUpdates) {
        throw new BadRequestException('Información de usuario no proporcionada');
      }

      // Comparar los datos proporcionados con los datos existentes
      const isSameData = Object.keys(updateData).every(key => user[key] === updateData[key]);

      if (isSameData) {
        throw new BadRequestException('No se realizaron cambios en los datos del usuario');
      }

      await this.prisma.cliente.update({
        where: { cliente_id: id },
        data: updateData,
      });

      return new BaseResponseUserDto(
        HttpStatus.OK,
        'User updated successfully',
      );
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Correo o celular ya están en uso');
      }
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  async remove(id: number): Promise<BaseResponseUserDto> {
    try {
      const user = await this.prisma.cliente.findUnique({
        where: { cliente_id: id },
      });

      if (!user) {
        throw new NotFoundException(`Usuario no encontrado`);
      }

      await this.prisma.cliente.delete({
        where: { cliente_id: id },
      });

      return new BaseResponseUserDto(
        HttpStatus.OK,
        'Usuario eliminado exitosamente',
      );
    } catch (error) {
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
