import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { BlogsFilterDto } from './dto/blogs-filter.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private repo: Repository<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto, user: User) {
    const blog = this.repo.create({ ...createBlogDto, user });

    return this.repo.save(blog);
  }

  async findAll(user: User, filters: BlogsFilterDto) {
    console.log(user, filters);

    const filterOptions: any = {};
    filterOptions.order = { created_at: 'DESC' };
    if (filters.search) {
      filterOptions.where = { ...filterOptions.where, title: filters.search };
    }

    if (filters.approved !== undefined) {
      filterOptions.where = { ...filterOptions.where, approved: filters.approved };
    }

    if (filters.author) {
      filterOptions.where = { ...filterOptions.where, user: { id: filters.author } };
    }

    if (filters.blogId) {
      filterOptions.where = { ...filterOptions.where, id: filters.blogId };
    }

    if (filters.page && filters.pageSize) {
      filterOptions.skip = (filters.page - 1) * filters.pageSize;
      filterOptions.take = filters.pageSize;
    }

    if (user.isAdmin) {
      filterOptions.user = { id: user.id };
    }

    return await this.repo.find(filterOptions);
  }

  async findOne(id: number, userId: number) {
    const blog = await this.repo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  async update(id: number, updateBlogDto: UpdateBlogDto, userId: number) {
    const blog = await this.repo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!blog) throw new NotFoundException('Blog not found');
    await this.repo.update(id, { ...updateBlogDto });
    return 'Blog updated successfully';
  }

  async remove(id: number, userId: number) {
    const blog = await this.repo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!blog) throw new NotFoundException('Blog not found');
    await this.repo.delete(id);
    return 'Blog deleted successfully';
  }

  async approveBlog(id: number, approved: boolean) {
    const blog = await this.repo.findOne({
      where: { id },
    });
    if (!blog) throw new NotFoundException('Blog not found');
    blog.approved = approved;
    return await this.repo.save(blog);
  }
}
