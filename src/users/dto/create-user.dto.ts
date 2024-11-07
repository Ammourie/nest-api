import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()  
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}
