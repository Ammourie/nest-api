import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()  
  email: string;
  
  @IsNotEmpty()
  @ApiProperty()  
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}
