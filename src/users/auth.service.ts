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
const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}
  async signUp(email: string, password: string) {
    let users = await this.usersService.findByEmail(email);
    if (users.length) throw new BadRequestException('email used!!');

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const res = salt + '.' + hash.toString('hex');

    const user = this.repo.create({ email: email, password: res });
    return this.repo.save(user);

    // try {
    //   return await this.repo.save(user);
    // } catch (error) {
    //   if (error instanceof QueryFailedError) {
    //     throw new InternalServerErrorException(error.driverError.code);
    //   }
    //   throw error;
    // }
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

      return user;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException(error.driverError.code);
      }
      throw error;
    }
  }
}
