import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async create(createBlogDto: CreateBlogDto, userId: number) {
    const user = await this.usersService.findMe(userId);
    if (!user) throw new NotFoundException('User not found');
    const blog = this.repo.create({ ...createBlogDto, author_id: user.id });

    return this.repo.save(blog);
  }

  async findAll(userId: number) {
    const user = await this.usersService.findMe(userId);
    if (!user) throw new NotFoundException('User not found');
    return await this.repo.find({
      where: { author_id: user.id },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number, userId: number) {
    const user = await this.usersService.findMe(userId);
    if (!user) throw new NotFoundException('User not found');
    const blog = await this.repo.findOne({ where: { id, author_id: user.id } });
    if (!blog)
      throw new NotFoundException('Blog not found');
    return blog;
  }

  async update(id: number, updateBlogDto: UpdateBlogDto, userId: number) {
    const user = await this.usersService.findMe(userId);
    if (!user) throw new NotFoundException('User not found');
    const blog = await this.repo.findOne({ where: { id, author_id: user.id } });
    if (!blog)
      throw new NotFoundException('Blog not found');
    await this.repo.update(id, { ...updateBlogDto, author_id: user.id });
    return 'Blog updated successfully';
  }

  async remove(id: number, userId: number) {
    const user = await this.usersService.findMe(userId);
    if (!user) throw new NotFoundException('User not found');
    const blog = await this.repo.findOne({ where: { id, author_id: user.id } });
    if (!blog)
      throw new NotFoundException('Blog not found');
    await this.repo.delete(id);
    return 'Blog deleted successfully';
  }
}
