import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserValidationPipe } from './pipes/create-user-validation/create-user-validation.pipe';
import { ResponseUsersDto, ResponseWrapperDto } from './dto/reponse-user-dto';
import { BaseResponseUserDto } from './dto/base-response-user.dto';
import { UpdateUserValidationPipe } from './pipes/update-user-validation/update-user-validation.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  @UsePipes(new CreateUserValidationPipe())
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<BaseResponseUserDto> {
    return this.userService.create(createUserDto);
  }

  @Get('get-all-users')
  async findAll(): Promise<ResponseUsersDto> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseWrapperDto> {
    return await this.userService.findOne(+id);
  }

  @Put('update-state/:id')
  async updateState(@Param('id') id: string): Promise<BaseResponseUserDto> {
    return await this.userService.updateState(+id);
  }

  @Patch('update-user/:id')
  @UsePipes(new UpdateUserValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<BaseResponseUserDto> {
    return await this.userService.update(+id, updateUserDto);
  }

  @Delete('delete-user/:id')
  async remove(@Param('id') id: string): Promise<BaseResponseUserDto> {
    return await this.userService.remove(+id);
  }
}
