import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AccessTokenDto } from './dto/access_token_dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Serialize(AccessTokenDto)
  @Post('signup')
  signup(@Body() RegisterDto: RegisterDto) {
    return this.authService.signUp(RegisterDto);
  }
  @Serialize(AccessTokenDto)
  @Post('login')
  login(@Body() LoginDto: LoginDto) {
    return this.authService.signIn(LoginDto);
  }
}
