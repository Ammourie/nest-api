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
  UseGuards,
  Headers,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
@ApiBearerAuth()
@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Serialize(UserDto)
  @Get('users')
  findAll() {
    return this.usersService.findAll();
  }
  @Serialize(UserDto)
  @Get('profile')
  me(@Headers() headers) {
    const token = headers.authorization?.split(' ')[1];

    return this.usersService.findMe(token);
  }

  @Serialize(UserDto)
  @Get('users/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Serialize(UserDto)
  @Patch('users/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Serialize(UserDto)
  @Delete('users/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
