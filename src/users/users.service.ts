import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    try {
      const user = this.repo.create(createUserDto);
      return await this.repo.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException(error.driverError.code);
      }
      throw error;
    }
  }

  async signin(loginUserDto: LoginUserDto) {
    try {
      const user = await this.repo.findOne({
        where: { email: loginUserDto.email },
      });
      if (!user) throw new NotFoundException('User not found');
      if (loginUserDto.password !== user.password)
        throw new UnauthorizedException('Invalid credentials');
      return user;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException(error.driverError.code);
      }
      throw error;
    }
  }
  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
