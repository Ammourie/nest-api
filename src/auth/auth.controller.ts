import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Session,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Serialize } from '..//interceptors/serialize.interceptor';
import { AccessTokenDto } from './dto/access_token_dto';
import { Public } from './public.decorator';
import { JwtService } from '@nestjs/jwt';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  
  @Post('signup')
  async signup(@Body() RegisterDto: RegisterDto, @Session() session: any) {
    const user = await this.authService.signUp(RegisterDto);
    session.user = user;
    return user;
  }
  @Serialize(AccessTokenDto)
  @Post('login')
  async login(@Body() LoginDto: LoginDto, @Session() session: any) {
    const user = await this.authService.signIn(LoginDto);
    session.user = user;

    return user;
  }

  @Post('signout')
  signout(@Session() session: any) {
    session.user = null;
    return { message: 'Successfully signed out' };
  }


}
