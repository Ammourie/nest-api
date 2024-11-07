/*
https://docs.nestjs.com/providers#services
*/

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { QueryFailedError, Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dto/login.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(User)
    private repo: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async signUp(email: string, password: string, fullName: string) {
    let users = await this.usersService.findByEmail(email);
    if (users.length) throw new BadRequestException('email used!!');

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const res = salt + '.' + hash.toString('hex');

    const user = this.repo.create({ email, password: res, fullName });
    const payload = { sub: user.id, username: user.fullName };
    user.access_token = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn: jwtConstants.expire,
    });
    this.repo.save(user);

    return user;
  }

  async signIn(email: string, password: string) {
    try {
      const user = await this.repo.findOne({
        where: { email },
      });
      if (!user) throw new NotFoundException('User not found');

      const [salt, storedHash] = user.password.split('.');
      const hash = (await scrypt(password, salt, 32)) as Buffer;

      if (storedHash !== hash.toString('hex'))
        throw new BadRequestException('invalid credentials!');
      const payload = { sub: user.id, username: user.fullName };
      let token = user.access_token;
      let isTokenExpired = false;
      if (token != null) {
        let decodedToken = this.jwtService.decode(token);
        const currentDateTime = new Date();
        const tokenExpirationDateTime = new Date(decodedToken.exp * 1000);
        isTokenExpired = currentDateTime > tokenExpirationDateTime;
      }
      console.log('isTokenExpire:', isTokenExpired);

      if (isTokenExpired) {
        token = await this.jwtService.signAsync(payload, {
          secret: jwtConstants.secret,
          expiresIn: jwtConstants.expire,
        });
        this.usersService.update(user.id, { access_token: token });
      }
      return user;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException(error.driverError.code);
      }
      throw error;
    }
  }
}
