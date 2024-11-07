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
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { AccessTokenDto } from './dto/access_token_dto';
@Controller('auth')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Serialize(UserDto)
  @Get('users')
  findAll() {
    return this.usersService.findAll();
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
  @Serialize(AccessTokenDto)
  @Post('signup')
  createUser(@Body() body: RegisterDto) {
    return this.authService.signUp(body.email, body.password, body.fullName);
  }

  @Serialize(AccessTokenDto)
  @Post('signin')
  signin(@Body() body: LoginDto) {
    return this.authService.signIn(body.email, body.password);
  }
}
