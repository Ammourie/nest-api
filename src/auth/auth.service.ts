import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { scrypt as _scrypt } from 'crypto';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { promisify } from 'util';
import { InjectRepository } from '@nestjs/typeorm';
import { FirebaseService } from 'src/firebase/firebase.service';
const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private repo: Repository<User>,
    private firebaseService: FirebaseService,
  ) {}

  async signUp(RegisterDto: RegisterDto) {
    const { email, password, fullName } = RegisterDto;

    let users = await this.usersService.findByEmail(RegisterDto.email);
    if (users.length) throw new BadRequestException('email used!!');

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const res = salt + '.' + hash.toString('hex');

    const user = this.repo.create({ email, password: res, fullName });

    const storedUser = await this.repo.save(user);

    // this.firebaseService.storeUser(storedUser);

    return { success: true };
  }

  async signIn(LoginDto: LoginDto) {
    try {
      const { email, password } = LoginDto;
      let user = await this.repo.findOne({
        where: { email },
      });
      if (!user) throw new NotFoundException('User not found');

      const [salt, storedHash] = user.password.split('.');
      const hash = (await scrypt(password, salt, 32)) as Buffer;

      if (storedHash !== hash.toString('hex'))
        throw new BadRequestException('invalid credentials!');
      const payload = {
        userId: user.id,
        fullName: user.fullName,
      };
      let token = user.access_token;
      let isTokenExpired = true;
      if (token != null) {
        let decodedToken = this.jwtService.decode(token);
        const currentDateTime = new Date();
        const tokenExpirationDateTime = new Date(decodedToken.exp * 1000);
        isTokenExpired = currentDateTime > tokenExpirationDateTime;
      } else {
        isTokenExpired = true;
      }

      if (isTokenExpired) {
        token = await this.jwtService.signAsync(payload, {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        user = await this.usersService.update(user.id, { access_token: token });

        console.log(token);
      }
      return user;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException(error.driverError.code);
      }
      throw error;
    }
  }
  async signOut(id: number) {
    await this.usersService.update(id, { access_token: null });
    return { message: 'Successfully signed out' };
  }
}
