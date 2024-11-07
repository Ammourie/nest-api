import { PartialType } from '@nestjs/swagger';
import { RegisterDto } from './register.dto';
import { UserDto } from './user.dto';

export class UpdateUserDto extends PartialType(UserDto) {}
