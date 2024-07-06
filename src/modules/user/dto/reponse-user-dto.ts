import { BaseResponseUserDto } from './base-response-user.dto';

export class ResponseUserDto {
  cliente_id: number;
  nombres: string;
  apellidos: string;
  edad: number | null;
  direccion: string | null;
  correo: string;
  celular: string;
  fecha_nacimiento: string | null;
  estado_habilitado: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;

  constructor(user: any, statusCode: number, message: string) {
    this.cliente_id = user.cliente_id;
    this.nombres = user.nombres;
    this.apellidos = user.apellidos;
    this.edad = user.edad ?? null;
    this.direccion = user.direccion ?? null;
    this.correo = user.correo;
    this.celular = user.celular;
    this.fecha_nacimiento = user.fecha_nacimiento
      ? user.fecha_nacimiento.toISOString()
      : null;
    this.estado_habilitado = user.estado_habilitado;
    this.fecha_creacion = user.fecha_creacion.toISOString();
    this.fecha_modificacion = user.fecha_modificacion.toISOString();
  }
}

export class ResponseWrapperDto extends BaseResponseUserDto {
  data: ResponseUserDto;

  constructor(statusCode: number, message: string, user: any) {
    super(statusCode, message);
    this.data = new ResponseUserDto(user, statusCode, message);
  }
}

export class ResponseUsersDto extends BaseResponseUserDto {
  data: ResponseUserDto[];

  constructor(statusCode: number, message: string, user: any) {
    super(statusCode, message);
    this.data = user.map(
      (user: any) => new ResponseUserDto(user, statusCode, message),
    );
  }
}
