import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  findAll() {
    return this.repo.find();
  }
  async findOne(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  async findMe(token: string) {
    const decodedToken = this.jwtService.verify(token, {
      secret: jwtConstants.secret,
    });
    
    if (!decodedToken) {
      throw new NotFoundException(`Invalid token`);
    }
    const user = await this.repo.findOne({ where: { access_token: token } });
    if (!user) {
      throw new NotFoundException(`User with ID ${token} not found`);
    }
    return user;
  }
  async findByEmail(email: string) {
    const users = await this.repo.find({ where: { email } });
    if (!users) {
      throw new NotFoundException(`User with ID ${email} not found`);
    }
    return users;
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.repo.findOne({ where: { id: +id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    Object.assign(user, updateUserDto);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.repo.remove(user);
  }
}
