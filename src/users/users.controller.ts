import { Controller, Get, Body, Patch, Query, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from './decorators/current-user.decorator';
@ApiBearerAuth()
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Serialize(UserDto)
  @Get('profile')
  me(@CurrentUser() user: User) {

    return this.usersService.findMe(user.id);
  }
  @Serialize(UserDto)
  @Get('users')
  findAll() {
    return this.usersService.findAll();
  }
  @Serialize(UserDto)
  @Get('user/details')
  findOne(@Query('id') id: string) {
    return this.usersService.findOne(+id);
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
