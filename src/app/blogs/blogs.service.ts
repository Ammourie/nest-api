import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private repo: Repository<Blog>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async create(createBlogDto: CreateBlogDto, access_token: string) {
    const user = await this.usersService.findMe(access_token);
    if (!user) throw new NotFoundException('User not found');
    const blog = this.repo.create({ ...createBlogDto, author_id: user.id });

    return this.repo.save(blog);
  }

  async findAll(access_token: string) {
    const user = await this.usersService.findMe(access_token);
    if (!user) throw new NotFoundException('User not found');
    return await this.repo.find({ where: { author_id: user.id } });
  }

  async findOne(id: number, access_token: string) {
    const user = await this.usersService.findMe(access_token);
    if (!user) throw new NotFoundException('User not found');
    const blog = await this.repo.findOne({ where: { id, author_id: user.id } });
    if (!blog) throw new ForbiddenException('You do not have access to this blog');
    return blog;
  }

  async update(id: number, updateBlogDto: UpdateBlogDto, access_token: string) {
    const user = await this.usersService.findMe(access_token);
    if (!user) throw new NotFoundException('User not found');
    const blog = await this.repo.findOne({ where: { id, author_id: user.id } });
    if (!blog) throw new ForbiddenException('You do not have access to update this blog');
    await this.repo.update(id, { ...updateBlogDto, author_id: user.id });
    return 'Blog updated successfully';
  }

  async remove(id: number, access_token: string) {
    const user = await this.usersService.findMe(access_token);
    if (!user) throw new NotFoundException('User not found');
    const blog = await this.repo.findOne({ where: { id, author_id: user.id } });
    if (!blog) throw new ForbiddenException('You do not have access to delete this blog');
    await this.repo.delete(id);
    return 'Blog deleted successfully';
  }
}