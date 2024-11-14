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
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Serialize } from '..//interceptors/serialize.interceptor';
import { AccessTokenDto } from './dto/access_token_dto';
import { Public } from './public.decorator';
import { JwtService } from '@nestjs/jwt';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiQuery } from '@nestjs/swagger';

@Public()
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  @ApiQuery({ name: 'isAdmin', required: false })
  async signup(
    @Body() RegisterDto: RegisterDto,
    @Query('isAdmin') isAdmin?: boolean,
  ) {
    const user = await this.authService.signUp(RegisterDto, isAdmin);
    return user;
  }

  @Serialize(AccessTokenDto)
  @Post('login')
  async login(@Body() LoginDto: LoginDto) {
    const user = await this.authService.signIn(LoginDto);

    return user;
  }

  @Post('signout')
  signout(@CurrentUser() user: User) {
    return this.authService.signOut(user.id);
  }
}
