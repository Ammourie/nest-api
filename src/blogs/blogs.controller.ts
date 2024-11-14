import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  Delete,
  Param,
  Session,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { BlogDto } from './dto/blog.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApproveBlogDto } from './dto/approve-blog.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { BlogsFilterDto } from './dto/blogs-filter.dto';
import { serialize } from 'v8';
@ApiBearerAuth()
@Controller('api')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @UseGuards(AdminGuard)
  @Serialize(BlogDto)
  @ApiQuery({ name: 'search', required: false, type: 'string' })
  @ApiQuery({ name: 'approved', required: false, type: 'boolean' })
  @ApiQuery({ name: 'author', required: false, type: 'number' })
  @ApiQuery({ name: 'page', required: false, type: 'number', minimum: 0 })
  @ApiQuery({ name: 'pageSize', required: false, type: 'number', minimum: 1 })
  @ApiQuery({ name: 'blogId', required: false, type: 'number' })
  @Get('admin/blogs')
  findAllAdmin(@CurrentUser() user: User, @Query() filters: BlogsFilterDto) {
    return this.blogsService.findAll(user, filters);
  }

  @Patch('admin/blog/approve/:id')
  @UseGuards(AdminGuard)
  approveBlog(@Param('id') id: string, @Body() body: ApproveBlogDto) {
    return this.blogsService.approveBlog(+id, body.approved);
  }

  @ApiQuery({ name: 'search', required: false, type: 'string' })
  @ApiQuery({ name: 'approved', required: false, type: 'boolean' })
  @ApiQuery({ name: 'author', required: false, type: 'number' })
  @ApiQuery({ name: 'page', required: false, type: 'number', minimum: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: 'number', minimum: 1 })
  @ApiQuery({ name: 'blogId', required: false, type: 'number' })
  @Serialize(BlogDto)
  @Get('blogs')
  findAll(@CurrentUser() user: User, @Query() filters: BlogsFilterDto) {
    if (filters.blogId)
      return this.blogsService.findOne(+filters.blogId, user.id);
    else {
      return this.blogsService.findAll(user, filters);
    }
  }

  @Post('blogs/create')
  create(@Body() createBlogDto: CreateBlogDto, @CurrentUser() user: User) {
    return this.blogsService.create(createBlogDto, user);
  }

  @Patch('blogs/update')
  update(
    @Query('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @CurrentUser() user: User,
  ) {
    return this.blogsService.update(+id, updateBlogDto, user.id);
  }

  @Delete('blogs/delete')
  remove(@Query('id') id: string, @CurrentUser() user: User) {
    return this.blogsService.remove(+id, user.id);
  }
}
