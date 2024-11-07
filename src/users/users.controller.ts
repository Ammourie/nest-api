import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('users/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch('users/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete('users/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  @Post('auth/signup')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('auth/signin')
  signin(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.signin(loginUserDto);
  }
}
