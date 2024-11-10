import { PartialType } from '@nestjs/swagger';
import { RegisterDto } from '../../auth/dto/register.dto';
import { UserDto } from './user.dto';

export class UpdateUserDto extends PartialType(UserDto) {}
