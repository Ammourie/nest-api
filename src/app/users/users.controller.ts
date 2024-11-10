import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
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
  constructor(private readonly usersService: UsersService) {}

  @Serialize(UserDto)
  @Get('user')
  findOne(@Query('id') id: string) {
    return this.usersService.findOne(+id);
  }
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
  @Patch('users/update')
  update(@Query('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Serialize(UserDto)
  @Delete('users/delete')
  remove(@Query('id') id: string) {
    return this.usersService.remove(+id);
  }
}
